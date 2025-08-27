import { Suspense } from 'react'
import { createClient } from '@/lib/server'
import Link from 'next/link'
import { Hero } from '@/components/home/hero'
import { About } from '@/components/home/about'
import { ProjectsSection } from '@/components/home/projects-section'
import { ContactSection } from '@/components/home/contact-section'
import { SiteFooter } from '@/components/home/site-footer'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Await searchParams in Next.js 15
  const params = await searchParams

  // Fetch featured projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch site owner's social links (first admin's links)
  const { data: owner } = await supabase
    .from('profiles')
    .select('id')
    .eq('is_admin', true)
    .limit(1)
    .single()

  let socialLinks: { platform: string; url: string; label: string | null }[] = []
  if (owner?.id) {
    const { data } = await supabase
      .from('social_links')
      .select('platform, url, label')
      .eq('user_id', owner.id)
      .order('position', { ascending: true })
    socialLinks = data || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Hero socialLinks={socialLinks} />
      <About />
      <ProjectsSection projects={projects || []} />
      <ContactSection userId={user?.id ?? null} />
      <SiteFooter />
    </div>
  )
}