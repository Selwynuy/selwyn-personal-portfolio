'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessagesTable } from '@/components/messages-table'
import { Database } from '@/lib/database.types'
import { deleteMessage } from '@/lib/actions'
import { Download, Trash2 } from 'lucide-react'

type Message = Database['public']['Tables']['messages']['Row']

interface MessagesPageClientProps {
  initialMessages: Message[]
  userId: string
}

export function MessagesPageClient({ initialMessages, userId }: MessagesPageClientProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [loading, setLoading] = useState(false)

  const handleExportAll = () => {
    // Create CSV content
    const csvContent = [
      ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date'],
      ...messages.map(msg => [
        msg.name,
        msg.email,
        msg.subject || '',
        msg.message,
        msg.status,
        new Date(msg.created_at).toLocaleDateString()
      ])
    ]
    
    const csvString = csvContent
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    // Download CSV file
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `messages-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleClearRead = async () => {
    if (!confirm('Are you sure you want to delete all read messages? This cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const readMessages = messages.filter(msg => msg.status === 'read')
      
      // Delete all read messages
      await Promise.all(
        readMessages.map(msg => deleteMessage(msg.id))
      )
      
      // Update local state
      setMessages(messages.filter(msg => msg.status !== 'read'))
      
      console.log(`Deleted ${readMessages.length} read messages`)
    } catch (error) {
      console.error('Error clearing read messages:', error)
      alert('Failed to clear read messages. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const readMessagesCount = messages.filter(msg => msg.status === 'read').length

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage contact form submissions</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExportAll}
            disabled={messages.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export All ({messages.length})
          </Button>
          <Button 
            variant="outline"
            onClick={handleClearRead}
            disabled={loading || readMessagesCount === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {loading ? 'Clearing...' : `Clear Read (${readMessagesCount})`}
          </Button>
        </div>
      </div>

      <MessagesTable initialMessages={messages} onMessagesChange={setMessages} />
    </div>
  )
}
