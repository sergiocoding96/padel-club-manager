'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import type { AttendanceStatus } from '@/types/database';

type BadgeSize = 'sm' | 'md' | 'lg';

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  size?: BadgeSize;
  showIcon?: boolean;
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
}

const statusConfig: Record<
  AttendanceStatus,
  {
    label: string;
    labelEs: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    icon: typeof CheckCircle;
    iconColor: string;
  }
> = {
  pending: {
    label: 'Pending',
    labelEs: 'Pendiente',
    bgColor: 'bg-stone-100',
    textColor: 'text-stone-700',
    borderColor: 'border-stone-300',
    icon: HelpCircle,
    iconColor: 'text-stone-500',
  },
  present: {
    label: 'Present',
    labelEs: 'Presente',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  late: {
    label: 'Late',
    labelEs: 'Tarde',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-300',
    icon: Clock,
    iconColor: 'text-amber-600',
  },
  absent: {
    label: 'Absent',
    labelEs: 'Ausente',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
    icon: XCircle,
    iconColor: 'text-red-600',
  },
  excused: {
    label: 'Excused',
    labelEs: 'Justificado',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    icon: AlertCircle,
    iconColor: 'text-blue-600',
  },
};

const sizeStyles: Record<BadgeSize, { badge: string; icon: string; text: string }> = {
  sm: {
    badge: 'px-2 py-0.5 gap-1',
    icon: 'w-3 h-3',
    text: 'text-xs',
  },
  md: {
    badge: 'px-2.5 py-1 gap-1.5',
    icon: 'w-4 h-4',
    text: 'text-sm',
  },
  lg: {
    badge: 'px-3 py-1.5 gap-2',
    icon: 'w-5 h-5',
    text: 'text-base',
  },
};

export function AttendanceStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  showLabel = true,
  pulse = false,
  className,
}: AttendanceStatusBadgeProps) {
  const config = statusConfig[status];
  const sizes = sizeStyles[size];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all duration-200',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizes.badge,
        sizes.text,
        pulse && status === 'pending' && 'animate-pulse',
        className
      )}
      role="status"
      aria-label={config.label}
    >
      {showIcon && (
        <Icon
          className={cn(sizes.icon, config.iconColor)}
          aria-hidden="true"
        />
      )}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

// Icon-only variant for compact displays
export function AttendanceStatusIcon({
  status,
  size = 'md',
  className,
}: {
  status: AttendanceStatus;
  size?: BadgeSize;
  className?: string;
}) {
  const config = statusConfig[status];
  const sizes = sizeStyles[size];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full p-1',
        config.bgColor,
        className
      )}
      role="status"
      aria-label={config.label}
    >
      <Icon className={cn(sizes.icon, config.iconColor)} aria-hidden="true" />
    </div>
  );
}

// Dot indicator for minimal displays
export function AttendanceStatusDot({
  status,
  size = 'md',
  pulse = false,
  className,
}: {
  status: AttendanceStatus;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}) {
  const config = statusConfig[status];

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const bgColors: Record<AttendanceStatus, string> = {
    pending: 'bg-stone-400',
    present: 'bg-green-500',
    late: 'bg-amber-500',
    absent: 'bg-red-500',
    excused: 'bg-blue-500',
  };

  return (
    <span
      className={cn(
        'inline-block rounded-full',
        dotSizes[size],
        bgColors[status],
        pulse && status === 'pending' && 'animate-pulse',
        className
      )}
      role="status"
      aria-label={config.label}
    />
  );
}

export { statusConfig };
