import { Suspense } from 'react'
import { createClient } from '@/lib/server'
import Link from 'next/link'
import { Hero } from '@/components/home/hero'
import { About } from '@/components/home/about'
import { ProjectsSection } from '@/components/home/projects-section'
import { ContactSection } from '@/components/home/contact-section'
import { SiteFooter } from '@/components/home/site-footer'
import { SkillsMarquee } from '@/components/home/skills-marquee'
import { BlogSection } from '@/components/home/blog-section'
import { GallerySection } from '@/components/home/gallery-section'
import { PricingSection } from '@/components/home/pricing-section'

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

  // Fetch gallery media for these projects in one call
  let projectsWithMedia = projects || []
  if (projects && projects.length > 0) {
    const ids = projects.map((p) => p.id)
    const { data: media } = await supabase
      .from('project_media')
      .select('*')
      .in('project_id', ids)
      .order('position', { ascending: true })
    const mediaByProject = new Map<string, any[]>()
    ;(media || []).forEach((m) => {
      const arr = mediaByProject.get(m.project_id) || []
      arr.push(m)
      mediaByProject.set(m.project_id, arr)
    })
    projectsWithMedia = projects.map((p) => ({ ...p, _media: mediaByProject.get(p.id) || [] }))
  }

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

  // Fetch site settings to check if blog/gallery are enabled and get resume URL
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('enable_blog, enable_gallery, resume_url')
    .single()

  // Fetch blog posts only if enabled
  let blogPosts = null
  if (siteSettings?.enable_blog) {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(3)
    blogPosts = data
  }

  // Fetch gallery items only if enabled
  let galleryItems = null
  if (siteSettings?.enable_gallery) {
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('status', 'published')
      .order('position', { ascending: true })
      .limit(6)
    galleryItems = data
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Hero
        socialLinks={socialLinks}
        avatarUrl={owner?.avatar_url || undefined}
        ownerName={owner?.full_name || undefined}
        resumeUrl={siteSettings?.resume_url || undefined}
      />
      <SkillsMarquee />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      <ProjectsSection projects={projectsWithMedia || []} />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      <About />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      <BlogSection posts={blogPosts || []} />
      {(blogPosts && blogPosts.length > 0) && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      )}
      <GallerySection items={galleryItems || []} />
      {(galleryItems && galleryItems.length > 0) && (
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      )}
      <PricingSection />
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/10" />
      <ContactSection userId={user?.id ?? null} />
      <SiteFooter socialLinks={socialLinks} ownerName={owner?.full_name || 'Selwyn'} />
    </div>
  )
}