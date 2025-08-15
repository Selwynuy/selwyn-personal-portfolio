// Utility script to create a profile for an existing user
// Run this with: node scripts/create-profile.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createProfileForUser(userId, email) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: email.split('@')[0],
        title: 'Full Stack Developer',
        bio: 'Passionate developer building modern web applications.',
        show_view_counts: true,
        show_featured_first: true,
        enable_blog: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      return null
    }

    console.log('Profile created successfully:', data)
    return data
  } catch (error) {
    console.error('Failed to create profile:', error)
    return null
  }
}

// Example usage - replace with your actual user ID and email
// createProfileForUser('your-user-id-here', 'your-email@example.com')

console.log('Profile creation utility script')
console.log('To use this script:')
console.log('1. Set your environment variables')
console.log('2. Uncomment the createProfileForUser call at the bottom')
console.log('3. Replace with your actual user ID and email')
console.log('4. Run: node scripts/create-profile.js')
