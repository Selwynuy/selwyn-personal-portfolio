import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NavbarWrapper } from '@/components/navbar-wrapper'
import { ThemeProvider } from '@/components/theme-provider'
import { createClient } from '@/lib/server'
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Generate dynamic metadata from site settings
export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()

  // Fetch site settings
  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('meta_title, meta_description')
    .single()

  return {
    title: siteSettings?.meta_title || "Portfolio - Full Stack Developer",
    description: siteSettings?.meta_description || "Full Stack Developer Portfolio showcasing projects and expertise",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}