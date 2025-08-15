import { createClient } from '@/lib/server'
import { getMessages } from '@/lib/actions'
import { MessagesPageClient } from '@/components/messages-page-client'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const messages = await getMessages(user.id)

  return <MessagesPageClient initialMessages={messages} userId={user.id} />
}