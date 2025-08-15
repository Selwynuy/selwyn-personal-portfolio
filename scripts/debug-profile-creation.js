// Debug script to check profile creation and triggers
// Run with: node scripts/debug-profile-creation.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.log('Please set these in your .env.local file:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugProfileCreation() {
  console.log('🔍 Debugging profile creation...\n')

  try {
    // 1. Check if triggers exist
    console.log('1️⃣ Checking database triggers...')
    const { data: triggers, error: triggerError } = await supabase
      .rpc('exec_sql', { 
        query: `
          SELECT trigger_name, event_manipulation, action_statement 
          FROM information_schema.triggers 
          WHERE trigger_schema = 'public' 
          AND (trigger_name LIKE '%user%' OR trigger_name LIKE '%profile%');
        `
      })
    
    if (triggerError) {
      console.log('⚠️  Could not check triggers (this is normal if using hosted Supabase)')
    } else {
      console.log('✅ Triggers found:', triggers)
    }

    // 2. Check if user exists
    const userId = '6f5a06c6-712b-4716-8a6f-3a7491d7c6e9'
    console.log(`\n2️⃣ Checking if user ${userId} exists...`)
    
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError) {
      console.log('❌ User not found:', userError.message)
      return
    }
    
    console.log('✅ User found:', {
      id: userData.user.id,
      email: userData.user.email,
      email_confirmed_at: userData.user.email_confirmed_at,
      created_at: userData.user.created_at
    })

    // 3. Check if profile exists
    console.log('\n3️⃣ Checking if profile exists...')
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.log('❌ Profile not found:', profileError.message)
      
      // 4. Try to create profile manually
      console.log('\n4️⃣ Creating profile manually...')
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userData.user.email.split('@')[0],
          title: 'Full Stack Developer',
          bio: 'Passionate developer building modern web applications.',
          show_view_counts: true,
          show_featured_first: true,
          enable_blog: false,
          is_admin: false
        })
        .select()
        .single()

      if (createError) {
        console.log('❌ Failed to create profile:', createError)
      } else {
        console.log('✅ Profile created successfully:', newProfile)
      }
    } else {
      console.log('✅ Profile already exists:', profileData)
    }

    // 5. Check admin functions
    console.log('\n5️⃣ Testing admin functions...')
    const { data: isAdminResult, error: adminError } = await supabase
      .rpc('is_admin', { user_id: userId })
    
    if (adminError) {
      console.log('❌ Admin function error:', adminError.message)
    } else {
      console.log('✅ Admin check result:', isAdminResult)
    }

  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

// Check email configuration
async function checkEmailConfig() {
  console.log('\n📧 Checking email configuration...')
  
  try {
    // This will only work with service role key
    const { data, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.log('⚠️  Cannot check email config (need service role key)')
    } else {
      console.log('✅ Connected to Supabase Auth successfully')
      console.log(`👥 Total users: ${data.users.length}`)
      
      // Check if any users have confirmed emails
      const confirmedUsers = data.users.filter(user => user.email_confirmed_at)
      console.log(`✅ Confirmed users: ${confirmedUsers.length}`)
      
      if (confirmedUsers.length === 0) {
        console.log('⚠️  No users have confirmed emails - check email provider settings')
      }
    }
  } catch (error) {
    console.log('❌ Email check failed:', error.message)
  }
}

// Run debug
async function main() {
  await checkEmailConfig()
  await debugProfileCreation()
  
  console.log('\n📋 SUMMARY:')
  console.log('1. Set up your .env.local with correct Supabase credentials')
  console.log('2. Configure email provider in Supabase dashboard')
  console.log('3. Run database migrations to ensure triggers exist')
  console.log('4. Check that RLS policies allow profile creation')
}

main()
