import { getBlogPost, incrementBlogViews } from '@/lib/actions'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  try {
    const post = await getBlogPost(slug)

    // Only increment views for published posts
    if (post.status === 'published') {
      await incrementBlogViews(post.id)
    }

    return (
      <article className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Back Button */}
            <Link href="/blog">
              <Button variant="ghost" className="mb-8 group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Button>
            </Link>

            {/* Cover Image */}
            {post.cover_image_url && (
              <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl">
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Post Header */}
            <header className="mb-8">
              <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mb-6 text-xl text-slate-600 dark:text-slate-300">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.published_at || post.created_at}>
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                {post.view_count > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.view_count} views</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Post Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {post.content}
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
              <Link href="/blog">
                <Button variant="outline" className="group">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Read More Posts
                </Button>
              </Link>
            </footer>
          </div>
        </div>
      </article>
    )
  } catch {
    notFound()
  }
}
