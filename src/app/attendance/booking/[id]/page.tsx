'use client';

import { useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn, formatDate, formatTime } from '@/lib/utils';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  User,
  Save,
  CheckCircle2,
  Printer,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui';
import {
  AttendancePlayerRow,
  AttendanceStatusBadge,
} from '@/components/attendance';
import type {
  AttendanceStatus,
  BookingWithRelations,
  AttendanceWithPlayer,
  Player,
} from '@/types/database';

// Mock data - will be replaced with actual data fetching
const getMockBooking = (id: string): BookingWithRelations & { attendances: AttendanceWithPlayer[] } => ({
  id,
  court_id: 'court-1',
  date: new Date().toISOString().split('T')[0],
  start_time: '09:00',
  end_time: '10:30',
  booking_type: 'group_class',
  group_id: 'group-1',
  player_id: null,
  coach_id: 'coach-1',
  is_recurring: true,
  recurring_pattern: null,
  notes: 'Focus on volleys and net play',
  status: 'confirmed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  court: {
    id: 'court-1',
    name: 'Court 1',
    surface_type: 'indoor',
    location: 'Main Building',
    status: 'available',
    created_at: '',
    updated_at: '',
  },
  group: {
    id: 'group-1',
    name: 'Beginners A',
    level_min: 1,
    level_max: 2,
    coach_id: 'coach-1',
    max_players: 4,
    schedule_template: null,
    status: 'active',
    created_at: '',
    updated_at: '',
  },
  player: null,
  coach: {
    id: 'coach-1',
    name: 'Carlos García',
    email: 'carlos@example.com',
    phone: '+34 612 345 678',
    role: 'coach',
    color_code: '#3B82F6',
    status: 'active',
    created_at: '',
    updated_at: '',
  },
  attendances: [
    {
      id: 'a1',
      booking_id: id,
      player_id: 'p1',
      status: 'present',
      marked_by: 'coach-1',
      marked_at: new Date().toISOString(),
      notes: null,
      check_in_method: 'coach',
      check_in_time: null,
      created_at: '',
      updated_at: '',
      player: {
        id: 'p1',
        name: 'Ana López',
        email: 'ana@example.com',
        phone: '+34 611 111 111',
        level_numeric: 2,
        level_category: 'Beginner+',
        status: 'active',
        notes: null,
        objectives: 'Improve serve',
        created_at: '',
        updated_at: '',
      },
    },
    {
      id: 'a2',
      booking_id: id,
      player_id: 'p2',
      status: 'late',
      marked_by: 'coach-1',
      marked_at: new Date().toISOString(),
      notes: 'Arrived 10 minutes late',
      check_in_method: 'coach',
      check_in_time: null,
      created_at: '',
      updated_at: '',
      player: {
        id: 'p2',
        name: 'Miguel Torres',
        email: 'miguel@example.com',
        phone: '+34 622 222 222',
        level_numeric: 1.5,
        level_category: 'Beginner',
        status: 'active',
        notes: null,
        objectives: null,
        created_at: '',
        updated_at: '',
      },
    },
    {
      id: 'a3',
      booking_id: id,
      player_id: 'p3',
      status: 'pending',
      marked_by: null,
      marked_at: null,
      notes: null,
      check_in_method: null,
      check_in_time: null,
      created_at: '',
      updated_at: '',
      player: {
        id: 'p3',
        name: 'Laura Martín',
        email: 'laura@example.com',
        phone: '+34 633 333 333',
        level_numeric: 2,
        level_category: 'Beginner+',
        status: 'active',
        notes: 'Prefers morning sessions',
        objectives: 'Learn basic strategy',
        created_at: '',
        updated_at: '',
      },
    },
    {
      id: 'a4',
      booking_id: id,
      player_id: 'p4',
      status: 'pending',
      marked_by: null,
      marked_at: null,
      notes: null,
      check_in_method: null,
      check_in_time: null,
      created_at: '',
      updated_at: '',
      player: {
        id: 'p4',
        name: 'David Ruiz',
        email: 'david@example.com',
        phone: '+34 644 444 444',
        level_numeric: 1,
        level_category: 'Beginner',
        status: 'active',
        notes: null,
        objectives: 'Get started with padel',
        created_at: '',
        updated_at: '',
      },
    },
  ],
});

interface AttendanceState {
  [playerId: string]: {
    status: AttendanceStatus;
    notes: string;
    originalStatus: AttendanceStatus;
  };
}

