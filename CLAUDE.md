# Padel Club Manager - AI Development Guide

## Project Overview
Padel club management system for recreational clubs. Features: player profiles, court management, group scheduling, bookings, attendance, and payments.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl (Spanish + English)
- **Icons**: Lucide React

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature-specific components
├── lib/
│   ├── utils.ts        # Utility functions
│   └── supabase/       # Database client
├── types/              # TypeScript types
└── i18n/               # Internationalization
messages/               # Translation files (en.json, es.json)
supabase/
└── migrations/         # Database migrations
```

## Key Conventions

### Component Patterns
- Use 'use client' only when needed (useState, useEffect, event handlers)
- Server components by default
- UI components in `src/components/ui/`
- Feature components alongside their pages

### Styling
- Use `cn()` utility for conditional classes
- Primary brand color: blue-600
- Stone palette for neutral colors
- Consistent spacing: p-4, p-6 for containers

### i18n
- All user-facing text must use translations
- Access via `useTranslations('namespace')`
- Default locale: Spanish (es)
- Translation files in `/messages/`

### Database
- Use Supabase client from `@/lib/supabase/client`
- Types in `@/types/database.ts`
- Migrations in `supabase/migrations/`

## Player Level System
- Numeric: 1-7 scale
- Categories:
  - 1: Iniciación / Beginner
  - 2: Iniciación+ / Beginner+
  - 3: Intermedio Bajo / Low Intermediate
  - 4: Intermedio / Intermediate
  - 5: Intermedio Alto / High Intermediate
  - 6: Avanzado / Advanced
  - 7: Competición / Competition

## Git Workflow
- Main branch: `main`
- Feature branches: `feature/feature-name`
- Use git worktrees for parallel development
- Small, focused PRs

## Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run linter
```

## Feature Development Order
1. Player Profiles
2. Court Management
3. Group Management
4. Court Booking Calendar
5. Attendance System ← **CURRENT FOCUS**
6. Payment Tracking
7. Activities Hub
8. Player Zone
9. Feedback System
10. Promotions Module

---

## Attendance Feature - Development Guide

### Overview
The attendance system tracks player presence for bookings, group classes, and private lessons. It supports coach-marked attendance, player self check-in, absence tracking, and automated notifications.

### Database Schema (attendance table)
```sql
attendance (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  player_id UUID REFERENCES players(id),
  status VARCHAR(20): 'pending' | 'present' | 'absent' | 'late' | 'excused',
  marked_by UUID REFERENCES coaches(id),
  marked_at TIMESTAMPTZ,
  notes TEXT,
  check_in_method VARCHAR(20): 'coach' | 'self' | 'auto',
  created_at, updated_at TIMESTAMPTZ
)
-- UNIQUE constraint on (booking_id, player_id)
```

### Attendance Status System
| Status | Color | Description |
|--------|-------|-------------|
| pending | stone/gray | Not yet marked |
| present | green-500 | Player attended |
| late | amber-500 | Player arrived late |
| absent | red-500 | Player did not attend |
| excused | blue-500 | Absence was excused in advance |

### Component Naming Conventions
```
src/components/attendance/
├── AttendanceStatusBadge.tsx      # Status indicator badge
├── AttendanceCard.tsx              # Single booking attendance card
├── AttendancePlayerRow.tsx         # Row in attendance list
├── AttendanceQuickActions.tsx      # Quick mark buttons
├── AttendanceCalendarHeatmap.tsx   # Visual attendance calendar
├── AttendanceStatsWidget.tsx       # Statistics dashboard widget
├── AttendanceHistoryTable.tsx      # Player/group history
├── AttendanceBulkActions.tsx       # Bulk marking controls
├── AttendanceExportButton.tsx      # Export functionality
└── index.ts                        # Barrel exports
```

### Page Routes
```
/attendance                        # Attendance dashboard (today's overview)
/attendance/booking/[id]           # Mark attendance for specific booking
/attendance/calendar               # Calendar view with heatmap
/attendance/reports                # Attendance reports & analytics
/players/[id]/attendance           # Player attendance history
/groups/[id]/attendance            # Group attendance overview
```

### Translations Namespace
```json
{
  "attendance": {
    "title": "Attendance",
    "markAttendance": "Mark Attendance",
    "selfCheckIn": "Self Check-in",
    "status": {
      "pending": "Pending",
      "present": "Present",
      "late": "Late",
      "absent": "Absent",
      "excused": "Excused"
    },
    "stats": {
      "attendanceRate": "Attendance Rate",
      "totalSessions": "Total Sessions",
      "absences": "Absences"
    },
    "actions": {
      "markAll": "Mark All Present",
      "clearAll": "Clear All",
      "export": "Export Report"
    }
  }
}
```

### Key Utilities to Create
```typescript
// src/lib/attendance.ts
getAttendanceRate(playerId: string, dateRange?: DateRange): Promise<number>
getSessionsAttended(playerId: string): Promise<number>
getUpcomingAbsences(groupId: string): Promise<Attendance[]>
shouldAutoCancel(bookingId: string, threshold: number): Promise<boolean>
generateAttendanceReport(filters: AttendanceFilters): Promise<AttendanceReport>
```

### Testing Requirements
- Unit tests for all attendance utility functions
- Component tests for attendance UI components
- Integration tests for attendance API endpoints
- E2E tests for complete attendance marking flows
- Accessibility tests for all attendance UI

### Performance Considerations
- Paginate attendance history (max 50 records per page)
- Cache attendance rates for dashboard widgets
- Use optimistic UI updates for marking attendance
- Debounce bulk operations

### Security Rules
- Only coaches/admins can mark attendance for others
- Players can only self check-in for their own bookings
- Attendance records are immutable after 24 hours (admin override only)
- Audit log for all attendance modifications
