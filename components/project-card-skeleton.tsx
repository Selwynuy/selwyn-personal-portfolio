'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      
      <CardHeader>
        {/* Title skeleton */}
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        {/* Description skeleton */}
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mt-2 animate-pulse" />
      </CardHeader>

      <CardContent>
        {/* Technologies skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" 
            />
          ))}
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
