import { createClient } from '@/lib/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const _next = searchParams.get('next')
  const next = _next?.startsWith('/') ? _next : '/'

  console.log('Email confirmation attempt:', { token_hash: !!token_hash, type, url: request.url })

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      console.log('Email confirmed successfully, redirecting to:', next)
      // redirect user to specified redirect URL or root of app
      redirect(next)
    } else {
      console.error('Email confirmation error:', error)
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${encodeURIComponent(error?.message || 'Unknown error')}`)
    }
  }

  // Log the missing parameters for debugging
  console.error('Missing email confirmation parameters:', { 
    token_hash: !!token_hash, 
    type, 
    fullUrl: request.url 
  })
  
  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=${encodeURIComponent('No token hash or type found in confirmation link')}`)
}
