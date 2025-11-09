'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database } from '@/lib/database.types'
import { incrementProjectViews } from '@/lib/actions'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
  showStats?: boolean
}

export function ProjectCard({ project, showStats = false }: ProjectCardProps) {
  const handleView = async () => {
    if (project.live_url) {
      // Increment view count
      try {
        await incrementProjectViews(project.id)
      } catch (error) {
        console.error('Failed to increment view count:', error)
      }
      // Open project
      window.open(project.live_url, '_blank')
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {project.image_url ? (
        <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover"
          />
          {project.featured && (
            <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
              Featured
            </Badge>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
          {project.featured && (
            <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
              Featured
            </Badge>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        {showStats && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            👁️ {project.view_count} views
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {project.live_url && (
            <Button size="sm" variant="outline" onClick={handleView}>
              View Live
            </Button>
          )}
          {project.github_url && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => project.github_url && window.open(project.github_url, '_blank')}
            >
              Source Code
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
