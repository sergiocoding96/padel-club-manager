'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface LevelIndicatorProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  variant?: 'badge' | 'arc' | 'pill'
  className?: string
}

// Athletic color progression: cool → warm as level increases
const levelColors: Record<number, { bg: string; text: string; ring: string; glow: string }> = {
  1: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', glow: 'shadow-emerald-500/20' },
  2: { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200', glow: 'shadow-teal-500/20' },
  3: { bg: 'bg-cyan-50', text: 'text-cyan-700', ring: 'ring-cyan-200', glow: 'shadow-cyan-500/20' },
  4: { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-200', glow: 'shadow-blue-500/20' },
  5: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200', glow: 'shadow-violet-500/20' },
  6: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200', glow: 'shadow-amber-500/20' },
  7: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-200', glow: 'shadow-rose-500/20' },
}

const levelColorsArc: Record<number, string> = {
  1: '#10b981', // emerald
  2: '#14b8a6', // teal
  3: '#06b6d4', // cyan
  4: '#3b82f6', // blue
  5: '#8b5cf6', // violet
  6: '#f59e0b', // amber
  7: '#f43f5e', // rose
}

export function LevelIndicator({
  level,
  size = 'md',
  showLabel = false,
  variant = 'badge',
  className,
}: LevelIndicatorProps) {
  const t = useTranslations('levels')
  const colors = levelColors[level] || levelColors[4]
  const arcColor = levelColorsArc[level] || levelColorsArc[4]

  const sizeClasses = {
    sm: { badge: 'h-6 w-6 text-xs', pill: 'px-2 py-0.5 text-xs', arc: 'h-8 w-8' },
    md: { badge: 'h-8 w-8 text-sm', pill: 'px-3 py-1 text-sm', arc: 'h-12 w-12' },
    lg: { badge: 'h-10 w-10 text-base', pill: 'px-4 py-1.5 text-base', arc: 'h-16 w-16' },
  }

  if (variant === 'arc') {
    const progress = (level / 7) * 100
    const circumference = 2 * Math.PI * 18 // radius = 18
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
      <div className={cn('relative inline-flex items-center gap-2', className)}>
        <div className={cn('relative', sizeClasses[size].arc)}>
          {/* Background circle */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-stone-100"
            />
            {/* Progress arc */}
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke={arcColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          {/* Center number */}
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center font-display font-bold',
              colors.text,
              size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'
            )}
          >
            {level}
          </span>
        </div>
        {showLabel && (
          <span className={cn('font-medium', colors.text, sizeClasses[size].pill)}>
            {t(String(level))}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium ring-1 transition-all',
          colors.bg,
          colors.text,
          colors.ring,
          sizeClasses[size].pill,
          'hover:shadow-md',
          colors.glow,
          className
        )}
      >
        <span className="font-display font-bold">{level}</span>
        {showLabel && <span className="font-sans">· {t(String(level))}</span>}
      </div>
    )
  }

  // Default badge variant
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-display font-bold ring-1 transition-all',
          colors.bg,
          colors.text,
          colors.ring,
          sizeClasses[size].badge,
          'hover:shadow-lg',
          colors.glow
        )}
      >
        {level}
      </div>
      {showLabel && (
        <span className={cn('font-medium text-stone-600', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {t(String(level))}
        </span>
      )}
    </div>
  )
}

export default LevelIndicator
