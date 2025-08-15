import { createClient } from '@/lib/server'
import { getMessages } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { MessagesTable } from '@/components/messages-table'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const messages = await getMessages(user.id)

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage contact form submissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            📥 Export All
          </Button>
          <Button variant="outline">
            🗑️ Clear Read
          </Button>
        </div>
      </div>

      <MessagesTable initialMessages={messages} />
    </div>
  )
}