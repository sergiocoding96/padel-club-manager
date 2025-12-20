'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { cn, formatTime, formatDate } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  User,
  Loader2,
  PartyPopper,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { AttendanceStatusBadge } from '@/components/attendance';
import { canSelfCheckIn } from '@/lib/attendance';
import type { BookingWithRelations, AttendanceStatus } from '@/types/database';

// Mock data for player's upcoming sessions
const mockPlayerSessions: Array<{
  booking: BookingWithRelations;
  attendanceStatus: AttendanceStatus;
  canCheckIn: boolean;
  minutesUntilOpen?: number;
  minutesUntilClose?: number;
}> = [
  {
    booking: {
      id: '1',
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
      notes: null,
      status: 'confirmed',
      created_at: '',
      updated_at: '',
      court: { id: 'court-1', name: 'Court 1', surface_type: 'indoor', location: 'Main Building', status: 'available', created_at: '', updated_at: '' },
      group: { id: 'group-1', name: 'Beginners A', level_min: 1, level_max: 2, coach_id: 'coach-1', max_players: 4, schedule_template: null, status: 'active', created_at: '', updated_at: '' },
      player: null,
      coach: { id: 'coach-1', name: 'Carlos García', email: 'carlos@example.com', phone: null, role: 'coach', color_code: '#3B82F6', status: 'active', created_at: '', updated_at: '' },
    },
    attendanceStatus: 'pending',
    canCheckIn: true,
    minutesUntilClose: 45,
  },
  {
    booking: {
      id: '2',
      court_id: 'court-2',
      date: new Date().toISOString().split('T')[0],
      start_time: '17:00',
      end_time: '18:30',
      booking_type: 'group_class',
      group_id: 'group-2',
      player_id: null,
      coach_id: 'coach-1',
      is_recurring: true,
      recurring_pattern: null,
      notes: null,
      status: 'confirmed',
      created_at: '',
      updated_at: '',
      court: { id: 'court-2', name: 'Court 2', surface_type: 'outdoor', location: 'Outdoor Area', status: 'available', created_at: '', updated_at: '' },
      group: { id: 'group-2', name: 'Intermediate B', level_min: 3, level_max: 4, coach_id: 'coach-1', max_players: 4, schedule_template: null, status: 'active', created_at: '', updated_at: '' },
      player: null,
      coach: { id: 'coach-1', name: 'Carlos García', email: 'carlos@example.com', phone: null, role: 'coach', color_code: '#3B82F6', status: 'active', created_at: '', updated_at: '' },
    },
    attendanceStatus: 'pending',
    canCheckIn: false,
    minutesUntilOpen: 120,
  },
];

export default function SelfCheckInPage() {
  const t = useTranslations('attendance');
  const tCommon = useTranslations('common');

  const [sessions, setSessions] = useState(mockPlayerSessions);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [justCheckedIn, setJustCheckedIn] = useState<string | null>(null);

  const handleCheckIn = async (bookingId: string) => {
    setCheckingIn(bookingId);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update session status
    setSessions((prev) =>
      prev.map((s) =>
        s.booking.id === bookingId
          ? { ...s, attendanceStatus: 'present' as AttendanceStatus, canCheckIn: false }
          : s
      )
    );

    setCheckingIn(null);
    setJustCheckedIn(bookingId);

    // Clear celebration after 3 seconds
    setTimeout(() => setJustCheckedIn(null), 3000);
  };

  const availableSessions = sessions.filter((s) => s.canCheckIn && s.attendanceStatus === 'pending');
  const upcomingSessions = sessions.filter((s) => !s.canCheckIn && s.attendanceStatus === 'pending');
  const checkedInSessions = sessions.filter((s) => s.attendanceStatus === 'present');

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900">{t('selfCheckIn')}</h1>
        <p className="text-stone-500 mt-2">
          Check in to your upcoming sessions
        </p>
      </div>

      {/* Celebration Toast */}
      {justCheckedIn && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <PartyPopper className="w-5 h-5" />
            <span className="font-medium">{t('notifications.checkInSuccessful')}</span>
          </div>
        </div>
      )}

      {/* Available for Check-in */}
      {availableSessions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Ready to Check In
          </h2>
          <div className="space-y-4">
            {availableSessions.map((session) => (
              <CheckInCard
                key={session.booking.id}
                session={session}
                onCheckIn={handleCheckIn}
                isLoading={checkingIn === session.booking.id}
                justCheckedIn={justCheckedIn === session.booking.id}
              />
            ))}
          </div>
        </section>
      )}

      {/* Already Checked In */}
      {checkedInSessions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Checked In
          </h2>
          <div className="space-y-3">
            {checkedInSessions.map((session) => (
              <div
                key={session.booking.id}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-900">
                      {session.booking.group?.name}
                    </p>
                    <p className="text-sm text-green-700">
                      {formatTime(session.booking.start_time)} - {session.booking.court?.name}
                    </p>
                  </div>
                  <AttendanceStatusBadge status="present" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-400" />
            Upcoming Sessions
          </h2>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.booking.id}
                className="bg-stone-50 border border-stone-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-stone-900">
                      {session.booking.group?.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(session.booking.start_time)} - {formatTime(session.booking.end_time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {session.booking.court?.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-stone-500">
                      {t('checkInWindow.opensIn')}
                    </span>
                    <p className="text-lg font-semibold text-stone-700">
                      {session.minutesUntilOpen} {t('checkInWindow.minutes')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No Sessions */}
      {sessions.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">
            No upcoming sessions
          </h3>
          <p className="text-stone-500">
            You don&apos;t have any sessions scheduled for today
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How self check-in works</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Check-in opens 30 minutes before your session</li>
              <li>• You can check in up to 15 minutes after the start time</li>
              <li>• Your coach will be notified of your arrival</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Check-in Card Component
function CheckInCard({
  session,
  onCheckIn,
  isLoading,
  justCheckedIn,
}: {
  session: typeof mockPlayerSessions[0];
  onCheckIn: (bookingId: string) => void;
  isLoading: boolean;
  justCheckedIn: boolean;
}) {
  const t = useTranslations('attendance');

  return (
    <div
      className={cn(
        'bg-white border-2 rounded-xl p-5 transition-all duration-300',
        justCheckedIn
          ? 'border-green-500 bg-green-50 scale-[1.02]'
          : 'border-blue-200 hover:border-blue-400 hover:shadow-md'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-stone-900">
            {session.booking.group?.name}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-stone-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(session.booking.date, 'en')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(session.booking.start_time)} - {formatTime(session.booking.end_time)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {session.booking.court?.name}
            </span>
          </div>
          {session.booking.coach && (
            <p className="mt-2 text-sm text-stone-600">
              Coach: <span className="font-medium">{session.booking.coach.name}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {session.minutesUntilClose && (
            <span className="text-xs text-amber-600 font-medium">
              {t('checkInWindow.closesIn')} {session.minutesUntilClose} {t('checkInWindow.minutes')}
            </span>
          )}
          <Button
            size="lg"
            onClick={() => onCheckIn(session.booking.id)}
            disabled={isLoading}
            className={cn(
              'min-w-[140px] transition-all duration-300',
              justCheckedIn && 'bg-green-500 hover:bg-green-600'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Checking in...
              </>
            ) : justCheckedIn ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Done!
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {t('imHere')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
