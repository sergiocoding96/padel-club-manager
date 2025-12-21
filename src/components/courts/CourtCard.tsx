'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MoreVertical,
  Edit,
  Trash2,
  Wrench,
  CheckCircle,
  XCircle,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Court, CourtStatus } from '@/types/database'
import { CourtStatusBadge } from './CourtStatusBadge'
import { SurfaceTypeIndicator } from './SurfaceTypeIndicator'

interface CourtCardProps {
  court: Court
  onEdit: (court: Court) => void
  onDelete: (court: Court) => void
  onStatusChange: (court: Court, status: CourtStatus) => void
}

export function CourtCard({
  court,
  onEdit,
  onDelete,
  onStatusChange,
}: CourtCardProps) {
  const t = useTranslations('courts')
  const tCommon = useTranslations('common')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const statusActions: {
    status: CourtStatus
    icon: typeof CheckCircle
    label: string
    color: string
  }[] = [
    {
      status: 'available',
      icon: CheckCircle,
      label: t('available'),
      color: 'text-emerald-600',
    },
    {
      status: 'maintenance',
      icon: Wrench,
      label: t('maintenance'),
      color: 'text-amber-600',
    },
    {
      status: 'reserved',
      icon: XCircle,
      label: t('reserved'),
      color: 'text-rose-600',
    },
  ]

  // Dynamic gradient based on surface type
  const headerGradient =
    court.surface_type === 'indoor'
      ? 'from-blue-500 via-blue-600 to-indigo-700'
      : court.surface_type === 'outdoor'
        ? 'from-emerald-500 via-green-600 to-teal-700'
        : 'from-stone-400 via-stone-500 to-stone-600'

  // Accent color for decorative elements
  const accentColor =
    court.surface_type === 'indoor'
      ? 'bg-blue-400'
      : court.surface_type === 'outdoor'
        ? 'bg-emerald-400'
        : 'bg-stone-400'

  return (
    <div
      data-testid="court-card"
      className={cn(
        'group relative bg-white rounded-2xl overflow-hidden',
        'border border-stone-200/60',
        'shadow-sm hover:shadow-xl hover:shadow-stone-200/50',
        'transition-all duration-500 ease-out',
        'hover:-translate-y-1',
        isHovered && 'ring-2 ring-blue-500/20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative corner accent */}
      <div
        className={cn(
          'absolute top-0 right-0 w-24 h-24',
          'bg-gradient-to-bl from-white/10 to-transparent',
          'rounded-bl-[100px] pointer-events-none'
        )}
      />

      {/* Visual header with gradient */}
      <div
        className={cn(
          'relative h-28 bg-gradient-to-br',
          headerGradient,
          'overflow-hidden'
        )}
      >
        {/* Animated mesh pattern overlay */}
        <div
          className={cn(
            'absolute inset-0 opacity-30',
            'bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]'
          )}
        />

        {/* Diagonal lines pattern */}
        <div
          className={cn(
            'absolute inset-0 opacity-10',
            'bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]'
          )}
        />

        {/* Large watermark letter with animation */}
        <div
          className={cn(
            'absolute -bottom-6 -left-2',
            'text-[120px] font-bold leading-none',
            'text-white/[0.15] select-none pointer-events-none',
            'font-display tracking-tighter',
            'transition-transform duration-700 ease-out',
            'group-hover:scale-110 group-hover:translate-x-2'
          )}
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          {court.name.charAt(0).toUpperCase()}
        </div>

        {/* Sparkle decoration for available courts */}
        {court.status === 'available' && (
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <Sparkles className="w-5 h-5 text-white/70 animate-pulse" />
          </div>
        )}

        {/* Status badge positioned top-right */}
        <div
          className={cn(
            'absolute top-3 right-3',
            'transform transition-transform duration-300',
            'group-hover:scale-105'
          )}
        >
          <CourtStatusBadge status={court.status} />
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content section */}
      <div className="relative p-5">
        {/* Accent bar */}
        <div
          className={cn(
            'absolute top-0 left-5 right-5 h-[3px] -translate-y-1/2 rounded-full',
            accentColor,
            'opacity-80'
          )}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Court name with hover effect */}
            <h3
              className={cn(
                'font-bold text-stone-800 text-lg leading-tight',
                'tracking-tight truncate',
                'transition-colors duration-300',
                'group-hover:text-blue-700'
              )}
            >
              {court.name}
            </h3>

            {/* Surface type indicator */}
            <div className="mt-2">
              <SurfaceTypeIndicator type={court.surface_type} />
            </div>

            {/* Location with icon */}
            {court.location && (
              <div className="flex items-center gap-1.5 mt-2 text-stone-500">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-sm truncate">{court.location}</span>
              </div>
            )}
          </div>

          {/* Actions menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                'p-2 rounded-xl',
                'text-stone-400 hover:text-stone-700',
                'hover:bg-stone-100',
                'transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/30',
                menuOpen && 'bg-stone-100 text-stone-700'
              )}
              aria-label="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown menu with animation */}
            <div
              className={cn(
                'absolute right-0 top-full mt-2 z-50',
                'w-52 bg-white rounded-xl',
                'shadow-xl shadow-stone-200/50',
                'border border-stone-200/60',
                'overflow-hidden',
                'transition-all duration-200 origin-top-right',
                menuOpen
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              )}
            >
              {/* Status change section */}
              <div className="px-3 py-2 bg-stone-50 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  {t('status')}
                </span>
              </div>
              <div className="py-1">
                {statusActions.map(({ status, icon: Icon, label, color }) => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(court, status)
                      setMenuOpen(false)
                    }}
                    disabled={court.status === status}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left',
                      'transition-all duration-150',
                      court.status === status
                        ? 'text-stone-300 cursor-not-allowed bg-stone-50'
                        : `text-stone-600 hover:bg-stone-50 hover:${color}`
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4',
                        court.status === status ? 'text-stone-300' : color
                      )}
                    />
                    <span>{label}</span>
                    {court.status === status && (
                      <span className="ml-auto text-xs text-stone-400">
                        Actual
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Actions section */}
              <div className="border-t border-stone-100 py-1">
                <button
                  onClick={() => {
                    onEdit(court)
                    setMenuOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm',
                    'text-stone-600 hover:bg-stone-50 hover:text-blue-600',
                    'transition-colors duration-150'
                  )}
                >
                  <Edit className="w-4 h-4" />
                  <span>{tCommon('edit')}</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(court)
                    setMenuOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm',
                    'text-stone-600 hover:bg-rose-50 hover:text-rose-600',
                    'transition-colors duration-150'
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{tCommon('delete')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative element - subtle court lines */}
        <div
          className={cn(
            'absolute bottom-2 right-4 opacity-0 group-hover:opacity-100',
            'transition-opacity duration-500 delay-100'
          )}
        >
          <div className="flex gap-0.5">
            <div className="w-8 h-1 rounded-full bg-stone-200" />
            <div className="w-3 h-1 rounded-full bg-stone-300" />
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl pointer-events-none',
          'ring-1 ring-inset ring-white/50',
          'transition-opacity duration-500',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}
