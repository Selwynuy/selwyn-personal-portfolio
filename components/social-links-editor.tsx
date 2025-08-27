'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { createSocialLink, deleteSocialLink, updateSocialLink } from '@/lib/actions'
import { Database } from '@/lib/database.types'
import { Trash2, Save, Plus } from 'lucide-react'

type SocialLink = {
  id: string
  user_id: string
  platform: string
  label: string | null
  url: string
  position: number
}

interface SocialLinksEditorProps {
  userId: string
  initialLinks: SocialLink[]
}

export function SocialLinksEditor({ userId, initialLinks }: SocialLinksEditorProps) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [adding, setAdding] = useState(false)
  const [newLink, setNewLink] = useState<{ platform: string; label: string; url: string }>({
    platform: '',
    label: '',
    url: '',
  })
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!newLink.platform || !newLink.url) return
    setAdding(true)
    try {
      const created = await createSocialLink({
        user_id: userId,
        platform: newLink.platform,
        label: newLink.label || null,
        url: newLink.url,
        position: links.length,
      })
      setLinks(prev => [...prev, created])
      setNewLink({ platform: '', label: '', url: '' })
    } finally {
      setAdding(false)
    }
  }

  const handleSave = async (link: SocialLink) => {
    setSavingId(link.id)
    try {
      const updated = await updateSocialLink(link.id, {
        platform: link.platform,
        label: link.label,
        url: link.url,
        position: link.position,
      })
      setLinks(prev => prev.map(l => (l.id === link.id ? updated : l)))
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteSocialLink(id)
      setLinks(prev => prev.filter(l => l.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          {links.length === 0 && (
            <p className="text-sm text-slate-500">No social links yet.</p>
          )}

          {links.map((link, idx) => (
            <div key={link.id} className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-3">
                <Label>Platform</Label>
                <Input
                  value={link.platform}
                  onChange={e => setLinks(prev => prev.map(l => (l.id === link.id ? { ...l, platform: e.target.value } : l)))}
                  placeholder="github | linkedin | twitter | website"
                />
              </div>
              <div className="col-span-3">
                <Label>Label</Label>
                <Input
                  value={link.label ?? ''}
                  onChange={e => setLinks(prev => prev.map(l => (l.id === link.id ? { ...l, label: e.target.value } : l)))}
                  placeholder="Optional label (e.g., GitHub)"
                />
              </div>
              <div className="col-span-5">
                <Label>URL</Label>
                <Input
                  value={link.url}
                  onChange={e => setLinks(prev => prev.map(l => (l.id === link.id ? { ...l, url: e.target.value } : l)))}
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-1 flex gap-2">
                <Button type="button" size="icon" variant="outline" onClick={() => handleSave(link)} disabled={savingId === link.id}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="destructive" onClick={() => handleDelete(link.id)} disabled={deletingId === link.id}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 grid grid-cols-12 gap-3 items-end">
            <div className="col-span-3">
              <Label>Platform</Label>
              <Input
                value={newLink.platform}
                onChange={e => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                placeholder="github | linkedin | twitter | website"
              />
            </div>
            <div className="col-span-3">
              <Label>Label</Label>
              <Input
                value={newLink.label}
                onChange={e => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div className="col-span-5">
              <Label>URL</Label>
              <Input
                value={newLink.url}
                onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-1">
              <Button type="button" onClick={handleAdd} disabled={adding}>
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


