'use client'

import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ 
  variant = 'outline', 
  size = 'sm', 
  className = '',
  children = '🚪 Sign Out'
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? 'Signing out...' : children}
    </Button>
  )
}
