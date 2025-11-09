import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/server'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createProfile } from '@/lib/actions'
import { LogoutButton } from '@/components/logout-button'
import { BarChart3, FolderOpen, Mail, Settings, Menu, FileText, Image, Home } from 'lucide-react'

// Navigation items
const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart3
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: FileText
  },
  {
    title: "Gallery",
    href: "/dashboard/gallery",
    icon: Image
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: Mail
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  }
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  // Ensure profile exists
  let profile = null
  try {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    profile = profileData
  } catch (profileError) {
    // Profile doesn't exist, create one
    try {
      profile = await createProfile(user.id, user.email || '')
    } catch (createError) {
      console.error('Failed to create profile:', createError)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-slate-800">
        <div className="flex h-14 items-center border-b px-4 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Home className="h-5 w-5" />
            <span className="text-lg font-semibold">Home</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Avatar>
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || user.user_metadata?.full_name || 'Admin User'}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            <nav className="grid gap-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <LogoutButton className="w-full" />
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="flex md:hidden h-14 items-center border-b bg-white dark:bg-slate-800 px-4 py-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-14 items-center border-b px-4 py-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Home className="h-5 w-5" />
                <span className="text-lg font-semibold">Home</span>
              </Link>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar>
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || user.user_metadata?.full_name || 'Admin User'}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <nav className="grid gap-1">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <LogoutButton className="w-full" />
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="ml-4 text-lg font-semibold hover:opacity-80 transition-opacity flex items-center gap-2">
          <Home className="h-5 w-5" />
          Home
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
