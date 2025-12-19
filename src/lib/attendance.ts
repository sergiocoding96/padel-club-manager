// Attendance Utilities
// Helper functions for attendance calculations, formatting, and exports

import type {
  Attendance,
  AttendanceStatus,
  AttendanceStats,
  AttendanceHeatmapData,
  AttendanceWithRelations,
  DateRange,
} from '@/types/database';

/**
 * Calculate attendance rate from a list of attendance records
 * Only considers non-pending records
 */
export function calculateAttendanceRate(attendances: Attendance[]): number {
  const completed = attendances.filter((a) => a.status !== 'pending');
  if (completed.length === 0) return 0;

  const attended = completed.filter(
    (a) => a.status === 'present' || a.status === 'late'
  ).length;

  return Math.round((attended / completed.length) * 100 * 100) / 100;
}

/**
 * Calculate full attendance statistics
 */
export function calculateAttendanceStats(attendances: Attendance[]): AttendanceStats {
  const total = attendances.length;
  const present = attendances.filter((a) => a.status === 'present').length;
  const late = attendances.filter((a) => a.status === 'late').length;
  const absent = attendances.filter((a) => a.status === 'absent').length;
  const excused = attendances.filter((a) => a.status === 'excused').length;
  const pending = attendances.filter((a) => a.status === 'pending').length;

  const completed = total - pending;
  const attended = present + late;
  const attendanceRate = completed > 0 ? (attended / completed) * 100 : 0;

  // Calculate streak (consecutive present/late from most recent)
  const sortedByDate = [...attendances]
    .filter((a) => a.status !== 'pending')
    .sort((a, b) => {
      const dateA = a.marked_at || a.created_at;
      const dateB = b.marked_at || b.created_at;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  let streak = 0;
  for (const attendance of sortedByDate) {
    if (attendance.status === 'present' || attendance.status === 'late') {
      streak++;
    } else {
      break;
    }
  }

  return {
    total_sessions: total,
    attended,
    absent,
    late,
    excused,
    pending,
    attendance_rate: Math.round(attendanceRate * 100) / 100,
    streak,
  };
}

/**
 * Generate heatmap data for attendance calendar
 */
export function generateHeatmapData(
  attendances: AttendanceWithRelations[],
  dateRange?: DateRange
): AttendanceHeatmapData[] {
  // Group attendances by date
  const byDate = new Map<string, Attendance[]>();

  for (const attendance of attendances) {
    const date = attendance.booking.date;
    if (dateRange) {
      if (date < dateRange.start || date > dateRange.end) continue;
    }

    if (!byDate.has(date)) {
      byDate.set(date, []);
    }
    byDate.get(date)!.push(attendance);
  }

  // Calculate rate and level for each date
  const result: AttendanceHeatmapData[] = [];

  byDate.forEach((records, date) => {
    const rate = calculateAttendanceRate(records);
    const count = records.filter((r) => r.status !== 'pending').length;

    // Determine level based on rate
    let level: 0 | 1 | 2 | 3 | 4;
    if (count === 0) {
      level = 0;
    } else if (rate < 50) {
      level = 1;
    } else if (rate < 75) {
      level = 2;
    } else if (rate < 90) {
      level = 3;
    } else {
      level = 4;
    }

    result.push({ date, count, rate, level });
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get status color classes for Tailwind
 */
export function getStatusColors(status: AttendanceStatus): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<AttendanceStatus, { bg: string; text: string; border: string }> = {
    pending: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
    present: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    late: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
    absent: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    excused: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  };
  return colors[status];
}

/**
 * Format attendance data for CSV export
 */
export function formatAttendanceForCSV(
  attendances: AttendanceWithRelations[],
  columns: string[] = ['date', 'player', 'status', 'session', 'court', 'coach', 'notes']
): string {
  const headers = columns.map((col) => {
    const headerMap: Record<string, string> = {
      date: 'Date',
      player: 'Player',
      status: 'Status',
      session: 'Session',
      court: 'Court',
      coach: 'Coach',
      notes: 'Notes',
      time: 'Time',
      group: 'Group',
      marked_at: 'Marked At',
      check_in_method: 'Check-in Method',
    };
    return headerMap[col] || col;
  });

  const rows = attendances.map((a) => {
    return columns.map((col) => {
      switch (col) {
        case 'date':
          return a.booking.date;
        case 'player':
          return a.player.name;
        case 'status':
          return a.status;
        case 'session':
          return a.booking.group?.name || 'Private';
        case 'court':
          return a.booking.court?.name || '';
        case 'coach':
          return a.booking.coach?.name || '';
        case 'notes':
          return (a.notes || '').replace(/"/g, '""');
        case 'time':
          return `${a.booking.start_time}-${a.booking.end_time}`;
        case 'group':
          return a.booking.group?.name || '';
        case 'marked_at':
          return a.marked_at || '';
        case 'check_in_method':
          return a.check_in_method || '';
        default:
          return '';
      }
    });
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Download data as CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Check if a player can self check-in
 * Based on time window before/after session start
 */
export function canSelfCheckIn(
  sessionDate: string,
  sessionStartTime: string,
  windowBeforeMinutes: number = 30,
  windowAfterMinutes: number = 15
): { canCheckIn: boolean; reason?: string; minutesUntilOpen?: number; minutesUntilClose?: number } {
  const now = new Date();
  const sessionDateTime = new Date(`${sessionDate}T${sessionStartTime}`);

  const windowStart = new Date(sessionDateTime.getTime() - windowBeforeMinutes * 60 * 1000);
  const windowEnd = new Date(sessionDateTime.getTime() + windowAfterMinutes * 60 * 1000);

  if (now < windowStart) {
    const minutesUntilOpen = Math.ceil((windowStart.getTime() - now.getTime()) / 60000);
    return {
      canCheckIn: false,
      reason: 'Check-in window not yet open',
      minutesUntilOpen,
    };
  }

  if (now > windowEnd) {
    return {
      canCheckIn: false,
      reason: 'Check-in window has expired',
    };
  }

  const minutesUntilClose = Math.ceil((windowEnd.getTime() - now.getTime()) / 60000);
  return {
    canCheckIn: true,
    minutesUntilClose,
  };
}

/**
 * Determine if a booking should be auto-cancelled due to low attendance
 */
export function shouldAutoCancel(
  attendances: Attendance[],
  threshold: number = 2
): boolean {
  const confirmedCount = attendances.filter(
    (a) => a.status === 'present' || a.status === 'pending'
  ).length;

  return confirmedCount < threshold;
}

/**
 * Analyze absence patterns for a player
 * Returns day-of-week breakdown
 */
export function analyzeAbsencePattern(
  attendances: AttendanceWithRelations[]
): Record<number, { total: number; absent: number; rate: number }> {
  const byDayOfWeek: Record<number, { total: number; absent: number }> = {
    0: { total: 0, absent: 0 }, // Sunday
    1: { total: 0, absent: 0 },
    2: { total: 0, absent: 0 },
    3: { total: 0, absent: 0 },
    4: { total: 0, absent: 0 },
    5: { total: 0, absent: 0 },
    6: { total: 0, absent: 0 }, // Saturday
  };

  for (const attendance of attendances) {
    if (attendance.status === 'pending') continue;

    const date = new Date(attendance.booking.date);
    const dayOfWeek = date.getDay();

    byDayOfWeek[dayOfWeek].total++;
    if (attendance.status === 'absent') {
      byDayOfWeek[dayOfWeek].absent++;
    }
  }

  const result: Record<number, { total: number; absent: number; rate: number }> = {};

  for (const [day, data] of Object.entries(byDayOfWeek)) {
    result[Number(day)] = {
      ...data,
      rate: data.total > 0 ? Math.round((data.absent / data.total) * 100) : 0,
    };
  }

  return result;
}

/**
 * Get localized day name
 */
export function getDayName(dayOfWeek: number, locale: string = 'en'): string {
  const days = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  };

  return (days[locale as keyof typeof days] || days.en)[dayOfWeek];
}

/**
 * Format duration between two times
 */
export function formatSessionDuration(startTime: string, endTime: string): string {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const duration = endMinutes - startMinutes;

  if (duration < 60) {
    return `${duration} min`;
  }

  const hours = Math.floor(duration / 60);
  const mins = duration % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}
