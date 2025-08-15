// Script to test the authentication flow
// Run with: node scripts/test-auth-flow.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAuthFlow() {
  console.log('🧪 Testing authentication flow...\n')
  
  try {
    // 1. Check all users and their admin status
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Error fetching users:', error.message)
      return
    }
    
    console.log(`👥 Found ${users.users.length} users:`)
    
    for (const user of users.users) {
      const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id })
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      
      console.log(`   📧 ${user.email || 'No email'}`)
      console.log(`      ID: ${user.id}`)
      console.log(`      Admin: ${isAdmin ? '✅ Yes' : '❌ No'}`)
      console.log(`      Profile: ${profile?.full_name || '❌ Missing'}`)
      console.log(`      Email confirmed: ${user.email_confirmed_at ? '✅ Yes' : '❌ No'}`)
      console.log('')
    }
    
    // 2. Test admin function
    console.log('🔧 Testing admin functions...')
    const adminUser = users.users.find(u => u.email === 'selwyn.uy@msugensan.edu.ph')
    if (adminUser) {
      const { data: isAdminResult } = await supabase.rpc('is_admin', { user_id: adminUser.id })
      console.log(`✅ Admin check for ${adminUser.email}: ${isAdminResult ? 'ADMIN' : 'REGULAR USER'}`)
    }
    
    // 3. Test regular user
    const regularUser = users.users.find(u => u.email !== 'selwyn.uy@msugensan.edu.ph')
    if (regularUser) {
      const { data: isAdminResult } = await supabase.rpc('is_admin', { user_id: regularUser.id })
      console.log(`✅ Admin check for ${regularUser.email || 'user'}: ${isAdminResult ? 'ADMIN' : 'REGULAR USER'}`)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

async function expectedBehavior() {
  console.log('\n📋 Expected behavior after fixes:')
  console.log('1. 🏠 Regular users login → redirected to homepage (/) ')
  console.log('2. 👑 Admin users login → redirected to dashboard (/dashboard)')
  console.log('3. 🚫 Regular users accessing /dashboard → silently redirected to homepage')
  console.log('4. ❌ No more "Access denied" error messages')
  console.log('5. 📧 Already logged in users accessing /auth → redirected appropriately')
  
  console.log('\n🧪 Test these scenarios:')
  console.log('• Login as regular user → should go to homepage')
  console.log('• Login as admin → should go to dashboard') 
  console.log('• Regular user tries /dashboard → redirected to homepage (no error)')
  console.log('• Logged in user goes to /auth/login → redirected based on admin status')
}

async function main() {
  await testAuthFlow()
  await expectedBehavior()
}

main()
