import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/server'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Navigation items
const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: "📊"
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: "📁"
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: "📧"
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "⚙️"
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

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-slate-800">
        <div className="flex h-14 items-center border-b px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold">Portfolio Admin</span>
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
                  {user.user_metadata?.full_name || 'Admin User'}
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
                  <span className="flex h-6 w-6 items-center justify-center">
                    {item.icon}
                  </span>
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <form action="/auth/sign-out" method="post">
            <Button type="submit" variant="outline" size="sm" className="w-full">
              🚪 Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="flex md:hidden h-14 items-center border-b bg-white dark:bg-slate-800 px-4 py-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              ≡
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-14 items-center border-b px-4 py-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-lg font-semibold">Portfolio Admin</span>
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
                      {user.user_metadata?.full_name || 'Admin User'}
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
                      <span className="flex h-6 w-6 items-center justify-center">
                        {item.icon}
                      </span>
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form action="/auth/sign-out" method="post">
                <Button type="submit" variant="outline" size="sm" className="w-full">
                  🚪 Sign Out
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
        <div className="ml-4 text-lg font-semibold">Portfolio Admin</div>
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
