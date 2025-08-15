'use client'

import { useState } from 'react'
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
import { deleteProject } from '@/lib/actions'
import { ProjectForm } from '@/components/project-form'
import { ProjectPreviewModal } from '@/components/project-preview-modal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Edit, Eye, Trash2 } from 'lucide-react'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectsTableProps {
  initialProjects: Project[]
  userId: string
}

export function ProjectsTable({ initialProjects, userId }: ProjectsTableProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [loading, setLoading] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    setLoading(true)
    try {
      await deleteProject(id)
      setProjects(projects.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
  }

  const handleView = (project: Project) => {
    setViewingProject(project)
  }

  const handleFormSuccess = () => {
    setEditingProject(null)
    window.location.reload() // Refresh to show changes
  }

  return (
    <div className="space-y-8">
      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-slate-600">
              {projects.filter(p => p.featured).length} featured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((sum, p) => sum + p.view_count, 0)}
            </div>
            <p className="text-xs text-slate-600">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === 'published').length}
            </div>
            <p className="text-xs text-slate-600">
              {projects.filter(p => p.status === 'draft').length} drafts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>A list of all your portfolio projects.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div>
                      {project.title}
                      {project.featured && (
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-500">{project.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={project.status === 'published' ? 'default' : 'outline'}
                      className={project.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.view_count}</TableCell>
                  <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(project)}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleView(project)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(project.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
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

      {/* Edit Project Modal */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <ProjectForm 
              userId={userId}
              project={editingProject}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Project Preview Modal */}
      <ProjectPreviewModal
        project={viewingProject}
        isOpen={!!viewingProject}
        onClose={() => setViewingProject(null)}
      />
    </div>
  )
}