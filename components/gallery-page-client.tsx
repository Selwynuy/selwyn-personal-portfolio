'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GalleryTable } from '@/components/gallery-table'
import { GalleryForm } from '@/components/gallery-form'
import { Database } from '@/lib/database.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']

interface GalleryPageClientProps {
  initialItems: GalleryItem[]
  userId: string
}

export function GalleryPageClient({ initialItems, userId }: GalleryPageClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gallery</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your gallery images</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Gallery Item
        </Button>
      </div>

      {/* Add Gallery Item Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Gallery Item</DialogTitle>
            <DialogDescription>
              Add a new image to your gallery
            </DialogDescription>
          </DialogHeader>
          <GalleryForm
            userId={userId}
            onSuccess={() => {
              setShowAddForm(false)
              window.location.reload()
            }}
          />
        </DialogContent>
      </Dialog>

      <GalleryTable initialItems={initialItems} userId={userId} />
    </div>
  )
}
