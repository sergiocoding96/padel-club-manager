'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { AttendanceStatus } from '@/types/database';
import { useCallback, useState } from 'react';

interface AttendanceQuickActionsProps {
  currentStatus: AttendanceStatus;
  onStatusChange: (status: AttendanceStatus) => void | Promise<void>;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  excludeStatuses?: AttendanceStatus[];
  className?: string;
}

type ActionStatus = Exclude<AttendanceStatus, 'pending'>;

interface ActionConfig {
  status: ActionStatus;
  label: string;
  labelEs: string;
  icon: typeof CheckCircle;
  activeColor: string;
  hoverColor: string;
  iconColor: string;
  activeIconColor: string;
  shortcut?: string;
}

const actionConfigs: ActionConfig[] = [
  {
    status: 'present',
    label: 'Present',
    labelEs: 'Presente',
    icon: CheckCircle,
    activeColor: 'bg-green-100 border-green-500 ring-green-200',
    hoverColor: 'hover:bg-green-50 hover:border-green-300',
    iconColor: 'text-stone-400 group-hover:text-green-500',
    activeIconColor: 'text-green-600',
    shortcut: 'P',
  },
  {
    status: 'late',
    label: 'Late',
    labelEs: 'Tarde',
    icon: Clock,
    activeColor: 'bg-amber-100 border-amber-500 ring-amber-200',
    hoverColor: 'hover:bg-amber-50 hover:border-amber-300',
    iconColor: 'text-stone-400 group-hover:text-amber-500',
    activeIconColor: 'text-amber-600',
    shortcut: 'L',
  },
  {
    status: 'absent',
    label: 'Absent',
    labelEs: 'Ausente',
    icon: XCircle,
    activeColor: 'bg-red-100 border-red-500 ring-red-200',
    hoverColor: 'hover:bg-red-50 hover:border-red-300',
    iconColor: 'text-stone-400 group-hover:text-red-500',
    activeIconColor: 'text-red-600',
    shortcut: 'A',
  },
  {
    status: 'excused',
    label: 'Excused',
    labelEs: 'Justificado',
    icon: AlertCircle,
    activeColor: 'bg-blue-100 border-blue-500 ring-blue-200',
    hoverColor: 'hover:bg-blue-50 hover:border-blue-300',
    iconColor: 'text-stone-400 group-hover:text-blue-500',
    activeIconColor: 'text-blue-600',
    shortcut: 'E',
  },
];

const sizeStyles = {
  sm: {
    button: 'p-1.5',
    icon: 'w-4 h-4',
    label: 'text-xs',
    gap: 'gap-1',
  },
  md: {
    button: 'p-2',
    icon: 'w-5 h-5',
    label: 'text-sm',
    gap: 'gap-1.5',
  },
  lg: {
    button: 'p-2.5',
    icon: 'w-6 h-6',
    label: 'text-base',
    gap: 'gap-2',
  },
};

export function AttendanceQuickActions({
  currentStatus,
  onStatusChange,
  disabled = false,
  size = 'md',
  showLabels = false,
  excludeStatuses = [],
  className,
}: AttendanceQuickActionsProps) {
  const [loadingStatus, setLoadingStatus] = useState<AttendanceStatus | null>(null);
  const sizes = sizeStyles[size];

  const handleClick = useCallback(
    async (status: AttendanceStatus) => {
      if (disabled || loadingStatus) return;

      setLoadingStatus(status);
      try {
        await onStatusChange(status);
      } finally {
        setLoadingStatus(null);
      }
    },
    [disabled, loadingStatus, onStatusChange]
  );

  const filteredActions = actionConfigs.filter(
    (action) => !excludeStatuses.includes(action.status)
  );

  return (
    <div
      className={cn('inline-flex items-center', sizes.gap, className)}
      role="group"
      aria-label="Attendance status options"
    >
      {filteredActions.map((action) => {
        const Icon = action.icon;
        const isActive = currentStatus === action.status;
        const isLoading = loadingStatus === action.status;

        return (
          <button
            key={action.status}
            type="button"
            onClick={() => handleClick(action.status)}
            disabled={disabled || !!loadingStatus}
            title={`${action.label} (${action.shortcut})`}
            aria-pressed={isActive}
            aria-label={action.label}
            className={cn(
              'group relative inline-flex items-center justify-center rounded-lg border-2 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizes.button,
              isActive
                ? cn(action.activeColor, 'ring-2 scale-105 shadow-sm')
                : cn(
                    'border-stone-200 bg-white',
                    action.hoverColor,
                    'hover:scale-105 hover:shadow-sm'
                  )
            )}
          >
            {isLoading ? (
              <Loader2
                className={cn(sizes.icon, 'animate-spin text-stone-400')}
                aria-hidden="true"
              />
            ) : (
              <Icon
                className={cn(
                  sizes.icon,
                  'transition-colors duration-200',
                  isActive ? action.activeIconColor : action.iconColor
                )}
                aria-hidden="true"
              />
            )}
            {showLabels && (
              <span
                className={cn(
                  sizes.label,
                  'font-medium ml-1',
                  isActive ? 'text-stone-800' : 'text-stone-600'
                )}
              >
                {action.label}
              </span>
            )}
            {/* Keyboard shortcut hint */}
            {!showLabels && action.shortcut && (
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {action.shortcut}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Compact version with just icons in a connected group
export function AttendanceQuickActionsCompact({
  currentStatus,
  onStatusChange,
  disabled = false,
  className,
}: Omit<AttendanceQuickActionsProps, 'size' | 'showLabels'>) {
  const [loadingStatus, setLoadingStatus] = useState<AttendanceStatus | null>(null);

  const handleClick = useCallback(
    async (status: AttendanceStatus) => {
      if (disabled || loadingStatus) return;
      setLoadingStatus(status);
      try {
        await onStatusChange(status);
      } finally {
        setLoadingStatus(null);
      }
    },
    [disabled, loadingStatus, onStatusChange]
  );

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-stone-200 bg-white overflow-hidden divide-x divide-stone-200',
        className
      )}
      role="group"
      aria-label="Attendance status options"
    >
      {actionConfigs.map((action) => {
        const Icon = action.icon;
        const isActive = currentStatus === action.status;
        const isLoading = loadingStatus === action.status;

        return (
          <button
            key={action.status}
            type="button"
            onClick={() => handleClick(action.status)}
            disabled={disabled || !!loadingStatus}
            title={action.label}
            aria-pressed={isActive}
            aria-label={action.label}
            className={cn(
              'p-1.5 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isActive
                ? cn(action.activeColor.replace('ring-', 'ring-0 '))
                : 'hover:bg-stone-50'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-stone-400" aria-hidden="true" />
            ) : (
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors duration-200',
                  isActive ? action.activeIconColor : 'text-stone-400 hover:text-stone-600'
                )}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
