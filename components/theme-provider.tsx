'use client'

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useEffect } from "react"
import type { ComponentProps } from "react"

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    // Add scroll-smooth class to html element
    document.documentElement.classList.add('scroll-smooth')
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}