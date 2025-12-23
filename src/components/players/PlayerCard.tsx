'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Player } from '@/types/player'
import { LevelIndicator } from './LevelIndicator'
import { StatusBadge } from './StatusBadge'
import { Mail, Phone, MoreVertical, Edit, Trash2, Eye, User } from 'lucide-react'

interface PlayerCardProps {
  player: Player
  onView?: (player: Player) => void
  onEdit?: (player: Player) => void
  onDelete?: (player: Player) => void
  className?: string
}

export function PlayerCard({
  player,
  onView,
  onEdit,
  onDelete,
  className,
}: PlayerCardProps) {
  const t = useTranslations('players')
  const [showActions, setShowActions] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Generate initials from name
  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Generate a consistent gradient based on player ID
  const gradientIndex = player.id.charCodeAt(0) % 5
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-violet-500 to-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
  ]

  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-stone-200 bg-white transition-all duration-300',
        'hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowActions(false)
      }}
    >
      {/* Card header with gradient background */}
      <div className="relative h-20 overflow-hidden rounded-t-2xl">
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-90',
            gradients[gradientIndex]
          )}
        />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id={`pattern-${player.id}`} patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="10" cy="10" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#pattern-${player.id})`} />
          </svg>
        </div>

        {/* Actions dropdown */}
        <div className="absolute right-3 top-3">
          <button
            onClick={() => setShowActions(!showActions)}
            className={cn(
              'rounded-full bg-white/20 p-1.5 backdrop-blur-sm transition-all',
              'hover:bg-white/40',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <MoreVertical className="h-4 w-4 text-white" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-36 animate-scale-in rounded-lg border border-stone-200 bg-white py-1 shadow-lg">
              {onView && (
                <button
                  onClick={() => onView(player)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  <Eye className="h-4 w-4" />
                  {t('playerDetails')}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(player)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  <Edit className="h-4 w-4" />
                  {t('editPlayer')}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(player)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('deletePlayer')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className="relative mx-auto -mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br shadow-lg">
        <div
          className={cn(
            'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br text-xl font-display font-bold text-white',
            gradients[gradientIndex]
          )}
        >
          {initials}
        </div>
      </div>

      {/* Card content */}
      <div className="px-5 pb-5 pt-3 text-center">
        <h3 className="text-lg font-semibold text-stone-900 truncate">{player.name}</h3>

        <div className="mt-1 flex items-center justify-center gap-2">
          <StatusBadge status={player.status} size="sm" />
        </div>

        {/* Contact info */}
        <div className="mt-4 space-y-2">
          {player.email && (
            <a
              href={`mailto:${player.email}`}
              className="flex items-center justify-center gap-2 text-sm text-stone-500 hover:text-blue-600 transition-colors truncate"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{player.email}</span>
            </a>
          )}
          {player.phone && (
            <a
              href={`tel:${player.phone}`}
              className="flex items-center justify-center gap-2 text-sm text-stone-500 hover:text-blue-600 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {player.phone}
            </a>
          )}
        </div>

        {/* Level indicator */}
        <div className="mt-4 flex justify-center">
          <LevelIndicator level={player.level} variant="pill" showLabel />
        </div>

        {/* Quick action buttons on hover */}
        <div
          className={cn(
            'mt-4 flex justify-center gap-2 transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
        >
          {onView && (
            <button
              onClick={() => onView(player)}
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t('playerDetails')}
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(player)}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50"
            >
              {t('edit')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
