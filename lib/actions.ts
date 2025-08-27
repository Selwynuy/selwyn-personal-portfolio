'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Message = Database['public']['Tables']['messages']['Row']
type SiteSettings = {
  id: boolean
  show_view_counts: boolean
  show_featured_first: boolean
  enable_blog: boolean
  meta_title: string | null
  meta_description: string | null
  updated_at?: string
  created_at?: string
}

// Auth Actions
export async function signUp(email: string, password: string) {
  const supabase = await createClient()
  
  // Get the site URL with fallback
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                 (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  })

  if (error) throw error

  // Profile creation is now handled automatically by database triggers
  // No need to manually create profile here
  console.log('User signed up successfully:', data.user?.id, 'email:', email)

  return data
}

// Admin Actions
export async function checkIsAdmin(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('is_admin', { user_id: userId })
  
  if (error) throw error
  return data
}

export async function makeUserAdmin(targetUserId: string) {
  const supabase = await createClient()
  const { error } = await supabase.rpc('make_admin', { target_user_id: targetUserId })
  
  if (error) throw error
  revalidatePath('/dashboard/settings')
}

// Site Settings Actions (singleton)
export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  if (error) throw error
  return data as SiteSettings
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
  const supabase = await createClient()

  // Prefer RPC if available; fallback to direct update
  let rpcError: unknown = null
  try {
    const { data, error } = await supabase.rpc('update_site_settings', { p: settings as unknown as Record<string, unknown> })
    if (error) rpcError = error
    if (!rpcError) {
      revalidatePath('/dashboard/settings')
      return data as SiteSettings
    }
  } catch (e) {
    rpcError = e
  }

  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', true)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/settings')
  return data as SiteSettings
}

// Profile Actions
export async function getProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as Profile
}

export async function createProfile(userId: string, email: string) {
  const supabase = await createClient()
  
  // First check if profile already exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (existingProfile) {
    console.log('Profile already exists for user:', userId)
    return existingProfile as Profile
  }
  
  // Create new profile (this should work now with proper RLS policies)
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      full_name: email.split('@')[0], // Use email prefix as default name
      title: 'Full Stack Developer',
      bio: 'Passionate developer building modern web applications.',
      show_view_counts: true,
      show_featured_first: true,
      enable_blog: false,
      is_admin: false // New users are not admin by default
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw error
  }
  
  console.log('Profile created successfully for user:', userId)
  return data as Profile
}

export async function updateProfile(userId: string, profile: Partial<Profile>) {
  const supabase = await createClient()
  
  // First, try to get the existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (fetchError && fetchError.code === 'PGRST116') {
    // Profile doesn't exist, create it first
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: profile.full_name || userId.split('@')[0],
        title: profile.title || 'Full Stack Developer',
        bio: profile.bio || 'Passionate developer building modern web applications.',
        show_view_counts: profile.show_view_counts ?? true,
        show_featured_first: profile.show_featured_first ?? true,
        enable_blog: profile.enable_blog ?? false,
        ...profile
      })
      .select()
      .single()

    if (createError) throw createError
    revalidatePath('/dashboard/settings')
    return newProfile as Profile
  }

  if (fetchError) throw fetchError

  // Profile exists, update it
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/settings')
  return data as Profile
}

// Project Actions
export async function getProjects(userId: string, includeUnpublished = false) {
  const supabase = await createClient()
  let query = supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    
  if (!includeUnpublished) {
    query = query.eq('status', 'published')
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as Project[]
}

// Social Links Actions
type SocialLink = {
  id: string
  user_id: string
  platform: string
  label: string | null
  url: string
  position: number
  created_at?: string
  updated_at?: string
}

export async function getSocialLinks(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })

  if (error) throw error
  return (data || []) as SocialLink[]
}

export async function createSocialLink(link: Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .insert(link)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/settings')
  return data as SocialLink
}

export async function updateSocialLink(id: string, patch: Partial<SocialLink>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('social_links')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/settings')
  return data as SocialLink
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/dashboard/settings')
}

export async function getProject(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) throw error
  return data as Project
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/projects')
  return data as Project
}

export async function updateProject(projectId: string, project: Partial<Project>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/projects')
  return data as Project
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) throw error
  revalidatePath('/dashboard/projects')
}

// Message Actions
export async function getMessages(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Message[]
}

export async function createMessage(message: Omit<Message, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/messages')
  return data as Message
}

export async function updateMessageStatus(messageId: string, status: Message['status']) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .update({ status })
    .eq('id', messageId)
    .select()
    .single()

  if (error) throw error
  revalidatePath('/dashboard/messages')
  return data as Message
}

export async function deleteMessage(messageId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)

  if (error) throw error
  revalidatePath('/dashboard/messages')
}

// Analytics Action
export async function incrementProjectViews(projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .rpc('increment_view_count', { project_id: projectId })

  if (error) throw error
}
