'use client'
 
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useEffect } from "react"
 
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    // Add scroll-smooth class to html element
    document.documentElement.classList.add('scroll-smooth')
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}