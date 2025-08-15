// Script to check what users exist in your Supabase project
// Run with: node scripts/check-users.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkUsers() {
  console.log('🔍 Checking users in Supabase...\n')
  
  try {
    // List all users
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Error fetching users:', error.message)
      return
    }
    
    console.log(`📊 Total users found: ${users.users.length}\n`)
    
    if (users.users.length === 0) {
      console.log('👻 No users found in this Supabase project')
      console.log('This means either:')
      console.log('1. You\'re connected to the wrong Supabase project')
      console.log('2. The user signup didn\'t actually work')
      console.log('3. Users were deleted/cleaned up')
    } else {
      console.log('👥 Users found:')
      users.users.forEach((user, index) => {
        console.log(`${index + 1}. User ID: ${user.id}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Created: ${user.created_at}`)
        console.log(`   Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
        console.log(`   Last sign in: ${user.last_sign_in_at || 'Never'}`)
        console.log('')
      })
    }
    
    // Check profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, is_admin')
    
    if (profileError) {
      console.log('⚠️  Could not fetch profiles:', profileError.message)
    } else {
      console.log(`👤 Profiles found: ${profiles.length}`)
      profiles.forEach((profile, index) => {
        console.log(`${index + 1}. ${profile.full_name} (${profile.id}) - Admin: ${profile.is_admin}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Failed to check users:', error.message)
  }
}

async function createTestUser() {
  console.log('\n🧪 Want to create a test user? (y/n)')
  
  // For now, just show the manual signup option
  console.log('\n📝 To create a new user:')
  console.log('1. Go to http://localhost:3000/auth/sign-up')
  console.log('2. Sign up with a new email')
  console.log('3. Check your Supabase Auth dashboard to confirm the email')
  console.log('4. Profile should be created automatically via triggers')
}

async function main() {
  await checkUsers()
  await createTestUser()
  
  console.log('\n🔧 Supabase Project Info:')
  console.log(`URL: ${supabaseUrl}`)
  console.log(`Using service role key: ${supabaseServiceKey ? '✅ Yes' : '❌ No'}`)
}

main()
