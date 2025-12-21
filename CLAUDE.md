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
- **Testing**: Jest + React Testing Library

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   └── courts/          # Courts feature
│       ├── page.tsx     # Server component page
│       ├── CourtsClient.tsx  # Client component
│       ├── actions.ts   # Server actions
│       └── __tests__/   # Unit tests
├── components/
│   ├── ui/             # Reusable UI components
│   └── courts/         # Court-specific components
│       ├── CourtCard.tsx
│       ├── CourtListItem.tsx
│       ├── CourtForm.tsx
│       ├── CourtsToolbar.tsx
│       ├── CourtsEmptyState.tsx
│       ├── CourtsSkeleton.tsx
│       └── __tests__/   # Component tests
├── lib/
│   ├── utils.ts        # Utility functions
│   └── supabase/       # Database client
├── types/              # TypeScript types
└── i18n/               # Internationalization
messages/               # Translation files (en.json, es.json)
supabase/
└── migrations/         # Database migrations
e2e/                    # E2E tests
```

## Key Conventions

### Component Patterns
- Use 'use client' only when needed (useState, useEffect, event handlers)
- Server components by default
- UI components in `src/components/ui/`
- Feature components in `src/components/{feature}/`
- Export all feature components from `index.ts`

### Styling
- Use `cn()` utility for conditional classes
- Primary brand color: blue-600
- Stone palette for neutral colors
- Consistent spacing: p-4, p-6 for containers
- Gradient headers for visual components (indoor: blue, outdoor: green)
- Hover animations for interactive elements

### i18n
- All user-facing text must use translations
- Access via `useTranslations('namespace')`
- Default locale: Spanish (es)
- Translation files in `/messages/`
- Always add both Spanish and English translations

### Database
- Use Supabase client from `@/lib/supabase/client`
- Server-side: `@/lib/supabase/server`
- Types in `@/types/database.ts`
- Migrations in `supabase/migrations/`

### Server Actions
- Located in `src/app/{feature}/actions.ts`
- Always validate input data
- Return structured responses: `{ success, data?, error?, errors? }`
- Use `revalidatePath` for cache invalidation

## Available MCPs & Integrations

### GitHub MCP
Use for repository operations:
- Create PRs: `mcp__github__create_pull_request`
- List issues: `mcp__github__list_issues`
- Code search: `mcp__github__search_code`

### DigitalOcean MCP
Use for infrastructure:
- Droplet management
- Database clusters
- App Platform deployments

### Supabase MCP
Use for database management:
- List projects: `mcp__plugin_supabase_supabase__list_projects`
- Execute SQL: `mcp__plugin_supabase_supabase__execute_sql`
- Apply migrations: `mcp__plugin_supabase_supabase__apply_migration`
- List tables: `mcp__plugin_supabase_supabase__list_tables`

## Available Skills & Plugins

### frontend-design Skill
Invoke for creating impressive, production-grade UI components:
```
Use the Skill tool with skill: "frontend-design:frontend-design"
```
Best for: Court cards, player profiles, dashboard widgets

## Recommended Subagents

| Agent | Use For |
|-------|---------|
| `frontend-architect` | UI component architecture, state management |
| `database-architect` | Schema design, query optimization |
| `test-strategist` | Test coverage, testing strategies |
| `code-reviewer` | Code quality review before PRs |
| `security-guardian` | Input validation, auth flows |
| `Explore` | Codebase exploration, finding patterns |

### When to Use Each Agent:

**frontend-architect**: After creating multiple components, review architecture
```
Task tool with subagent_type: "frontend-architect"
```

**test-strategist**: When planning testing strategy for a feature
```
Task tool with subagent_type: "test-strategist"
```

**code-reviewer**: Before creating PRs or after major changes
```
Task tool with subagent_type: "code-reviewer"
```

## Testing Commands
```bash
npm test           # Run Jest unit tests
npm test:watch     # Watch mode for tests
npm run build      # Verify TypeScript compilation
```

## Verification Status

| Check | Status | Notes |
|-------|--------|-------|
| Unit Tests | 36/36 PASSED | Jest + React Testing Library |
| Build | PASSED | TypeScript compiles without errors |

## Known Issues & Workarounds

### Supabase SSR Type Inference
The Supabase SSR client (`@supabase/ssr@0.5.2`) has type inference issues with the generic `<Database>` type not flowing through query builders.

**Workaround**: Use `// @ts-ignore` above `.insert()` and `.update()` calls:
```typescript
const { data, error } = await supabase
  .from('courts')
  // @ts-ignore - Supabase SSR client type inference issue
  .insert(rawData)
  .select()
  .single()
```

### ActionResult Type Casting
Server actions return `ActionResult<T = unknown>` with `data?: T`. When using the data in client components, cast it to the expected type:
```typescript
setCourts((prev) => [...prev, result.data as Court])
```

## Player Level System
- Numeric: 1-7 scale
- Categories:
  - 1: Iniciacion / Beginner
  - 2: Iniciacion+ / Beginner+
  - 3: Intermedio Bajo / Low Intermediate
  - 4: Intermedio / Intermediate
  - 5: Intermedio Alto / High Intermediate
  - 6: Avanzado / Advanced
  - 7: Competicion / Competition

## Court Status System
- **available**: Court is free for booking (green badge)
- **maintenance**: Court is under maintenance (amber badge)
- **reserved**: Court is currently reserved (red badge)

## Git Workflow
- Main branch: `main`
- Feature branches: `feature/feature-name`
- Use git worktrees for parallel development
- Small, focused PRs

## Feature Development Order
1. Player Profiles
2. **Court Management** (COMPLETED)
3. Group Management
4. Court Booking Calendar
5. Attendance System
6. Payment Tracking
7. Activities Hub
8. Player Zone
9. Feedback System
10. Promotions Module

## Development Checklist for New Features

### Planning Phase
- [ ] Use `EnterPlanMode` for complex features
- [ ] Create comprehensive plan with phases
- [ ] Identify which agents/skills to leverage

### Implementation Phase
- [ ] Create types in `types/database.ts`
- [ ] Create server actions with validation
- [ ] Create UI components (use frontend-design for key visuals)
- [ ] Create page (server) and client components
- [ ] Update translations (both es.json and en.json)

### Testing Phase
- [ ] Unit tests for server actions
- [ ] Component tests with React Testing Library

### Review Phase
- [ ] Run `code-reviewer` agent
- [ ] Update CLAUDE.md if needed
- [ ] Create PR via GitHub MCP
