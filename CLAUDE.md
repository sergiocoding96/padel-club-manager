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
