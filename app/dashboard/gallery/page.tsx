import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { getGalleryItems } from '@/lib/actions'
import { GalleryPageClient } from '@/components/gallery-page-client'

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  const items = await getGalleryItems(user.id, true)

  return <GalleryPageClient initialItems={items} userId={user.id} />
}
