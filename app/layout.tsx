import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { createClient } from '@/lib/server'
import { Navbar } from '@/components/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Your Name - Portfolio",
  description: "Full Stack Developer Portfolio",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar user={user} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}