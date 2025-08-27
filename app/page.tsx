import { Suspense } from 'react'
import { createClient } from '@/lib/server'
import Link from 'next/link'
import { Hero } from '@/components/home/hero'
import { About } from '@/components/home/about'
import { ProjectsSection } from '@/components/home/projects-section'
import { ContactSection } from '@/components/home/contact-section'
import { SiteFooter } from '@/components/home/site-footer'
import { SkillsMarquee } from '@/components/home/skills-marquee'

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

  // Fetch site owner (first admin) basic profile
  const { data: owner } = await supabase
    .from('profiles')
    .select('id, avatar_url, full_name')
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
    <div className="min-h-screen bg-transparent dark:bg-transparent">
      <Hero socialLinks={socialLinks} avatarUrl={owner?.avatar_url || undefined} ownerName={owner?.full_name || undefined} />
      <SkillsMarquee />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      <ProjectsSection projects={projects || []} />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      <About />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      <ContactSection userId={user?.id ?? null} />
      <SiteFooter />
    </div>
  )
}