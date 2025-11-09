"use client"

import * as React from 'react'
import * as SI from 'simple-icons/icons'

type BrandIconName = keyof typeof SI

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  name?: BrandIconName
  title?: string
  path?: string
  viewBox?: string
}

export function BrandIcon({ name, title, path, viewBox = '0 0 24 24', className, ...props }: BrandIconProps) {
  const icon = name ? (SI as unknown as Record<string, { path: string; title: string }>)[name] : undefined
  const finalPath = path || icon?.path
  const finalTitle = title || icon?.title || name
  if (!finalPath) {
    return (
      <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-2 py-0.5 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        {finalTitle || 'icon'}
      </span>
    )
  }

  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={finalTitle as string}
      className={className}
      {...props}
    >
      <title>{finalTitle as string}</title>
      <path d={finalPath} fill="currentColor" />
    </svg>
  )
}


