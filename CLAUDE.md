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
5. Attendance System
6. Payment Tracking
7. Activities Hub
8. Player Zone
9. Feedback System
10. Promotions Module

---

## Court Booking Feature - Development Guide

### Overview
The Court Booking Calendar is the central feature for managing court reservations. It provides a visual weekly calendar with court columns and time rows, supporting three booking types: rentals, group classes, and private lessons.

### UI/UX Design Goals
- **Visual Clarity**: Color-coded booking types with clear time boundaries
- **Intuitive Interaction**: Click-to-book, drag-to-resize, double-click to edit
- **Responsive Design**: Works on desktop (full calendar) and mobile (single-day view)
- **Real-time Feedback**: Immediate conflict detection and visual indicators
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support

### Component Architecture
```
src/
├── app/
│   ├── bookings/
│   │   ├── page.tsx              # Main calendar page (server component)
│   │   └── loading.tsx           # Loading skeleton
│   └── courts/
│       ├── page.tsx              # Court management page
│       └── loading.tsx           # Loading skeleton
├── components/
│   ├── bookings/
│   │   ├── BookingCalendar.tsx   # Main calendar container
│   │   ├── CalendarHeader.tsx    # Week navigation + view controls
│   │   ├── CalendarGrid.tsx      # Time slots grid with court columns
│   │   ├── TimeColumn.tsx        # Left time axis (7:00 - 22:00)
│   │   ├── CourtColumn.tsx       # Single court day column
│   │   ├── BookingSlot.tsx       # Individual booking block
│   │   ├── BookingForm.tsx       # Create/edit booking modal
│   │   ├── BookingDetails.tsx    # Booking detail view
│   │   ├── RecurringForm.tsx     # Recurring pattern configuration
│   │   ├── ConflictIndicator.tsx # Visual conflict warning
│   │   ├── TimeSlotPicker.tsx    # Time range selection
│   │   └── BookingFilters.tsx    # Filter by type, court, coach
│   ├── courts/
│   │   ├── CourtList.tsx         # Court management list
│   │   ├── CourtCard.tsx         # Individual court display
│   │   └── CourtForm.tsx         # Create/edit court modal
│   └── ui/
│       ├── calendar/
│       │   ├── WeekView.tsx      # Week calendar wrapper
│       │   ├── DayView.tsx       # Single day mobile view
│       │   └── DatePicker.tsx    # Date selection component
│       └── ... (existing components)
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   └── actions/
│       ├── bookings.ts           # Booking server actions
│       └── courts.ts             # Court server actions
└── types/
    ├── database.ts               # Supabase generated types
    └── bookings.ts               # Booking-specific types
```

### Color Coding System
```typescript
// Booking type colors
const BOOKING_COLORS = {
  rental: {
    bg: 'bg-emerald-100',
    border: 'border-emerald-400',
    text: 'text-emerald-800',
    accent: 'bg-emerald-500'
  },
  group_class: {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-800',
    accent: 'bg-purple-500'
  },
  private_lesson: {
    bg: 'bg-amber-100',
    border: 'border-amber-400',
    text: 'text-amber-800',
    accent: 'bg-amber-500'
  }
}

// Status colors
const STATUS_COLORS = {
  pending: 'border-dashed opacity-70',
  confirmed: 'border-solid',
  cancelled: 'opacity-40 line-through'
}
```

### Key Interactions
1. **Click empty slot** → Opens booking form with pre-filled time/court
2. **Click existing booking** → Opens booking details panel
3. **Double-click booking** → Opens edit form
4. **Drag booking edge** → Resize duration (with conflict check)
5. **Drag booking body** → Move to different slot (with conflict check)
6. **Right-click booking** → Context menu (edit, duplicate, cancel, delete)

### Recurring Booking Patterns (JSONB)
```typescript
interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  daysOfWeek?: number[]  // 0-6 for weekly patterns
  endDate?: string       // ISO date
  occurrences?: number   // Max occurrences
  exceptions?: string[]  // Skip dates
}
```

### Conflict Detection Rules
1. No overlapping bookings on same court
2. Coach cannot have overlapping sessions
3. Group cannot have overlapping sessions
4. Player cannot be in two places at once (warning only)

### Testing Strategy
- **Unit Tests**: Utility functions (time calculations, conflict detection)
- **Component Tests**: Calendar rendering, interaction handlers
- **Integration Tests**: Booking CRUD operations
- **E2E Tests**: Full booking flow (Playwright recommended)

### Performance Considerations
- Use React Server Components for initial data fetch
- Implement optimistic updates for booking actions
- Virtual scrolling for large time ranges
- Debounce drag operations
- Cache booking data per week

### Accessibility Requirements
- Full keyboard navigation (Arrow keys, Tab, Enter, Escape)
- ARIA labels for all interactive elements
- High contrast mode support
- Focus management in modals
- Screen reader announcements for actions

### Agent & Tool Recommendations
- **Explore Agent**: Use for discovering patterns in similar calendar implementations
- **Plan Agent**: Use for complex architectural decisions
- **Code Review**: Manual review after each major component
