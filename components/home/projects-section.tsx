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
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">Selected Work</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">A few things I’ve shipped recently.</p>
        </div>
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
            {projects?.map((project: any, idx: number) => (
              <div
                key={project.id}
                className="group animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-slate-200/60 bg-white/70 p-1 shadow-sm backdrop-blur transition-all hover:shadow-lg dark:border-white/10 dark:bg-white/5"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="rounded-xl bg-gradient-to-b from-transparent to-slate-950/[0.02] p-3 dark:to-white/5">
                  <ProjectCard project={project} showStats={false} />
                </div>
              </div>
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


