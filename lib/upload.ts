'use server'

import { createClient } from '@/lib/server'
import { v4 as uuidv4 } from 'uuid'

export async function uploadImage(file: File, bucket: 'avatars' | 'projects' = 'projects') {
  try {
    const supabase = await createClient()
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) throw error

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}
