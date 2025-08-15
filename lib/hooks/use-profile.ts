'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/client'

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setProfile(null)
      setLoading(false)
      return
    }

    const supabase = createClient()
    
    // Fetch initial profile
    const fetchProfile = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        setProfile(profileData)
      } catch (error) {
        console.error('Error fetching profile:', error)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()

    // Set up real-time subscription for profile changes
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Profile updated:', payload)
          if (payload.eventType === 'UPDATE') {
            setProfile(payload.new)
          } else if (payload.eventType === 'INSERT') {
            setProfile(payload.new)
          } else if (payload.eventType === 'DELETE') {
            setProfile(null)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { profile, loading }
}
