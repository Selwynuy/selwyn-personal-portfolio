'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProjectsTable } from '@/components/projects-table'
import { ProjectForm } from '@/components/project-form'
import { Database } from '@/lib/database.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectsPageClientProps {
  initialProjects: Project[]
  userId: string
}

export function ProjectsPageClient({ initialProjects, userId }: ProjectsPageClientProps) {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your portfolio projects</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {/* Add Project Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Create a new project for your portfolio
            </DialogDescription>
          </DialogHeader>
          <ProjectForm 
            userId={userId}
            onSuccess={() => {
              setShowAddForm(false)
              window.location.reload() // Refresh to show new project
            }}
          />
        </DialogContent>
      </Dialog>

      <ProjectsTable initialProjects={initialProjects} userId={userId} />
    </div>
  )
}
