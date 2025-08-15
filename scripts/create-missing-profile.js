// Script to manually create the missing profile for the user
// Run with: node scripts/create-missing-profile.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Please update the environment variables in this script or set them in your environment')
  console.log('You need:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL (from your Supabase project settings)')
  console.log('- SUPABASE_SERVICE_ROLE_KEY (from your Supabase project API settings)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createProfile() {
  const userId = '6f5a06c6-712b-4716-8a6f-3a7491d7c6e9'
  const email = 'selwyn.uy@msugensan.edu.ph'
  
  console.log('🔧 Creating profile for user:', userId)
  
  try {
    // First check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (existingProfile) {
      console.log('✅ Profile already exists:', existingProfile)
      return existingProfile
    }
    
    // Create the profile
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: email.split('@')[0], // 'selwyn.uy'
        title: 'Full Stack Developer',
        bio: 'Passionate developer building modern web applications.',
        show_view_counts: true,
        show_featured_first: true,
        enable_blog: false,
        is_admin: true // Set as admin since this is your personal portfolio
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating profile:', error)
      return null
    }
    
    console.log('✅ Profile created successfully:', newProfile)
    return newProfile
    
  } catch (error) {
    console.error('❌ Failed to create profile:', error.message)
    return null
  }
}

// Also check and fix the user's email confirmation status
async function checkUserStatus() {
  const userId = '6f5a06c6-712b-4716-8a6f-3a7491d7c6e9'
  
  try {
    const { data: userData, error } = await supabase.auth.admin.getUserById(userId)
    
    if (error) {
      console.error('❌ User not found:', error.message)
      return
    }
    
    console.log('👤 User status:')
    console.log('- Email:', userData.user.email)
    console.log('- Email confirmed:', !!userData.user.email_confirmed_at)
    console.log('- Created:', userData.user.created_at)
    
    // If email is not confirmed, you can manually confirm it (for development)
    if (!userData.user.email_confirmed_at) {
      console.log('⚠️  Email not confirmed. You can manually confirm it in Supabase dashboard > Authentication > Users')
      
      // Uncomment the next lines to auto-confirm (only for development!)
      // const { error: confirmError } = await supabase.auth.admin.updateUserById(userId, {
      //   email_confirm: true
      // })
      // if (!confirmError) {
      //   console.log('✅ Email confirmed automatically')
      // }
    }
    
  } catch (error) {
    console.error('❌ Error checking user:', error.message)
  }
}

async function main() {
  console.log('🚀 Fixing missing profile...\n')
  
  await checkUserStatus()
  console.log()
  await createProfile()
  
  console.log('\n📋 Next steps:')
  console.log('1. Set up your .env.local file with proper Supabase credentials')
  console.log('2. Configure email provider in Supabase dashboard (Auth > Settings > SMTP Settings)')
  console.log('3. Test the signup flow again')
  console.log('4. Check that database triggers are working for future signups')
}

main()
