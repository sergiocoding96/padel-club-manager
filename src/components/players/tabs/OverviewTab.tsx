'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Player } from '@/types/player'
import { LevelIndicator } from '../LevelIndicator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, FileText, TrendingUp, Clock, Calendar, User } from 'lucide-react'

interface OverviewTabProps {
  player: Player
  className?: string
}

export function OverviewTab({ player, className }: OverviewTabProps) {
  const t = useTranslations('players')
  const tLevels = useTranslations('levels')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className={cn('grid gap-6 md:grid-cols-2', className)}>
      {/* Level & Progress Card */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            {t('level')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <LevelIndicator level={player.level} variant="arc" size="lg" />
            <div>
              <p className="text-2xl font-bold text-stone-900">
                {tLevels(String(player.level))}
              </p>
              <p className="text-sm text-stone-500">
                {t('level')} {player.level} / 7
              </p>
            </div>
          </div>

          {/* Level progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-stone-500 mb-2">
              <span>{tLevels('1')}</span>
              <span>{tLevels('7')}</span>
            </div>
            <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${(player.level / 7) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player Info Card */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            {t('playerDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('createdAt')}
              </dt>
              <dd className="text-sm font-medium text-stone-900">
                {formatDate(player.createdAt)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-stone-500 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('updatedAt')}
              </dt>
              <dd className="text-sm font-medium text-stone-900">
                {formatDate(player.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Objectives Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600" />
            {t('objectives')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {player.objectives ? (
            <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
              {player.objectives}
            </p>
          ) : (
            <p className="text-stone-400 italic">
              {t('form.objectivesPlaceholder')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notes Card */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-600" />
            {t('notes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {player.notes ? (
            <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
              {player.notes}
            </p>
          ) : (
            <p className="text-stone-400 italic">
              {t('form.notesPlaceholder')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OverviewTab
