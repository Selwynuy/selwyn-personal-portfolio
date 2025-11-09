'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Database } from '@/lib/database.types'
import { deleteGalleryItem } from '@/lib/actions'
import { GalleryForm } from '@/components/gallery-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Edit, Trash2, Star, Grid3x3, List } from 'lucide-react'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']

interface GalleryTableProps {
  initialItems: GalleryItem[]
  userId: string
}

export function GalleryTable({ initialItems, userId }: GalleryTableProps) {
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return

    setLoading(true)
    try {
      await deleteGalleryItem(id)
      setItems(items.filter(i => i.id !== id))
    } catch (error) {
      console.error('Error deleting gallery item:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
  }

  const handleFormSuccess = () => {
    setEditingItem(null)
    window.location.reload() // Refresh to show changes
  }

  const publishedCount = items.filter(i => i.status === 'published').length
  const featuredCount = items.filter(i => i.featured).length

  return (
    <div className="space-y-8">
      {/* Gallery Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-slate-600">
              {publishedCount} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredCount}</div>
            <p className="text-xs text-slate-600">Highlighted items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-slate-600">
              {items.filter(i => i.status === 'draft').length} drafts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gallery Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Gallery Items</CardTitle>
              <CardDescription>A list of all your gallery images.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                      No gallery items yet. Create your first item to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={item.thumbnail_url || item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-sm text-slate-500 line-clamp-1">{item.description}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.category ? (
                          <Badge variant="outline">{item.category}</Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.status === 'published' ? 'default' : 'outline'}
                          className={item.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.featured ? (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{item.position}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                            disabled={loading}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-8">
                  No gallery items yet. Create your first item to get started!
                </div>
              ) : (
                items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={item.thumbnail_url || item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      {item.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-100 text-yellow-800">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge
                        variant={item.status === 'published' ? 'default' : 'outline'}
                        className={`absolute top-2 right-2 ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-white'}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.title}</h3>
                      {item.category && (
                        <Badge variant="outline" className="text-xs mb-2">
                          {item.category}
                        </Badge>
                      )}
                      {item.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                          disabled={loading}
                          className="flex-1"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Gallery Item Modal */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
            <DialogDescription>
              Update your gallery item details
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <GalleryForm
              userId={userId}
              item={editingItem}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
