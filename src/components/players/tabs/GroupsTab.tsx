'use client'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Player } from '@/types/player'
import { EmptyState } from '@/components/ui/empty-state'
import { Users } from 'lucide-react'

interface GroupsTabProps {
  player: Player
  className?: string
}

export function GroupsTab({ player, className }: GroupsTabProps) {
  const t = useTranslations('players')

  // Placeholder - groups feature will be implemented later
  return (
    <div className={cn('py-8', className)}>
      <EmptyState
        icon={Users}
        title={t('tabs.groups')}
        description="Group assignments will be displayed here. This feature is coming soon."
        variant="card"
      />
    </div>
  )
}

export default GroupsTab
