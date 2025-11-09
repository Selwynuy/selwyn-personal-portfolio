'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'

export function NavbarWrapper() {
  const pathname = usePathname()
  const [siteSettings, setSiteSettings] = useState<{ enable_blog: boolean; enable_gallery: boolean } | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('site_settings')
        .select('enable_blog, enable_gallery')
        .single()

      setSiteSettings(data)
    }

    fetchSettings()
  }, [])

  // Hide navbar in admin/dashboard section
  if (pathname?.startsWith('/dashboard')) {
    return null
  }

  return (
    <Navbar
      enableBlog={siteSettings?.enable_blog ?? false}
      enableGallery={siteSettings?.enable_gallery ?? false}
    />
  )
}
