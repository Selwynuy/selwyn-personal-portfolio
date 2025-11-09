'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/image-upload'
import { Database } from '@/lib/database.types'
import { createGalleryItem, updateGalleryItem } from '@/lib/actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']

interface GalleryFormProps {
  userId: string
  item?: GalleryItem
  onSuccess?: () => void
}

export function GalleryForm({ userId, item, onSuccess }: GalleryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    thumbnail_url: item?.thumbnail_url || '',
    category: item?.category || '',
    tags: item?.tags?.join(', ') || '',
    position: item?.position || 0,
    featured: item?.featured || false,
    status: item?.status || 'draft' as 'draft' | 'published'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const itemData = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url,
        thumbnail_url: formData.thumbnail_url || null,
        category: formData.category || null,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        position: formData.position,
        featured: formData.featured,
        status: formData.status,
        user_id: userId
      }

      if (item) {
        await updateGalleryItem(item.id, itemData)
      } else {
        await createGalleryItem(itemData)
      }

      onSuccess?.()
      router.push('/dashboard/gallery')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{item ? 'Edit Gallery Item' : 'Create New Gallery Item'}</CardTitle>
          <CardDescription>
            {item ? 'Update your gallery item details' : 'Add a new image to your gallery'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Main Image */}
          <div className="space-y-4">
            <Label>Main Image *</Label>
            <div className="flex items-center gap-4">
              {formData.image_url ? (
                <div className="relative w-40 h-40 rounded-md overflow-hidden">
                  <Image
                    src={formData.image_url}
                    alt="Main image preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image_url: '' })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="w-40 h-40 border-2 border-dashed rounded-md flex items-center justify-center text-slate-500">
                  No image
                </div>
              )}
              <ImageUpload
                bucket="gallery"
                onUpload={url => setFormData({ ...formData, image_url: url })}
              />
            </div>
            <p className="text-sm text-slate-500">
              Main gallery image. Recommended size: 1200x800px. Max size: 5MB
            </p>
          </div>

          {/* Thumbnail Image */}
          <div className="space-y-4">
            <Label>Thumbnail (Optional)</Label>
            <div className="flex items-center gap-4">
              {formData.thumbnail_url ? (
                <div className="relative w-32 h-32 rounded-md overflow-hidden">
                  <Image
                    src={formData.thumbnail_url}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center text-slate-500">
                  No thumbnail
                </div>
              )}
              <ImageUpload
                bucket="gallery-thumbnails"
                onUpload={url => setFormData({ ...formData, thumbnail_url: url })}
              />
            </div>
            <p className="text-sm text-slate-500">
              Optional thumbnail for grid view. Recommended size: 400x400px
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Beautiful Sunset"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="A brief description of this image"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ''}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              placeholder="Nature, Architecture, Portrait, etc."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              placeholder="sunset, beach, photography (comma separated)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              type="number"
              value={formData.position}
              onChange={e => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
            <p className="text-sm text-slate-500">
              Controls the display order (lower numbers appear first)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Featured Item</Label>
              <p className="text-sm text-slate-500">Highlight this item in the gallery</p>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={featured => setFormData({ ...formData, featured })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'draft' | 'published') =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-slate-500">
              Published items are visible in your public gallery
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  )
}
