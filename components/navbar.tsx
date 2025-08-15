'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
    <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white">
          Selwyn Uy
        </Link>

        <nav className="flex items-center gap-4">
          {isHomePage && (
            <>
              <Link href="/#about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                About
              </Link>
              <Link href="/#projects" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                Projects
              </Link>
              <Link href="/#contact" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                Contact
              </Link>
            </>
          )}
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
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
