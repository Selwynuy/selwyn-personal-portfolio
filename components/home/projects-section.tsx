import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectCard } from '@/components/project-card'
import { ProjectCardSkeleton } from '@/components/project-card-skeleton'

type Project = {
  id: string
}

interface ProjectsSectionProps {
  projects: Project[] | null
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense
            fallback={
              <>
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </>
            }
          >
            {projects?.map((project: any) => (
              <ProjectCard key={project.id} project={project} showStats={false} />
            ))}
            {(!projects || projects.length === 0) && (
              <div className="col-span-3 text-center py-12">
                <p className="text-slate-600 dark:text-slate-300">
                  No projects to display yet.
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </section>
  )
}


