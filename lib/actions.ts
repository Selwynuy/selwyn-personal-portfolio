'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'
import { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Message = Database['public']['Tables']['messages']['Row']

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

export async function updateProfile(userId: string, profile: Partial<Profile>) {
  const supabase = await createClient()
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
