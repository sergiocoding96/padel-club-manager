'use client';

import { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { AttendanceStatusBadge, AttendanceStatusDot } from './AttendanceStatusBadge';
import { AttendanceQuickActions, AttendanceQuickActionsCompact } from './AttendanceQuickActions';
import type { AttendanceStatus, Player, AttendanceStats } from '@/types/database';

interface AttendancePlayerRowProps {
  player: Player;
  currentStatus: AttendanceStatus;
  onStatusChange: (playerId: string, status: AttendanceStatus) => void | Promise<void>;
  notes?: string;
  onNotesChange?: (playerId: string, notes: string) => void;
  stats?: Partial<AttendanceStats>;
  lastAttendance?: {
    date: string;
    status: AttendanceStatus;
  };
  disabled?: boolean;
  compact?: boolean;
  showStats?: boolean;
  showNotes?: boolean;
  className?: string;
}

export const AttendancePlayerRow = memo(function AttendancePlayerRow({
  player,
  currentStatus,
  onStatusChange,
  notes = '',
  onNotesChange,
  stats,
  lastAttendance,
  disabled = false,
  compact = false,
  showStats = false,
  showNotes = true,
  className,
}: AttendancePlayerRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes);
  const [isSaving, setIsSaving] = useState(false);

  const handleStatusChange = useCallback(
    async (status: AttendanceStatus) => {
      setIsSaving(true);
      try {
        await onStatusChange(player.id, status);
      } finally {
        setIsSaving(false);
      }
    },
    [onStatusChange, player.id]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setLocalNotes(value);
      onNotesChange?.(player.id, value);
    },
    [onNotesChange, player.id]
  );

  const levelLabel = player.level_category || (player.level_numeric ? `Level ${player.level_numeric}` : null);

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between p-2 rounded-lg transition-colors',
          'hover:bg-stone-50',
          isSaving && 'opacity-70',
          className
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Avatar name={player.name} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-900 truncate">{player.name}</p>
          </div>
        </div>
        <AttendanceQuickActionsCompact
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
          disabled={disabled || isSaving}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border border-stone-200 rounded-lg bg-white transition-all duration-200',
        'hover:border-stone-300 hover:shadow-sm',
        isExpanded && 'ring-2 ring-blue-100 border-blue-300',
        isSaving && 'opacity-70',
        className
      )}
    >
      {/* Main Row */}
      <div className="flex items-center gap-4 p-4">
        {/* Player Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative">
            <Avatar name={player.name} size="md" />
            {/* Status dot overlay */}
            <div className="absolute -bottom-0.5 -right-0.5">
              <AttendanceStatusDot status={currentStatus} size="sm" pulse={currentStatus === 'pending'} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-stone-900 truncate">{player.name}</p>
              {levelLabel && (
                <span className="flex-shrink-0 text-xs px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded">
                  {levelLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {player.email && (
                <p className="text-xs text-stone-500 truncate">{player.email}</p>
              )}
              {showStats && stats?.attendance_rate !== undefined && (
                <div className="flex items-center gap-1 text-xs">
                  <span
                    className={cn(
                      'font-medium',
                      stats.attendance_rate >= 80
                        ? 'text-green-600'
                        : stats.attendance_rate >= 60
                        ? 'text-amber-600'
                        : 'text-red-600'
                    )}
                  >
                    {stats.attendance_rate}%
                  </span>
                  {stats.streak && stats.streak > 2 && (
                    <span className="text-green-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      {stats.streak}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Status Badge */}
        <div className="flex-shrink-0 hidden sm:block">
          <AttendanceStatusBadge status={currentStatus} size="sm" pulse={currentStatus === 'pending'} />
        </div>

        {/* Quick Actions */}
        <div className="flex-shrink-0">
          <AttendanceQuickActions
            currentStatus={currentStatus}
            onStatusChange={handleStatusChange}
            disabled={disabled || isSaving}
            size="sm"
          />
        </div>

        {/* Expand Button */}
        {showNotes && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'flex-shrink-0 p-1.5 rounded-lg transition-colors',
              'text-stone-400 hover:text-stone-600 hover:bg-stone-100',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              isExpanded && 'bg-stone-100 text-stone-600',
              localNotes && 'text-blue-500'
            )}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse notes' : 'Expand notes'}
          >
            {localNotes ? (
              <MessageSquare className="w-4 h-4" />
            ) : isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Section */}
      {isExpanded && showNotes && (
        <div className="px-4 pb-4 pt-0 border-t border-stone-100">
          <div className="pt-3">
            <label htmlFor={`notes-${player.id}`} className="block text-xs font-medium text-stone-600 mb-1">
              Notes
            </label>
            <textarea
              id={`notes-${player.id}`}
              value={localNotes}
              onChange={handleNotesChange}
              placeholder="Add a note about this attendance..."
              rows={2}
              className={cn(
                'w-full px-3 py-2 text-sm border border-stone-200 rounded-lg',
                'placeholder:text-stone-400 resize-none',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'transition-colors duration-200'
              )}
            />
          </div>
          {lastAttendance && (
            <div className="mt-2 text-xs text-stone-500">
              Last attendance: {lastAttendance.date} -{' '}
              <span
                className={cn(
                  lastAttendance.status === 'present' && 'text-green-600',
                  lastAttendance.status === 'late' && 'text-amber-600',
                  lastAttendance.status === 'absent' && 'text-red-600',
                  lastAttendance.status === 'excused' && 'text-blue-600'
                )}
              >
                {lastAttendance.status}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Skeleton loader for player row
export function AttendancePlayerRowSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-between p-2 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-200 rounded-full" />
          <div className="w-24 h-4 bg-stone-200 rounded" />
        </div>
        <div className="w-20 h-6 bg-stone-200 rounded" />
      </div>
    );
  }

  return (
    <div className="border border-stone-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-stone-200 rounded-full" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-stone-200 rounded" />
            <div className="w-24 h-3 bg-stone-200 rounded" />
          </div>
        </div>
        <div className="w-20 h-6 bg-stone-200 rounded-full" />
        <div className="flex gap-1">
          <div className="w-8 h-8 bg-stone-200 rounded-lg" />
          <div className="w-8 h-8 bg-stone-200 rounded-lg" />
          <div className="w-8 h-8 bg-stone-200 rounded-lg" />
          <div className="w-8 h-8 bg-stone-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
