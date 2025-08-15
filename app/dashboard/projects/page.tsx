import { createClient } from '@/lib/server'
import { getProjects } from '@/lib/actions'
import { ProjectsPageClient } from '@/components/projects-page-client'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const projects = await getProjects(user.id, true)

  return <ProjectsPageClient initialProjects={projects} userId={user.id} />
}