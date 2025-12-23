'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Player } from '@/types/player'
import { EmptyState } from '@/components/ui/empty-state'
import { CalendarCheck } from 'lucide-react'

interface AttendanceTabProps {
  player: Player
  className?: string
}

export function AttendanceTab({ player, className }: AttendanceTabProps) {
  const t = useTranslations('players')

  // Placeholder - attendance feature will be implemented later
  return (
    <div className={cn('py-8', className)}>
      <EmptyState
        icon={CalendarCheck}
        title={t('tabs.attendance')}
        description="Attendance history and statistics will be displayed here. This feature is coming soon."
        variant="card"
      />
    </div>
  )
}

export default AttendanceTab
