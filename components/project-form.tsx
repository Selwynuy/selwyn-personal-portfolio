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
import { MediaUploader } from '@/components/media-uploader'
import { getProjectMedia, upsertProjectMedia } from '@/lib/actions'
import { Database } from '@/lib/database.types'
import { createProject, updateProject } from '@/lib/actions'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectFormProps {
  userId: string
  project?: Project
  onSuccess?: () => void
}

export function ProjectForm({ userId, project, onSuccess }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    content: project?.content || '',
    technologies: project?.technologies?.join(', ') || '',
    github_url: project?.github_url || '',
    live_url: project?.live_url || '',
    image_url: project?.image_url || '',
    status: project?.status || 'draft',
    featured: project?.featured || false
  })

  const [mediaItems, setMediaItems] = useState<Array<{ id?: string; type: 'image' | 'video'; url: string }>>([])

  // Load existing media when editing
  useEffect(() => {
    let isMounted = true
    if (project) {
      getProjectMedia(project.id)
        .then((data) => {
          if (!isMounted) return
          setMediaItems(data.map((m) => ({ id: m.id, type: m.type, url: m.url })))
        })
        .catch(() => {})
    } else {
      setMediaItems([])
    }
    return () => { isMounted = false }
  }, [project?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
        user_id: userId,
        view_count: 0
      }

      let saved = project
      if (project) {
        saved = await updateProject(project.id, projectData)
      } else {
        saved = await createProject(projectData)
      }

      // Persist media list/order
      if (saved) {
        await upsertProjectMedia(saved.id, mediaItems)
      }

      onSuccess?.()
      router.push('/dashboard/projects')
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
          <CardTitle>{project ? 'Edit Project' : 'Create New Project'}</CardTitle>
          <CardDescription>
            {project ? 'Update your project details' : 'Add a new project to your portfolio'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Primary Project Image (thumbnail) */}
          <div className="space-y-4">
            <Label>Project Image</Label>
            <div className="flex items-center gap-4">
              {formData.image_url ? (
                <div className="relative w-40 h-24 rounded-md overflow-hidden">
                  <Image
                    src={formData.image_url}
                    alt="Project preview"
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
                <div className="w-40 h-24 border-2 border-dashed rounded-md flex items-center justify-center text-slate-500">
                  No image
                </div>
              )}
              <ImageUpload
                bucket="projects"
                onUpload={url => setFormData({ ...formData, image_url: url })}
              />
            </div>
            <p className="text-sm text-slate-500">
              Recommended size: 1200x630px. Max size: 5MB
            </p>
          </div>

          {/* Gallery Media */}
          <div className="space-y-2">
            <Label>Gallery</Label>
            <p className="text-sm text-slate-500">Add multiple images. Use arrows to reorder. Click “Set cover” on an image to use it as the thumbnail.</p>
            <MediaUploader 
              items={mediaItems} 
              onChange={setMediaItems}
              onSetCover={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="A brief description of your project"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Detailed Content</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Detailed information about your project"
              className="min-h-[200px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="technologies">Technologies Used</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={e => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, TypeScript, Node.js (comma separated)"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                type="url"
                value={formData.github_url || ''}
                onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/username/project"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="live_url">Live URL</Label>
              <Input
                id="live_url"
                type="url"
                value={formData.live_url || ''}
                onChange={e => setFormData({ ...formData, live_url: e.target.value })}
                placeholder="https://my-project.com"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Featured Project</Label>
              <p className="text-sm text-slate-500">Show this project at the top of your portfolio</p>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={featured => setFormData({ ...formData, featured })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Project Status</Label>
              <p className="text-sm text-slate-500">Published projects are visible on your portfolio</p>
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
          {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}