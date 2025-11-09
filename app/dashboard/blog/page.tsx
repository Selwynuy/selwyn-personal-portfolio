import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { getBlogPosts } from '@/lib/actions'
import { BlogPageClient } from '@/components/blog-page-client'

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  const posts = await getBlogPosts(user.id, true)

  return <BlogPageClient initialPosts={posts} userId={user.id} />
}
