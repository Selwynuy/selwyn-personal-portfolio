import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/settings-form'
import { createProfile } from '@/lib/actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  // Fetch or create profile data
  let profile = null
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    profile = profileData
  } catch (profileError) {
    // Profile doesn't exist, create one
    try {
      profile = await createProfile(user.id, user.email || '')
    } catch (createError) {
      console.error('Failed to create profile:', createError)
      // Continue with null profile - the form will handle it
    }
  }

  // Check admin and fetch site settings (singleton)
  const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id })
  let siteSettings: any = null
  if (isAdmin) {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .single()
    siteSettings = data
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-300">Manage your portfolio settings and preferences</p>
      </div>

      <SettingsForm user={user} profile={profile} siteSettings={siteSettings} isAdmin={!!isAdmin} />
    </div>
  )
}