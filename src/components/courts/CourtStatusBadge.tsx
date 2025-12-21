'use client'

import { Badge } from '@/components/ui'
import { useTranslations } from 'next-intl'
import type { CourtStatus } from '@/types/database'

const statusVariants: Record<CourtStatus, 'success' | 'warning' | 'error'> = {
  available: 'success',
  maintenance: 'warning',
  reserved: 'error',
}

interface CourtStatusBadgeProps {
  status: CourtStatus
  size?: 'sm' | 'md'
}

export function CourtStatusBadge({ status, size = 'sm' }: CourtStatusBadgeProps) {
  const t = useTranslations('courts')

  return (
    <Badge variant={statusVariants[status]} size={size}>
      {t(status)}
    </Badge>
  )
}
