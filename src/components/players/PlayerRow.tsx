'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Player } from '@/types/player'
import { LevelIndicator } from './LevelIndicator'
import { StatusDot } from './StatusBadge'
import { Mail, Phone, MoreHorizontal, Edit, Trash2, Eye, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface PlayerRowProps {
  player: Player
  onView?: (player: Player) => void
  onEdit?: (player: Player) => void
  onDelete?: (player: Player) => void
  className?: string
}

export function PlayerRow({
  player,
  onView,
  onEdit,
  onDelete,
  className,
}: PlayerRowProps) {
  const t = useTranslations('players')
  const [showActions, setShowActions] = useState(false)

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
        'group relative flex items-center gap-4 rounded-xl border border-transparent bg-white px-4 py-3 transition-all duration-200',
        'hover:border-stone-200 hover:shadow-md hover:shadow-stone-100',
        className
      )}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-display font-bold text-white shadow-sm',
          gradients[gradientIndex]
        )}
      >
        {initials}
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-stone-900 truncate">{player.name}</h3>
          <StatusDot status={player.status} />
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-sm text-stone-500">
          {player.email && (
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate max-w-[180px]">{player.email}</span>
            </span>
          )}
          {player.phone && (
            <span className="hidden sm:flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {player.phone}
            </span>
          )}
        </div>
      </div>

      {/* Level */}
      <div className="hidden md:flex shrink-0">
        <LevelIndicator level={player.level} variant="badge" showLabel />
      </div>

      {/* Mobile level */}
      <div className="flex md:hidden shrink-0">
        <LevelIndicator level={player.level} size="sm" />
      </div>

      {/* Actions */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowActions(!showActions)}
          className={cn(
            'rounded-lg p-2 text-stone-400 transition-colors',
            'hover:bg-stone-100 hover:text-stone-600',
            showActions && 'bg-stone-100 text-stone-600'
          )}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>

        {showActions && (
          <div className="absolute right-0 top-full z-10 mt-1 w-44 animate-scale-in rounded-xl border border-stone-200 bg-white py-1.5 shadow-xl">
            {onView && (
              <button
                onClick={() => {
                  onView(player)
                  setShowActions(false)
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Eye className="h-4 w-4 text-stone-400" />
                {t('playerDetails')}
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(player)
                  setShowActions(false)
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Edit className="h-4 w-4 text-stone-400" />
                {t('editPlayer')}
              </button>
            )}
            {onDelete && (
              <>
                <div className="my-1 border-t border-stone-100" />
                <button
                  onClick={() => {
                    onDelete(player)
                    setShowActions(false)
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('deletePlayer')}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Click to view indicator (shows on hover) */}
      {onView && (
        <button
          onClick={() => onView(player)}
          className="absolute right-14 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-5 w-5 text-stone-300" />
        </button>
      )}
    </div>
  )
}

export default PlayerRow
