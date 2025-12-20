# Padel Club Manager - AI Development Guide

## Project Overview
Padel club management system for recreational clubs. Features: player profiles, court management, group scheduling, bookings, attendance, and payments.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl (Spanish + English)
- **Icons**: Lucide React

## Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   └── groups/
│       ├── page.tsx                # Groups list page
│       ├── loading.tsx             # List loading skeleton
│       ├── error.tsx               # List error boundary
│       └── [id]/
│           ├── page.tsx            # Group detail page
│           ├── loading.tsx         # Detail loading skeleton
│           └── error.tsx           # Detail error boundary
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   └── groups/                     # Group feature components
│       ├── GroupCard.tsx           # Group card with status, capacity
│       ├── GroupList.tsx           # Filterable, sortable grid
│       ├── GroupForm.tsx           # Create/Edit form with validation
│       ├── GroupModal.tsx          # Modal wrapper for form
│       ├── GroupPlayers.tsx        # Player list and assignment
│       ├── GroupScheduleDisplay.tsx # Weekly schedule view
│       ├── ScheduleEditor.tsx      # Time slot management
│       ├── LevelRangeSelector.tsx  # Dual-thumb slider (1-7)
│       ├── BulkActionsToolbar.tsx  # Multi-select operations
│       └── index.ts                # Barrel exports
├── lib/
│   ├── utils.ts                    # Utility functions (cn, etc.)
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       ├── server.ts               # Server Supabase client
│       ├── groups.ts               # Group CRUD operations
│       └── bookings.ts             # Auto-booking creation
├── types/
│   ├── database.ts                 # All database types
│   ├── groups.ts                   # Group-specific types
│   └── index.ts                    # Barrel exports
└── hooks/
    ├── useGroups.ts                # Group hooks with real-time
    └── index.ts                    # Barrel exports
messages/
├── es.json                         # Spanish translations
└── en.json                         # English translations
supabase/
└── migrations/
    └── 001_initial_schema.sql      # Database schema
```

---

## Key Conventions

### Component Patterns
- Use 'use client' only when needed (useState, useEffect, event handlers)
- Server components by default
- UI components in `src/components/ui/`
- Feature components alongside their domain (e.g., `src/components/groups/`)

### Styling
- Use `cn()` utility for conditional classes
- Primary brand color: `blue-600`
- Stone palette for neutral colors
- Consistent spacing: `p-4`, `p-6` for containers
- Cards: `rounded-xl`, `shadow-sm` default, `shadow-xl` on hover

### i18n
- All user-facing text must use translations
- Access via `useTranslations('namespace')`
- Default locale: Spanish (es)
- Translation files in `/messages/`
- Available namespaces: `common`, `groups`, `levels`, `navigation`

### Database
- Use Supabase client from `@/lib/supabase/client`
- Types in `@/types/database.ts`
- **Security**: Always use `isValidUUID()` for ID validation
- **Security**: Always use `sanitizeSearchInput()` for search queries

### Accessibility
- All interactive elements must be keyboard accessible
- Use proper ARIA labels and roles
- Modal components include focus management
- Sliders include full keyboard navigation (arrows, Home, End)

---

## Player Level System
| Level | Spanish | English |
|-------|---------|---------|
| 1 | Iniciacion | Beginner |
| 2 | Iniciacion+ | Beginner+ |
| 3 | Intermedio Bajo | Low Intermediate |
| 4 | Intermedio | Intermediate |
| 5 | Intermedio Alto | High Intermediate |
| 6 | Avanzado | Advanced |
| 7 | Competicion | Competition |

---

## Available Hooks

### useGroups
```typescript
const { groups, isLoading, error, refetch } = useGroups(filters, sort, pagination)
```

### useGroup
```typescript
const { group, isLoading, error, refetch } = useGroup(groupId)
```

### useGroupMutations
```typescript
const { create, update, remove, addPlayer, removePlayer } = useGroupMutations()
```

### useGroupSelection
```typescript
const { selectedIds, toggle, selectAll, deselectAll } = useGroupSelection(groupIds)
```

### useBulkGroupOperations
```typescript
const { bulkActivate, bulkDeactivate, bulkDelete } = useBulkGroupOperations()
```

---

## Git Workflow
- Main branch: `main`
- Feature branches: `feature/feature-name`
- Current: `feature/group-management` (complete)

## Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run linter
```

## Feature Development Order
1. Player Profiles
2. Court Management
3. **Group Management** (COMPLETE)
4. Court Booking Calendar
5. Attendance System
6. Payment Tracking
7. Activities Hub
8. Player Zone
9. Feedback System
10. Promotions Module

---

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See `.env.local.example` for template.
