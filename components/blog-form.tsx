'use client'

import { useEffect, useState } from 'react'
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
import { createBlogPost, updateBlogPost } from '@/lib/actions'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

interface BlogFormProps {
  userId: string
  post?: BlogPost
  onSuccess?: () => void
}

export function BlogForm({ userId, post, onSuccess }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    cover_image_url: post?.cover_image_url || '',
    status: post?.status || 'draft',
    featured: post?.featured || false,
    tags: post?.tags?.join(', ') || ''
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.title, post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        cover_image_url: formData.cover_image_url || null,
        status: formData.status,
        featured: formData.featured,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        user_id: userId
      }

      if (post) {
        await updateBlogPost(post.id, postData)
      } else {
        await createBlogPost(postData)
      }

      onSuccess?.()
      router.push('/dashboard/blog')
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
          <CardTitle>{post ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
          <CardDescription>
            {post ? 'Update your blog post details' : 'Add a new blog post to your portfolio'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Cover Image */}
          <div className="space-y-4">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              {formData.cover_image_url ? (
                <div className="relative w-40 h-24 rounded-md overflow-hidden">
                  <Image
                    src={formData.cover_image_url}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="w-40 h-24 border-2 border-dashed rounded-md flex items-center justify-center text-slate-500">
                  No image
                </div>
              )}
              <ImageUpload
                bucket="blog"
                onUpload={url => setFormData({ ...formData, cover_image_url: url })}
              />
            </div>
            <p className="text-sm text-slate-500">
              Recommended size: 1200x630px. Max size: 5MB
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Blog Post"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              placeholder="my-awesome-blog-post"
              required
            />
            <p className="text-sm text-slate-500">
              URL-friendly version of the title. Auto-generated from title.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt || ''}
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary of your blog post"
              className="min-h-[80px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your blog post content here..."
              className="min-h-[300px]"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              placeholder="React, TypeScript, Web Development (comma separated)"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Featured Post</Label>
              <p className="text-sm text-slate-500">Show this post at the top of your blog</p>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={featured => setFormData({ ...formData, featured })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Post Status</Label>
              <p className="text-sm text-slate-500">Published posts are visible on your blog</p>
            </div>
            <Switch
              checked={formData.status === 'published'}
              onCheckedChange={checked =>
                setFormData({ ...formData, status: checked ? 'published' : 'draft' })
              }
            />
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
          {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  )
}
