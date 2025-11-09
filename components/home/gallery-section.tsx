import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Database } from '@/lib/database.types'

type GalleryItem = Database['public']['Tables']['gallery_items']['Row']

interface GallerySectionProps {
  items: GalleryItem[]
}

export function GallerySection({ items }: GallerySectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section id="gallery" className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            Gallery
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            A collection of my creative work and visual projects
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800"
            >
              <img
                src={item.thumbnail_url || item.image_url}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="line-clamp-2 text-sm text-slate-200">
                      {item.description}
                    </p>
                  )}
                  {item.category && (
                    <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length >= 6 && (
          <div className="mt-12 text-center">
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="group">
                View Full Gallery
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
