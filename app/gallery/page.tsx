import { createClient } from '@/lib/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function GalleryListingPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('status', 'published')
    .order('position', { ascending: true })

  // Group by category
  const categories = items?.reduce((acc, item) => {
    const category = item.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <Link href="/">
              <Button variant="ghost" className="mb-4 group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Button>
            </Link>
            <h1 className="mb-4 text-5xl font-bold text-slate-900 dark:text-white">
              Gallery
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              A collection of my creative work and visual projects
            </p>
          </div>

          {/* Gallery */}
          {items && items.length > 0 ? (
            <div className="space-y-16">
              {Object.entries(categories || {}).map(([category, categoryItems]) => (
                <section key={category}>
                  <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
                    {category}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryItems?.map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 transition-transform hover:scale-105"
                      >
                        <img
                          src={item.thumbnail_url || item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                            {item.description && (
                              <p className="line-clamp-2 text-sm text-slate-200">
                                {item.description}
                              </p>
                            )}
                            {item.tags && item.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                No gallery items published yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
