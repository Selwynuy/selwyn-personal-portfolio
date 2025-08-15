// Utility script to set up the first admin user
// Run this with: node scripts/setup-admin.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAdmin(email) {
  try {
    console.log(`Setting up admin for email: ${email}`)
    
    // First, find the user by email
    const { data: users, error: userError } = await supabase.auth.admin.listUsers()
    
    if (userError) {
      console.error('Error fetching users:', userError)
      return
    }
    
    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      console.error(`User with email ${email} not found`)
      console.log('Available users:')
      users.users.forEach(u => console.log(`- ${u.email} (${u.id})`))
      return
    }
    
    console.log(`Found user: ${user.email} (${user.id})`)
    
    // Check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError)
      return
    }
    
    if (existingProfile) {
      console.log('Profile already exists, updating to admin...')
      
      // Update existing profile to be admin
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', user.id)
        .select()
        .single()
      
      if (updateError) {
        console.error('Error updating profile:', updateError)
        return
      }
      
      console.log('✅ Profile updated to admin successfully!')
      console.log('Profile data:', updatedProfile)
    } else {
      console.log('Creating new admin profile...')
      
      // Create new admin profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.email.split('@')[0],
          title: 'Full Stack Developer',
          bio: 'Passionate developer building modern web applications.',
          show_view_counts: true,
          show_featured_first: true,
          enable_blog: false,
          is_admin: true
        })
        .select()
        .single()
      
      if (createError) {
        console.error('Error creating profile:', createError)
        return
      }
      
      console.log('✅ Admin profile created successfully!')
      console.log('Profile data:', newProfile)
    }
    
  } catch (error) {
    console.error('Failed to setup admin:', error)
  }
}

// Get email from command line argument
const email = process.argv[2]

if (!email) {
  console.log('Usage: node scripts/setup-admin.js <email>')
  console.log('Example: node scripts/setup-admin.js your-email@example.com')
  process.exit(1)
}

setupAdmin(email)
