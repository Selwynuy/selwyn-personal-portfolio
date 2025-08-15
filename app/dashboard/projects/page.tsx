import { createClient } from '@/lib/server'
import { getProjects } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { ProjectsTable } from '@/components/projects-table'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const projects = await getProjects(user.id, true)

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your portfolio projects</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          + Add New Project
        </Button>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  )
}