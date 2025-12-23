'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Player } from '@/types/player'
import { LevelIndicator } from './LevelIndicator'
import { StatusBadge } from './StatusBadge'
import { Mail, Phone, Calendar, Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PlayerHeaderProps {
  player: Player
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export function PlayerHeader({
  player,
  onEdit,
  onDelete,
  className,
}: PlayerHeaderProps) {
  const t = useTranslations('players')
  const tCommon = useTranslations('common')

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className={cn('relative', className)}>
      {/* Background gradient header */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl sm:h-56">
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-95',
            gradients[gradientIndex]
          )}
        />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="header-pattern" patternUnits="userSpaceOnUse" width="30" height="30">
              <circle cx="15" cy="15" r="2" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#header-pattern)" />
          </svg>
        </div>

        {/* Back button */}
        <Link
          href="/players"
          className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {tCommon('back')}
        </Link>

        {/* Actions */}
        <div className="absolute right-4 top-4 flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">{tCommon('edit')}</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-red-500/80 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">{tCommon('delete')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative rounded-b-2xl border border-t-0 border-stone-200 bg-white px-6 pb-6 pt-16 sm:px-8">
        {/* Avatar */}
        <div className="absolute -top-16 left-6 sm:left-8">
          <div
            className={cn(
              'flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br text-3xl font-display font-bold text-white shadow-xl sm:h-32 sm:w-32 sm:text-4xl',
              gradients[gradientIndex]
            )}
          >
            {initials}
          </div>
        </div>

        {/* Info */}
        <div className="ml-32 sm:ml-40">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 sm:text-3xl">{player.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <StatusBadge status={player.status} />
                <LevelIndicator level={player.level} variant="pill" showLabel />
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600">
            {player.email && (
              <a
                href={`mailto:${player.email}`}
                className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Mail className="h-4 w-4 text-stone-400" />
                {player.email}
              </a>
            )}
            {player.phone && (
              <a
                href={`tel:${player.phone}`}
                className="inline-flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Phone className="h-4 w-4 text-stone-400" />
                {player.phone}
              </a>
            )}
            <span className="inline-flex items-center gap-2 text-stone-500">
              <Calendar className="h-4 w-4 text-stone-400" />
              {t('createdAt')}: {formatDate(player.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerHeader
