'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Database } from '@/lib/database.types'
import { ExternalLink, Github, X } from 'lucide-react'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectPreviewModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectPreviewModal({ project, isOpen, onClose }: ProjectPreviewModalProps) {
  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
          <DialogDescription>
            {project.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Image */}
          {project.image_url && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Project Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge 
                    variant={project.status === 'published' ? 'default' : 'outline'}
                    className="ml-2"
                  >
                    {project.status}
                  </Badge>
                </div>
                
                <div>
                  <span className="font-medium">Featured:</span>
                  <Badge 
                    variant={project.featured ? 'default' : 'outline'}
                    className="ml-2"
                  >
                    {project.featured ? 'Yes' : 'No'}
                  </Badge>
                </div>

                <div>
                  <span className="font-medium">Views:</span>
                  <span className="ml-2">{project.view_count || 0}</span>
                </div>

                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                {project.technologies && project.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No technologies listed</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Project Content */}
          {project.content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{project.content}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {project.live_url && (
              <Button 
                onClick={() => window.open(project.live_url!, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Site
              </Button>
            )}
            
            {project.github_url && (
              <Button 
                variant="outline"
                onClick={() => window.open(project.github_url!, '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                View Code
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
