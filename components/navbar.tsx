'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home, User, Grid2x2, FileText, Image as ImageIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from '@/components/logout-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/client'
import { useEffect, useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Function to check admin status without blocking UI
  const checkAdminStatus = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data: isAdminData } = await supabase.rpc('is_admin', { user_id: userId })
      console.log('Navbar: Admin check result:', isAdminData)
      setIsAdmin(isAdminData || false)
    } catch (error) {
      console.error('Error checking admin status (non-blocking):', error)
      setIsAdmin(false)
    }
  }

  // Function to fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      console.log('Navbar: Profile fetched:', !!profileData)
      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile (non-blocking):', error)
      setProfile(null)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial user state
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        console.log('Navbar: Initial user state:', user ? 'Logged in' : 'Not logged in')
        setUser(user)
        
        if (user) {
          console.log('Navbar: User email:', user.email)
          // Check admin status and fetch profile in background (non-blocking)
          checkAdminStatus(user.id)
          fetchProfile(user.id)
        }
      } catch (error) {
        console.error('Error getting initial user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Navbar: Auth state changed:', event, session ? 'Session exists' : 'No session')
        
        // Always update user state first
        setUser(session?.user ?? null)
        
        // Check admin status and fetch profile for new user (non-blocking)
        if (session?.user) {
          console.log('Navbar: User email from session:', session.user.email)
          checkAdminStatus(session.user.id)
          fetchProfile(session.user.id)
        } else {
          setIsAdmin(false)
          setProfile(null)
        }
        
        // Always ensure loading is false after auth state change
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Show user dropdown for any authenticated user, regardless of admin status
  const showUserDropdown = user && !loading
  console.log('Navbar: showUserDropdown:', showUserDropdown, 'user:', !!user, 'loading:', loading)

  return (
    <header className="sticky top-0 z-50">
      <div className="container mx-auto px-4 pt-4">
        <div className="flex items-center justify-center">
          <nav className="flex w-full max-w-4xl items-center justify-between gap-2 rounded-full border border-slate-900/10 ring-1 ring-slate-900/10 bg-gradient-to-r from-slate-900/5 via-purple-500/5 to-slate-900/5 px-2 py-1 backdrop-blur supports-[backdrop-filter]:bg-slate-900/5 dark:border-white/10 dark:bg-white/10 dark:ring-white/10">
            <Link href="/" className="ml-1 flex items-center gap-2 rounded-full px-3 py-1 text-sm text-slate-700 hover:text-slate-900 dark:text-slate-100/90">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
              <Link href="/#about" className="flex items-center gap-2 rounded-full px-3 py-1 text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </Link>
              <Link href="/#projects" className="flex items-center gap-2 rounded-full px-3 py-1 text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                <Grid2x2 className="h-4 w-4" />
                <span className="hidden sm:inline">Work</span>
              </Link>
              <Link href="/#blog" className="flex items-center gap-2 rounded-full px-3 py-1 text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Blog</span>
              </Link>
              <Link href="/#gallery" className="flex items-center gap-2 rounded-full px-3 py-1 text-sm text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Gallery</span>
              </Link>
            </div>
            <div className="mr-1 flex items-center gap-2 pl-2">
              <ThemeToggle />

          {!loading && (
            <>
              {showUserDropdown ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {profile?.full_name || user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs leading-none text-slate-500">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <p className="text-xs leading-none text-blue-600 font-medium">
                            Administrator
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Only show dashboard options to admins */}
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard">
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/projects">
                            Projects
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/messages">
                            Messages
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/settings">
                            Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <LogoutButton 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start h-9 px-2 py-1.5 text-sm font-normal"
                      >
                        Sign Out
                      </LogoutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="backdrop-blur border-slate-900/15 dark:border-white/10 text-slate-700 dark:text-white">Login</Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white">Sign Up</Button>
                  </Link>
                </div>
              )}
            </>
          )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
