'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BlogTable } from '@/components/blog-table'
import { BlogForm } from '@/components/blog-form'
import { Database } from '@/lib/database.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

interface BlogPageClientProps {
  initialPosts: BlogPost[]
  userId: string
}

export function BlogPageClient({ initialPosts, userId }: BlogPageClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Blog Posts</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your blog content</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Post
        </Button>
      </div>

      {/* Add Post Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Write and publish a new blog post
            </DialogDescription>
          </DialogHeader>
          <BlogForm
            userId={userId}
            onSuccess={() => {
              setShowAddForm(false)
              window.location.reload()
            }}
          />
        </DialogContent>
      </Dialog>

      <BlogTable initialPosts={initialPosts} userId={userId} />
    </div>
  )
}
