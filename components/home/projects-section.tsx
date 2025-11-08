import { Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectCardSkeleton } from '@/components/project-card-skeleton'
import { ProjectCarousel } from '@/components/home/project-carousel'

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
        <div className="flex flex-col gap-16">
          <Suspense
            fallback={
              <>
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </>
            }
          >
            {projects?.map((project: any, idx: number) => {
              const gallery = Array.isArray(project._media)
                ? project._media.map((m: any) => (m.type === 'image' ? { image: m.url } : { video: m.url }))
                : []
              const fallback = (project.image_url
                ? [{ image: project.image_url }]
                : []) as Array<{ image?: string; video?: string }>
              const media = gallery.length > 0 ? gallery : fallback
              const href = project.url || project.live_url || project.repo_url || '#'
              const title = project.title || project.name || 'Untitled'
              return (
                <div key={project.id ?? idx} className="grid md:grid-cols-2 items-center gap-10">
                  <div className="space-y-3 md:pr-8">
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                    {project.short_description && (
                      <p className="text-slate-600 dark:text-slate-300 max-w-prose">{project.short_description}</p>
                    )}
                    {href && href !== '#' && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Visit project →
                      </a>
                    )}
                  </div>
                  <ProjectCarousel title={title} media={media} />
                </div>
              )
            })}
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


