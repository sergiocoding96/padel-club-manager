# Padel Club Manager - Player Profiles Feature

## Current Focus: Player Profiles Feature
This worktree is dedicated to implementing the **Player Profiles** feature - the first core feature of the Padel Club Manager system. All development should be focused on completing this feature before moving to other features.

---

## Project Overview
Padel club management system for recreational clubs. The Player Profiles feature enables comprehensive player management with an impressive, user-friendly interface.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **i18n**: next-intl (Spanish + English)
- **Icons**: Lucide React
- **Testing**: Playwright (E2E), Jest (unit tests)

---

## AI Agent & Tool Integration

### When to Use Specialized Agents

#### 1. Database Work
**Use: `database-architect` agent**
- Designing or modifying the players table schema
- Writing complex queries for player search/filtering
- Optimizing player-related indexes
- Creating migration files

#### 2. Backend API Development
**Use: `backend-service-architect` agent**
- Creating player CRUD API routes
- Implementing search/filter endpoints
- Designing API response structures
- Error handling patterns

#### 3. Frontend UI Components
**Use: `frontend-architect` agent**
- Player list component architecture
- Player card/profile design
- Form components for player creation/editing
- Search and filter UI patterns
- Responsive design decisions

**Use: `frontend-design` plugin (CRITICAL for impressive UI)**
- Player profile cards with visual level indicators
- Dashboard statistics widgets
- Interactive level selector component
- Animated status badges
- Modern data tables with sorting

#### 4. Architecture Decisions
**Use: `architecture-advisor` agent**
- Component structure decisions
- State management patterns
- Data fetching strategies
- Caching approaches

#### 5. Code Quality
**Use: `code-reviewer` agent**
- After implementing any significant component
- Before creating pull requests
- When refactoring existing code

**Use: `feature-dev:code-reviewer` agent**
- Comprehensive code reviews with confidence filtering
- Security and convention adherence checks

#### 6. Security
**Use: `security-guardian` agent**
- Input validation for player forms
- Data sanitization
- API endpoint security
- XSS prevention in player notes/objectives

#### 7. Testing
**Use: `test-strategist` agent**
- Designing test strategy for player features
- Writing unit tests for utilities
- Creating integration tests for API routes
- E2E test scenarios

**Use: Playwright MCP tools**
- `browser_navigate`, `browser_snapshot`, `browser_click`
- Visual testing of player UI
- Form interaction testing
- Cross-browser verification

#### 8. Codebase Exploration
**Use: `feature-dev:code-explorer` agent**
- Understanding existing patterns
- Tracing component dependencies
- Mapping data flows

#### 9. Feature Planning
**Use: `feature-dev:code-architect` agent**
- Designing player feature architecture
- Creating implementation blueprints
- Component design specifications

#### 10. Version Control
**Use: GitHub MCP tools**
- `create_branch`, `push_files`, `create_pull_request`
- Managing feature branches
- Creating focused PRs

---

## Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   └── players/                    # Player Profiles feature
│       ├── page.tsx               # Player list page
│       ├── [id]/
│       │   └── page.tsx           # Player detail page
│       └── components/            # Player-specific components
│           ├── PlayerCard.tsx
│           ├── PlayerList.tsx
│           ├── PlayerModal.tsx
│           ├── PlayerSearch.tsx
│           ├── PlayerFilters.tsx
│           ├── LevelIndicator.tsx
│           └── StatusBadge.tsx
├── components/
│   └── ui/                        # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── modal.tsx
│       ├── badge.tsx
│       ├── avatar.tsx
│       ├── card.tsx               # To be created
│       ├── skeleton.tsx           # To be created
│       ├── dropdown.tsx           # To be created
│       └── tabs.tsx               # To be created
├── lib/
│   ├── utils.ts                   # Utility functions
│   └── supabase/
│       ├── client.ts              # Browser client
│       ├── server.ts              # Server client
│       └── players.ts             # Player data functions
├── types/
│   ├── database.ts                # Database types (generated)
│   └── player.ts                  # Player-specific types
├── hooks/
│   ├── usePlayer.ts               # Player data hook
│   ├── usePlayers.ts              # Players list hook
│   └── usePlayerFilters.ts        # Filter state hook
└── i18n/
    └── request.ts
messages/
├── en.json                         # English translations
└── es.json                         # Spanish translations
supabase/
└── migrations/
    └── 001_initial_schema.sql
