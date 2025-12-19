'use client';

import { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { AttendancePlayerRow, AttendancePlayerRowSkeleton } from './AttendancePlayerRow';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import type {
  AttendanceStatus,
  BookingWithRelations,
  AttendanceWithPlayer,
  Player,
} from '@/types/database';
import { formatTime, formatDate } from '@/lib/utils';

interface AttendanceCardProps {
  booking: BookingWithRelations;
  attendances: AttendanceWithPlayer[];
  onStatusChange: (playerId: string, status: AttendanceStatus) => void | Promise<void>;
  onNotesChange?: (playerId: string, notes: string) => void;
  onBulkAction?: (status: AttendanceStatus) => void | Promise<void>;
  onSave?: () => void | Promise<void>;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  defaultExpanded?: boolean;
  locale?: string;
  className?: string;
}

export function AttendanceCard({
  booking,
  attendances,
  onStatusChange,
  onNotesChange,
  onBulkAction,
  onSave,
  isSaving = false,
  hasUnsavedChanges = false,
  defaultExpanded = true,
  locale = 'en',
  className,
}: AttendanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [bulkLoading, setBulkLoading] = useState<AttendanceStatus | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    const total = attendances.length;
    const present = attendances.filter((a) => a.status === 'present').length;
    const late = attendances.filter((a) => a.status === 'late').length;
    const absent = attendances.filter((a) => a.status === 'absent').length;
    const excused = attendances.filter((a) => a.status === 'excused').length;
    const pending = attendances.filter((a) => a.status === 'pending').length;
    const marked = total - pending;

    return {
      total,
      present,
      late,
      absent,
      excused,
      pending,
      marked,
      progress: total > 0 ? (marked / total) * 100 : 0,
      isComplete: pending === 0,
      attendanceRate: marked > 0 ? ((present + late) / marked) * 100 : 0,
    };
  }, [attendances]);

  // Determine card status color
  const cardStatusColor = useMemo(() => {
    if (stats.isComplete) {
      if (stats.attendanceRate >= 80) return 'border-l-green-500';
      if (stats.attendanceRate >= 50) return 'border-l-amber-500';
      return 'border-l-red-500';
    }
    return 'border-l-stone-300';
  }, [stats]);

  const handleBulkAction = useCallback(
    async (status: AttendanceStatus) => {
      if (!onBulkAction || bulkLoading) return;
      setBulkLoading(status);
      try {
        await onBulkAction(status);
      } finally {
        setBulkLoading(null);
      }
    },
    [onBulkAction, bulkLoading]
  );

  const handlePlayerStatusChange = useCallback(
    async (playerId: string, status: AttendanceStatus) => {
      await onStatusChange(playerId, status);
    },
    [onStatusChange]
  );

  // Format booking time
  const timeDisplay = `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`;
  const dateDisplay = formatDate(booking.date, locale);

  return (
    <div
      className={cn(
        'border border-stone-200 rounded-xl bg-white shadow-sm overflow-hidden',
        'border-l-4 transition-all duration-200',
        cardStatusColor,
        isExpanded && 'shadow-md',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'p-4 cursor-pointer transition-colors',
          'hover:bg-stone-50',
          isExpanded && 'border-b border-stone-100'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Left: Session Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-stone-900 truncate">
                {booking.group?.name || 'Session'}
              </h3>
              {booking.booking_type === 'group_class' && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  Group Class
                </span>
              )}
              {booking.booking_type === 'private_lesson' && (
                <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                  Private
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {dateDisplay} • {timeDisplay}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {booking.court?.name || 'Court'}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {stats.total} players
              </span>
            </div>
            {booking.coach && (
              <p className="mt-1 text-sm text-stone-500">
                Coach: <span className="font-medium text-stone-700">{booking.coach.name}</span>
              </p>
            )}
          </div>

          {/* Right: Stats & Toggle */}
          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2">
              {stats.isComplete ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Complete</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-500 rounded-full',
                        stats.progress === 100
                          ? 'bg-green-500'
                          : stats.progress > 50
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      )}
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-stone-500">
                    {stats.marked}/{stats.total}
                  </span>
                </div>
              )}
            </div>

            {/* Pending badge */}
            {stats.pending > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                <AlertCircle className="w-3 h-3" />
                {stats.pending} pending
              </span>
            )}

            {/* Expand/collapse icon */}
            <div className="text-stone-400">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="sm:hidden mt-3">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Progress</span>
            <span>
              {stats.marked}/{stats.total} marked
            </span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500 rounded-full',
                stats.progress === 100
                  ? 'bg-green-500'
                  : stats.progress > 50
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              )}
              style={{ width: `${stats.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Bulk Actions */}
          {onBulkAction && (
            <div className="px-4 py-3 bg-stone-50 border-b border-stone-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-stone-600 mr-2">Quick actions:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('present')}
                  disabled={bulkLoading !== null}
                  loading={bulkLoading === 'present'}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  {bulkLoading !== 'present' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                  Mark All Present
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBulkAction('pending')}
                  disabled={bulkLoading !== null}
                  loading={bulkLoading === 'pending'}
                  className="text-stone-600"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {/* Player List */}
          <div className="p-4 space-y-2">
            {attendances.length === 0 ? (
              <div className="py-8 text-center text-stone-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No players registered for this session</p>
              </div>
            ) : (
              attendances.map((attendance) => (
                <AttendancePlayerRow
                  key={attendance.player_id}
                  player={attendance.player}
                  currentStatus={attendance.status}
                  onStatusChange={handlePlayerStatusChange}
                  notes={attendance.notes || ''}
                  onNotesChange={onNotesChange}
                  disabled={isSaving}
                />
              ))
            )}
          </div>

          {/* Footer with Save */}
          {onSave && (
            <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <div className="text-sm text-stone-500">
                {hasUnsavedChanges ? (
                  <span className="text-amber-600">• Unsaved changes</span>
                ) : (
                  <span className="text-green-600">✓ All changes saved</span>
                )}
              </div>
              <Button
                onClick={onSave}
                disabled={!hasUnsavedChanges || isSaving}
                loading={isSaving}
              >
                Save Attendance
              </Button>
            </div>
          )}

          {/* Stats Summary */}
          <div className="px-4 py-3 bg-stone-50/50 border-t border-stone-100">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <AttendanceStatusBadge status="present" size="sm" showLabel={false} />
                <span className="text-stone-600">
                  {stats.present} present
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <AttendanceStatusBadge status="late" size="sm" showLabel={false} />
                <span className="text-stone-600">
                  {stats.late} late
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <AttendanceStatusBadge status="absent" size="sm" showLabel={false} />
                <span className="text-stone-600">
                  {stats.absent} absent
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <AttendanceStatusBadge status="excused" size="sm" showLabel={false} />
                <span className="text-stone-600">
                  {stats.excused} excused
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Skeleton loader for the card
export function AttendanceCardSkeleton() {
  return (
    <div className="border border-stone-200 rounded-xl bg-white shadow-sm overflow-hidden border-l-4 border-l-stone-300 animate-pulse">
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="h-5 w-32 bg-stone-200 rounded mb-2" />
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-stone-200 rounded" />
              <div className="h-4 w-20 bg-stone-200 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-2 bg-stone-200 rounded-full" />
            <div className="w-5 h-5 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-stone-100 space-y-2">
        <AttendancePlayerRowSkeleton />
        <AttendancePlayerRowSkeleton />
        <AttendancePlayerRowSkeleton />
      </div>
    </div>
  );
}
