'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Database } from '@/lib/database.types'
import { updateMessageStatus, deleteMessage } from '@/lib/actions'

type Message = Database['public']['Tables']['messages']['Row']

interface MessagesTableProps {
  initialMessages: Message[]
  onMessagesChange?: (messages: Message[]) => void
}

export function MessagesTable({ initialMessages, onMessagesChange }: MessagesTableProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [loading, setLoading] = useState(false)

  // Update parent component when messages change
  const updateMessages = (newMessages: Message[]) => {
    setMessages(newMessages)
    onMessagesChange?.(newMessages)
  }

  const handleMarkAsRead = async (id: string) => {
    setLoading(true)
    try {
      await updateMessageStatus(id, 'read')
      const updatedMessages = messages.map(m => 
        m.id === id ? { ...m, status: 'read' } : m
      )
      updateMessages(updatedMessages)
    } catch (error) {
      console.error('Error marking message as read:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    setLoading(true)
    try {
      await deleteMessage(id)
      const updatedMessages = messages.filter(m => m.id !== id)
      updateMessages(updatedMessages)
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Message Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-slate-600">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.filter(m => m.status === 'unread').length}
            </div>
            <p className="text-xs text-slate-600">Messages to review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {messages.length === 0 
                ? '0%' 
                : `${Math.round((messages.filter(m => m.status === 'read').length / messages.length) * 100)}%`
              }
            </div>
            <p className="text-xs text-slate-600">Messages reviewed</p>
          </CardContent>
        </Card>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>View and manage your contact form submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-sm text-slate-500">{message.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{message.subject}</div>
                    <div className="text-sm text-slate-500 truncate max-w-[300px]">
                      {message.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={message.status === 'unread' ? 'default' : 'outline'}
                      className={message.status === 'unread' ? 'bg-blue-100 text-blue-800' : ''}
                    >
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(message.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const subject = `Re: ${message.subject || 'Your message'}`
                          const body = `\n\n--- Original Message ---\nFrom: ${message.name}\nEmail: ${message.email}\nDate: ${new Date(message.created_at).toLocaleDateString()}\n\n${message.message}`
                          const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                          window.location.href = mailtoLink
                        }}
                      >
                        Reply
                      </Button>
                      {message.status === 'unread' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkAsRead(message.id)}
                          disabled={loading}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(message.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}