export default function MarkAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('attendance');
  const tCommon = useTranslations('common');

  const bookingId = params.id as string;
  const booking = getMockBooking(bookingId);

  // Initialize attendance state
  const [attendanceState, setAttendanceState] = useState<AttendanceState>(() => {
    const initial: AttendanceState = {};
    booking.attendances.forEach((a) => {
      initial[a.player_id] = {
        status: a.status,
        notes: a.notes || '',
        originalStatus: a.status,
      };
    });
    return initial;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Calculate if there are unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return Object.entries(attendanceState).some(
      ([_, state]) => state.status !== state.originalStatus || state.notes !== ''
    );
  }, [attendanceState]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = booking.attendances.length;
    const present = Object.values(attendanceState).filter((s) => s.status === 'present').length;
    const late = Object.values(attendanceState).filter((s) => s.status === 'late').length;
    const absent = Object.values(attendanceState).filter((s) => s.status === 'absent').length;
    const excused = Object.values(attendanceState).filter((s) => s.status === 'excused').length;
    const pending = Object.values(attendanceState).filter((s) => s.status === 'pending').length;
    const marked = total - pending;

    return { total, present, late, absent, excused, pending, marked, progress: (marked / total) * 100 };
  }, [attendanceState, booking.attendances.length]);

  // Handle status change
  const handleStatusChange = useCallback((playerId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        status,
      },
    }));
  }, []);

  // Handle notes change
  const handleNotesChange = useCallback((playerId: string, notes: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        notes,
      },
    }));
  }, []);

  // Handle bulk actions
  const handleBulkAction = useCallback((status: AttendanceStatus) => {
    setAttendanceState((prev) => {
      const updated: AttendanceState = {};
      Object.entries(prev).forEach(([playerId, state]) => {
        updated[playerId] = { ...state, status };
      });
      return updated;
    });
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update original status to current status
      setAttendanceState((prev) => {
        const updated: AttendanceState = {};
        Object.entries(prev).forEach(([playerId, state]) => {
          updated[playerId] = { ...state, originalStatus: state.status };
        });
        return updated;
      });

      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  }, []);

  const timeDisplay = `${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}`;
  const dateDisplay = formatDate(booking.date, 'en');

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/attendance"
            className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            {tCommon('back')}
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">
            {booking.group?.name || booking.player?.name || 'Session'}
          </h1>
          <p className="text-stone-500 mt-1">
            {t('markAttendance')} - {dateDisplay}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="hidden sm:flex"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            {tCommon('print')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            loading={isSaving}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {t('actions.save')}
          </Button>
        </div>
      </div>

      {/* Session Details Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Time */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">Time</p>
              <p className="font-semibold text-stone-900">{timeDisplay}</p>
              <p className="text-sm text-stone-600">{dateDisplay}</p>
            </div>
          </div>

          {/* Court */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">Court</p>
              <p className="font-semibold text-stone-900">{booking.court?.name}</p>
              <p className="text-sm text-stone-600">{booking.court?.location}</p>
            </div>
          </div>

          {/* Coach */}
          {booking.coach && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Coach</p>
                <p className="font-semibold text-stone-900">{booking.coach.name}</p>
                <p className="text-sm text-stone-600">{booking.coach.email}</p>
              </div>
            </div>
          )}

          {/* Players */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-stone-500">Players</p>
              <p className="font-semibold text-stone-900">{stats.total} registered</p>
              <p className="text-sm text-stone-600">{stats.marked} marked</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <p className="text-sm text-stone-500 mb-1">Session Notes</p>
            <p className="text-stone-700">{booking.notes}</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">
            Progress: {stats.marked} of {stats.total} marked
          </span>
          {stats.pending === 0 ? (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              All Complete
            </span>
          ) : (
            <span className="text-amber-600 text-sm font-medium">
              {stats.pending} pending
            </span>
          )}
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-500 rounded-full',
              stats.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
            )}
            style={{ width: `${stats.progress}%` }}
          />
        </div>

        {/* Status breakdown */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
          <div className="flex items-center gap-1.5">
            <AttendanceStatusBadge status="present" size="sm" showLabel={false} />
            <span className="text-stone-600">{stats.present} present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AttendanceStatusBadge status="late" size="sm" showLabel={false} />
            <span className="text-stone-600">{stats.late} late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AttendanceStatusBadge status="absent" size="sm" showLabel={false} />
            <span className="text-stone-600">{stats.absent} absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AttendanceStatusBadge status="excused" size="sm" showLabel={false} />
            <span className="text-stone-600">{stats.excused} excused</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-stone-600">{t('actions.bulkActions')}:</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkAction('present')}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {t('actions.markAll')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleBulkAction('pending')}
            className="text-stone-600"
          >
            {t('actions.clearAll')}
          </Button>
        </div>
      </div>

      {/* Player List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-stone-900">
          {t('session.playersRegistered')} ({stats.total})
        </h2>

        <div className="space-y-2">
          {booking.attendances.map((attendance) => (
            <AttendancePlayerRow
              key={attendance.player_id}
              player={attendance.player}
              currentStatus={attendanceState[attendance.player_id]?.status || 'pending'}
              onStatusChange={handleStatusChange}
              notes={attendanceState[attendance.player_id]?.notes || ''}
              onNotesChange={handleNotesChange}
              disabled={isSaving}
              showStats={false}
            />
          ))}
        </div>
      </div>

      {/* Footer with Save Status */}
      <div className="sticky bottom-0 bg-white border-t border-stone-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-stone-500">
            {hasUnsavedChanges ? (
              <span className="text-amber-600 font-medium">• Unsaved changes</span>
            ) : lastSaved ? (
              <span className="text-green-600">
                ✓ Saved at {lastSaved.toLocaleTimeString()}
              </span>
            ) : (
              <span>No changes</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/attendance')}>
              {tCommon('cancel')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              loading={isSaving}
            >
              <Save className="w-4 h-4 mr-1.5" />
              {t('actions.save')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
