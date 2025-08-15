// Script to create profiles for all existing users
// Run with: node scripts/create-all-missing-profiles.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createProfilesForAllUsers() {
  console.log('🔧 Creating profiles for all existing users...\n')
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message)
      return
    }
    
    if (users.users.length === 0) {
      console.log('👻 No users found')
      return
    }
    
    console.log(`👥 Found ${users.users.length} users`)
    
    // Get existing profiles
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
    
    const existingProfileIds = new Set(existingProfiles?.map(p => p.id) || [])
    
    // Create profiles for users who don't have them
    for (const user of users.users) {
      if (existingProfileIds.has(user.id)) {
        console.log(`✅ Profile already exists for ${user.email || user.id}`)
        continue
      }
      
      console.log(`🔧 Creating profile for ${user.email || user.id}...`)
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.email ? user.email.split('@')[0] : `User-${user.id.slice(0, 8)}`,
          title: 'Full Stack Developer',
          bio: 'Passionate developer building modern web applications.',
          show_view_counts: true,
          show_featured_first: true,
          enable_blog: false,
          is_admin: user.email === 'selwyn.uy@msugensan.edu.ph' // Make yourself admin
        })
        .select()
        .single()
      
      if (createError) {
        console.error(`❌ Error creating profile for ${user.email}:`, createError.message)
      } else {
        console.log(`✅ Profile created for ${user.email}`)
      }
    }
    
    // Show final status
    const { data: finalProfiles } = await supabase
      .from('profiles')
      .select('id, full_name, is_admin')
    
    console.log(`\n📊 Final status: ${finalProfiles?.length || 0} profiles exist`)
    finalProfiles?.forEach(profile => {
      console.log(`   - ${profile.full_name}${profile.is_admin ? ' (Admin)' : ''}`)
    })
    
  } catch (error) {
    console.error('❌ Failed to create profiles:', error.message)
  }
}

async function main() {
  await createProfilesForAllUsers()
  
  console.log('\n📋 Next steps:')
  console.log('1. Test login with your email: selwyn.uy@msugensan.edu.ph')
  console.log('2. You should now have admin access to /dashboard')
  console.log('3. Check that email confirmation is working for new signups')
}

main()