```

---

## Player Level System
Visual and functional level representation:

| Level | Spanish | English | Color Code |
|-------|---------|---------|------------|
| 1 | Iniciacion | Beginner | `emerald-400` |
| 2 | Iniciacion+ | Beginner+ | `emerald-500` |
| 3 | Intermedio Bajo | Low Intermediate | `amber-400` |
| 4 | Intermedio | Intermediate | `amber-500` |
| 5 | Intermedio Alto | High Intermediate | `orange-500` |
| 6 | Avanzado | Advanced | `red-500` |
| 7 | Competicion | Competition | `purple-600` |

**Visual Indicators:**
- Progress bar showing level (1-7 scale)
- Color-coded badges
- Star rating alternative view
- Level trend indicator (improving/stable/declining)

---

## Key UI/UX Requirements

### Player List Page
- **Grid/List toggle view**
- **Search bar** with real-time filtering
- **Filter panel**: status, level range, groups
- **Sort options**: name, level, created date, last activity
- **Bulk actions**: activate/deactivate multiple
- **Quick add** button with floating action
- **Empty states** with helpful guidance
- **Loading skeletons** for smooth UX
- **Pagination** or infinite scroll

### Player Card Component
- **Avatar** with initials fallback
- **Name** prominently displayed
- **Level badge** with color coding
- **Status indicator** (active/inactive/suspended)
- **Quick actions** on hover (edit, view, contact)
- **Subtle animation** on interactions
- **Contact icons** (phone, email) with tooltips

### Player Detail/Modal
- **Tabbed interface**: Info, Groups, History, Notes
- **Editable fields** with inline editing option
- **Level selector** with visual feedback
- **Notes/objectives** with rich text
- **Activity timeline** (future)
- **Group memberships** (future integration)

---

## Development Conventions

### Component Patterns
- Server components by default
- `'use client'` only for interactivity
- Co-locate feature components with pages
- Extract reusable pieces to `components/ui/`

### Styling
- Use `cn()` utility for conditional classes
- Primary: `blue-600`
- Neutral: `stone-*` palette
- Spacing: `p-4`, `p-6` for containers
- Border radius: `rounded-lg`, `rounded-xl`
- Shadows: `shadow-sm`, `shadow-md` for elevation

### i18n
- ALL user-facing text via `useTranslations()`
- Default locale: Spanish (es)
- Namespace: `players` for player-related strings
- Update BOTH `en.json` and `es.json`

### Testing Requirements
- **Every feature must have tests**
- Unit tests for utilities and hooks
- Integration tests for API routes
- E2E tests for user flows with Playwright
- Visual regression tests for UI components

### Database
- Use Supabase client from `@/lib/supabase/client`
- Server-side: `@/lib/supabase/server`
- Types auto-generated in `@/types/database.ts`

---

## Git Workflow
- **Branch**: `feature/player-profiles` (current)
- **PR target**: `main`
- **Commit style**: Conventional commits
  - `feat: Add player list component`
  - `fix: Correct level validation`
  - `test: Add player card tests`
  - `style: Update player card animations`

---

## Commands
```bash
npm run dev      # Start development (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
npm test         # Run tests (when configured)
npm run test:e2e # Playwright E2E tests (when configured)
```

---

## Quality Checklist
Before marking any task complete:

- [ ] Code compiles without errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] Translations added for ES and EN
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Accessibility basics (labels, focus states, contrast)
- [ ] Tests written and passing
- [ ] Code reviewed (use `code-reviewer` agent)
- [ ] Security reviewed for user input (use `security-guardian` agent)

---

## Agent Workflow Examples

### Creating a New Component
1. **Plan**: Use `feature-dev:code-architect` to design component structure
2. **Implement**: Use `frontend-design` plugin for impressive UI
3. **Review**: Use `code-reviewer` agent to check quality
4. **Test**: Use `test-strategist` agent to create tests
5. **Verify**: Use Playwright to test in browser

### Database Changes
1. **Design**: Use `database-architect` for schema changes
2. **Implement**: Create migration file
3. **Review**: Use `security-guardian` for data validation
4. **Test**: Verify with database queries

### Full Feature Implementation
1. **Explore**: Use `feature-dev:code-explorer` to understand codebase
2. **Architect**: Use `feature-dev:code-architect` for blueprint
3. **Database**: Use `database-architect` if needed
4. **Backend**: Use `backend-service-architect` for APIs
5. **Frontend**: Use `frontend-architect` + `frontend-design` for UI
6. **Security**: Use `security-guardian` for review
7. **Test**: Use `test-strategist` for comprehensive tests
8. **Review**: Use `feature-dev:code-reviewer` for final check
