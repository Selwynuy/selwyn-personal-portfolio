/**
 * Design System - Consistent Colors and Styles
 *
 * This file defines the color palette and common styles used throughout the application.
 * All components should use these values for consistency.
 */

export const colors = {
  // Primary gradient (blue → purple)
  primary: {
    gradient: 'from-blue-600 to-purple-600',
    gradientDark: 'dark:from-blue-500 dark:to-purple-500',
    gradientLight: 'from-blue-500/10 to-purple-500/10',
    text: 'from-blue-600 to-purple-600 bg-clip-text text-transparent',
    textDark: 'dark:from-blue-400 dark:to-purple-400',
    shadow: 'shadow-blue-500/25',
    shadowHover: 'hover:shadow-blue-500/30',
  },

  // Accent color (cyan/sky for highlights)
  accent: {
    gradient: 'from-cyan-500 to-blue-500',
    gradientDark: 'dark:from-cyan-400 dark:to-blue-400',
  },

  // Status colors
  success: {
    gradient: 'from-green-500 to-emerald-500',
    solid: 'bg-green-500',
  },

  warning: {
    gradient: 'from-orange-500 to-amber-500',
    solid: 'bg-orange-500',
  },

  danger: {
    gradient: 'from-red-500 to-rose-500',
    solid: 'bg-red-500',
  },
} as const

export const styles = {
  // Button styles
  button: {
    primary: `bg-gradient-to-r ${colors.primary.gradient} text-white shadow-lg ${colors.primary.shadow} transition-all hover:shadow-xl ${colors.primary.shadowHover} ${colors.primary.gradientDark}`,
    outline: 'border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400',
  },

  // Card styles
  card: {
    base: 'rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80',
    hover: 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
  },

  // Badge/Tag styles
  badge: {
    primary: `inline-block rounded-full bg-gradient-to-r ${colors.primary.gradientLight} px-4 py-1.5`,
    text: `bg-gradient-to-r ${colors.primary.text} text-sm font-semibold ${colors.primary.textDark}`,
  },

  // Heading styles with gradient
  heading: {
    gradient: `bg-gradient-to-r ${colors.primary.text} ${colors.primary.textDark}`,
  },

  // Icon container
  iconContainer: {
    primary: `rounded-full bg-gradient-to-br ${colors.primary.gradient} p-2`,
    withShadow: `rounded-xl bg-gradient-to-br ${colors.primary.gradient} p-3 shadow-lg`,
  },
} as const
