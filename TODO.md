# Player Profiles Feature - Comprehensive Development Plan

> **Branch**: `feature/player-profiles`
> **Target**: Complete, production-ready player management system
> **UI Priority**: Impressive, modern, and highly usable interface

---

## 📊 Progress Summary

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Foundation & Infrastructure | ✅ Complete | 7/7 tasks |
| Phase 2: Core UI Components | ✅ Complete | 14/14 tasks |
| Phase 3: Player List Page | ✅ Complete | 11/13 tasks (Bulk selection pending) |
| Phase 4: Player Detail Page | ✅ Complete | 8/8 tasks |
| Phase 5: Server Actions | ✅ Complete | 5/5 tasks |
| Phase 6: Integration & Polish | 🔄 Partial | 6/10 tasks |
| Phase 7: Quality Assurance | ⏳ Pending | 0/4 tasks |
| Phase 8: Documentation & Deployment | ⏳ Pending | 0/4 tasks |

**Overall Progress: ~80% Complete**

**Test Infrastructure:**
- ✅ Jest configured (`jest.config.js`, `jest.setup.ts`)
- ✅ Playwright configured (`playwright.config.ts`)
- ✅ Unit tests created (`src/__tests__/`)
- ✅ E2E tests created (`e2e/players.spec.ts`)

---

## Overview

This document contains the complete development plan for the Player Profiles feature. Each section includes implementation tasks paired with mandatory testing tasks.

**Legend:**
- `[ ]` = Not started
- `[~]` = In progress
- `[x]` = Completed
- `Agent:` = Recommended AI agent/plugin for this task
- `Test:` = Associated testing task

---

## Phase 1: Foundation & Infrastructure

### 1.1 Project Setup & Configuration
**Agent: `architecture-advisor` for decisions**

- [x] **1.1.1** Configure Supabase client ✅
  - Create `src/lib/supabase/client.ts` (browser client)
  - Create `src/lib/supabase/server.ts` (server client)
  - Add environment variables to `.env.local`
  - **Test:** Verify connection to Supabase with a simple query

- [x] **1.1.2** Setup TypeScript types ✅
  - Create `src/types/database.ts` with generated Supabase types
  - Create `src/types/player.ts` with player-specific types
  - Define Player, PlayerStatus, PlayerLevel interfaces
  - **Test:** TypeScript compilation check (`npm run build`)

- [x] **1.1.3** Configure testing infrastructure ✅
  **Agent: `test-strategist`**
  - Install Jest and React Testing Library
  - Install and configure Playwright
  - Create test setup files
  - Add npm scripts for testing
  - **Test:** Run sample test to verify setup

- [x] **1.1.4** Expand i18n translations ✅
  - Add comprehensive player-related translations to `es.json`
  - Add comprehensive player-related translations to `en.json`
  - Include: form labels, errors, success messages, placeholders
  - **Test:** Verify all translation keys exist in both languages

---

### 1.2 Database Layer
**Agent: `database-architect`**
**Note:** Using Server Actions pattern instead of separate data access layer

- [x] **1.2.1** Review and enhance players table schema ✅
  - Verify existing migration `001_initial_schema.sql`
  - Add any missing columns (avatar_url, preferred_hand, etc.)
  - Create migration `002_players_enhancements.sql` if needed
  - **Test:** Run migration and verify schema in Supabase dashboard

- [x] **1.2.2** Create player data access functions ✅
  - Created `src/app/actions/players.ts` (Server Actions)
  - Implement `getPlayers()` with filtering options
  - Implement `getPlayer(id)`
  - Implement `createPlayer(data)`
  - Implement `updatePlayer(id, data)`
  - Implement `deletePlayer(id)` (soft delete via status)
  - **Test:** Unit tests for each data function

- [x] **1.2.3** Implement search and filtering ✅
  **Agent: `database-architect`**
  - Full-text search on name, email
  - Filter by status (active, inactive, suspended)
  - Filter by level range (min-max)
  - Sort options (name, level, created_at, updated_at)
  - **Test:** Test various filter combinations

---

## Phase 2: Core UI Components

### 2.1 Base UI Components
**Agent: `frontend-design` plugin**

- [x] **2.1.1** Create Card component ✅
  - File: `src/components/ui/card.tsx`
  - Variants: default, elevated, bordered, interactive
  - Support for header, body, footer sections
  - Hover effects for interactive cards
  - **Test:** Visual test with Playwright snapshot

- [x] **2.1.2** Create Skeleton loader component ✅
  - File: `src/components/ui/skeleton.tsx`
  - Variants: text, circle, rectangle, card
  - Animated shimmer effect
  - **Test:** Visual test showing loading state

- [x] **2.1.3** Create Dropdown/Select component ✅
  - File: `src/components/ui/select.tsx`
  - Searchable option
  - Multi-select option
  - Custom option rendering
  - Keyboard navigation support
  - **Test:** E2E test for keyboard navigation and selection

- [x] **2.1.4** Create Tabs component ✅
  - File: `src/components/ui/tabs.tsx`
  - Horizontal and vertical variants
  - Icon support
  - Animated indicator
  - **Test:** E2E test for tab switching

- [x] **2.1.5** Create EmptyState component ✅
  - File: `src/components/ui/empty-state.tsx`
  - Configurable icon, title, description
  - Action button slot
  - **Test:** Visual test

- [ ] **2.1.6** Create Tooltip component
  - File: `src/components/ui/tooltip.tsx`
  - Multiple positions (top, bottom, left, right)
  - Delay options
  - **Test:** E2E test for hover behavior

---

### 2.2 Player-Specific Components
**Agent: `frontend-design` plugin + `frontend-architect`**

- [x] **2.2.1** Create LevelIndicator component ✅
  **Agent: `frontend-design` plugin**
  - File: `src/components/players/LevelIndicator.tsx`
  - Visual progress bar (1-7 scale)
  - Color-coded based on level
  - Numeric display option
  - Category label display
  - Animated on mount
  - **Test:** Unit test for correct colors per level (`src/__tests__/LevelIndicator.test.tsx`)

- [x] **2.2.2** Create StatusBadge component ✅
  - File: `src/components/players/StatusBadge.tsx`
  - Variants: active (green), inactive (gray), suspended (red)
  - Subtle pulse animation for active
  - **Test:** Unit test for correct styling per status

- [x] **2.2.3** Create PlayerAvatar component ✅
  - File: `src/components/players/PlayerAvatar.tsx`
  - Image with fallback to initials
  - Size variants (sm, md, lg, xl)
  - Online indicator option
  - Level badge overlay option
  - **Test:** Unit test for initials generation

- [x] **2.2.4** Create PlayerCard component ✅
  **Agent: `frontend-design` plugin**
  - File: `src/components/players/PlayerCard.tsx`
  - Avatar, name, level indicator, status badge
  - Contact info with icons (phone, email)
  - Hover state with quick actions
  - Selection state for bulk operations
  - Responsive design (card in grid, row in list)
  - **Test:** E2E test for hover actions, visual test

- [x] **2.2.5** Create PlayerCardSkeleton component ✅
  - File: `src/components/players/PlayerCardSkeleton.tsx`
  - Matches PlayerCard layout
  - Shimmer animation
  - **Test:** Visual test

---

### 2.3 Player Form Components
**Agent: `frontend-architect` + `security-guardian`**

- [x] **2.3.1** Create LevelSelector component ✅
  **Agent: `frontend-design` plugin**
  - Integrated within PlayerForm component
  - Slider with visual feedback
  - Level category label auto-update
  - Color gradient track
  - Accessible with keyboard
  - **Test:** E2E test for value changes and accessibility

- [x] **2.3.2** Create PlayerForm component ✅
  **Agent: `security-guardian` for validation**
  - File: `src/components/players/PlayerForm.tsx`
  - Fields: name, email, phone, level, status, notes, objectives
  - Real-time validation with Zod (`src/lib/validations/player.ts`)
  - Error messages with i18n
  - Autosave draft option
  - **Test:** E2E test for validation, unit test for form logic (`src/__tests__/validations.test.ts`)

- [x] **2.3.3** Create PlayerModal component ✅
  - Files: `src/components/players/CreatePlayerModal.tsx`, `EditPlayerModal.tsx`
  - Create mode and Edit mode
  - Form embedded with proper focus management
  - Confirm before close if dirty
  - Loading state for save
  - **Test:** E2E test for create/edit flows (`e2e/players.spec.ts`)

---

## Phase 3: Player List Page

### 3.1 Search & Filter Components
**Agent: `frontend-architect`**

- [x] **3.1.1** Create PlayerSearch component ✅
  - Integrated in `src/components/players/PlayerFilters.tsx`
  - Debounced input (300ms)
  - Clear button
  - Search icon
  - Loading indicator during search
  - **Test:** Unit test for debounce behavior

- [x] **3.1.2** Create PlayerFilters component ✅
  **Agent: `frontend-design` plugin**
  - File: `src/components/players/PlayerFilters.tsx`
  - Status filter (checkboxes or toggle)
  - Level range filter (dual slider or dropdowns)
  - Clear all filters button
  - Active filter count badge
  - Collapsible on mobile
  - **Test:** E2E test for filter combinations (`e2e/players.spec.ts`)

- [x] **3.1.3** Create PlayerSort component ✅
  - Integrated in `src/components/players/PlayerFilters.tsx`
  - Sort by: name, level, created date, updated date
  - Direction toggle (asc/desc)
  - **Test:** E2E test for sort behavior

- [x] **3.1.4** Create ViewToggle component ✅
  - Integrated in `src/components/players/PlayerFilters.tsx`
  - Grid view / List view toggle
  - Persist preference in localStorage
  - **Test:** E2E test for view switching (`e2e/players.spec.ts`)

---

### 3.2 Player List Component
**Agent: `frontend-design` plugin + `frontend-architect`**

- [x] **3.2.1** Create PlayerList component ✅
  - File: `src/components/players/PlayerList.tsx`
  - Grid layout for card view
  - Table layout for list view (PlayerRow.tsx)
  - Responsive breakpoints
  - Virtualization for large lists (if > 100 players)
  - **Test:** E2E test with multiple players (`e2e/players.spec.ts`)

- [ ] **3.2.2** Implement bulk selection
  - Select all / none
  - Individual selection via checkbox
  - Selection count display
  - **Test:** E2E test for selection behavior

- [ ] **3.2.3** Create BulkActions component
  - File: `src/app/players/components/BulkActions.tsx`
  - Activate selected players
  - Deactivate selected players
  - Confirm dialog for actions
  - **Test:** E2E test for bulk operations

- [x] **3.2.4** Implement pagination ✅
  - Page size options (10, 25, 50)
  - Page number navigation
  - Total count display
  - URL query param sync
  - **Test:** E2E test for pagination navigation

---

### 3.3 Player List Page Assembly
**Agent: `frontend-design` plugin**

- [x] **3.3.1** Create Players page ✅
  - File: `src/app/players/page.tsx`, `PlayersPageClient.tsx`
  - Page header with title and add button
  - Search bar
  - Filters panel (collapsible)
  - Sort and view toggle
  - Player list with loading/empty states
  - Floating action button for add (mobile)
  - **Test:** E2E test for complete page flow (`e2e/players.spec.ts`)

- [x] **3.3.2** Implement React hooks for state ✅
  **Agent: `frontend-architect`**
  - State management in `PlayersPageClient.tsx` using useState/useCallback
  - Filter state management integrated
  - Selection state (partial - bulk selection pending)
  - **Test:** Unit tests for each hook

- [x] **3.3.3** Implement loading states ✅
  - File: `src/app/players/loading.tsx`
  - Skeleton grid/list during initial load
  - Inline loading for filter changes
  - Button loading states
  - **Test:** Visual test for loading states

- [x] **3.3.4** Implement empty states ✅
  - No players yet (first time)
  - No results for filters (with clear filter button)
  - Using EmptyState component
  - **Test:** Visual test for empty states

- [x] **3.3.5** Implement error states ✅
  - Network error with retry button
  - Validation error display
  - **Test:** E2E test for error handling

---

## Phase 4: Player Detail Page

### 4.1 Player Detail Components
**Agent: `frontend-design` plugin**

- [x] **4.1.1** Create PlayerHeader component ✅
  - File: `src/components/players/PlayerHeader.tsx`
  - Large avatar
  - Name with edit button
  - Level indicator (large)
  - Status badge
  - Contact actions (call, email)
  - **Test:** Visual test

- [x] **4.1.2** Create PlayerInfoTab component ✅
  - File: `src/components/players/tabs/OverviewTab.tsx`
  - Contact information section
  - Level details section
  - Status section with change option
  - Created/updated timestamps
  - **Test:** E2E test for inline editing

- [x] **4.1.3** Create PlayerNotesTab component ✅
  - Integrated in OverviewTab
  - Notes textarea with auto-save
  - Objectives textarea with auto-save
  - Last edited timestamp
  - **Test:** E2E test for auto-save

- [x] **4.1.4** Create PlayerGroupsTab component (placeholder) ✅
  - File: `src/components/players/tabs/GroupsTab.tsx`
  - List of groups (data placeholder)
  - "Coming soon" indicator if no integration yet
  - **Test:** Visual test

- [x] **4.1.5** Create PlayerHistoryTab component (placeholder) ✅
  - File: `src/components/players/tabs/AttendanceTab.tsx`
  - Activity timeline structure
  - "Coming soon" indicator
  - **Test:** Visual test

---

### 4.2 Player Detail Page Assembly
**Agent: `frontend-architect`**

- [x] **4.2.1** Create Player detail page ✅
  - File: `src/app/players/[id]/page.tsx`, `PlayerDetailClient.tsx`
  - Breadcrumb navigation
  - Player header
  - Tabbed content (Overview, Groups, Attendance, History)
  - Delete player button with confirmation
  - **Test:** E2E test for complete page (`e2e/players.spec.ts`)

- [x] **4.2.2** Create usePlayer hook ✅
  - Using Server Actions directly in components
  - Fetch single player by ID via `getPlayer()`
  - Update player mutation via `updatePlayer()`
  - Delete player mutation via `deletePlayer()`
  - Optimistic updates
  - **Test:** Unit tests for hook

- [x] **4.2.3** Implement inline editing ✅
  - Edit via modal (EditPlayerModal)
  - Save/cancel with validation
  - Validation feedback with Zod
  - **Test:** E2E test for edit flow

---

## Phase 5: API Routes
**Agent: `backend-service-architect` + `security-guardian`**
**Note:** Using Server Actions pattern instead of API routes (Next.js 14 recommended approach)

### 5.1 Player API Routes → Server Actions

- [x] **5.1.1** Create GET players functionality ✅
  - File: `src/app/actions/players.ts` → `getPlayers()`
  - Pagination support
  - Filter query params
  - Sort query params
  - Search query param
  - **Test:** Integration test with various params

- [x] **5.1.2** Create POST players functionality ✅
  **Agent: `security-guardian`**
  - File: `src/app/actions/players.ts` → `createPlayer()`
  - Request body validation with Zod
  - Email uniqueness check
  - Return created player
  - **Test:** Integration test for create

- [x] **5.1.3** Create GET player by ID functionality ✅
  - File: `src/app/actions/players.ts` → `getPlayer()`
  - Return single player
  - 404 handling
  - **Test:** Integration test for get

- [x] **5.1.4** Create PATCH player functionality ✅
  **Agent: `security-guardian`**
  - File: `src/app/actions/players.ts` → `updatePlayer()`
  - Partial update support
  - Input validation with Zod
  - Email uniqueness check (if changed)
  - **Test:** Integration test for update

- [x] **5.1.5** Create DELETE player functionality ✅
  - File: `src/app/actions/players.ts` → `deletePlayer()`
  - Soft delete (set status to inactive)
  - Hard delete option (query param)
  - **Test:** Integration test for delete

---

## Phase 6: Integration & Polish

### 6.1 Integration
**Agent: `code-reviewer`**

- [x] **6.1.1** Connect player list to Server Actions ✅
  - Wire up PlayersPageClient to Server Actions
  - Using React useTransition for loading states
  - **Test:** E2E test for data loading (`e2e/players.spec.ts`)

- [x] **6.1.2** Connect player detail to Server Actions ✅
  - Wire up PlayerDetailClient to Server Actions
  - Implement mutations via updatePlayer/deletePlayer
  - **Test:** E2E test for CRUD operations

- [x] **6.1.3** Connect player form to Server Actions ✅
  - Create submission via createPlayer()
  - Edit submission via updatePlayer()
  - Error handling with try/catch
  - **Test:** E2E test for form submission (`e2e/players.spec.ts`)

---

### 6.2 Polish & UX
**Agent: `frontend-design` plugin**

- [x] **6.2.1** Add animations ✅
  - Page transitions
  - Card hover effects
  - Modal open/close
  - List item enter/exit
  - Staggered card animations
  - **Test:** Visual test for animations

- [x] **6.2.2** Add keyboard shortcuts ✅
  - `n` for new player (on list page)
  - `Escape` to close modal
  - Visual keyboard hint on button
  - **Test:** E2E test for shortcuts

- [x] **6.2.3** Implement toast notifications ✅
  - Success messages
  - Error messages
  - Toast context provider
  - Animated enter/exit transitions
  - **Test:** E2E test for notifications

- [ ] **6.2.4** Add responsive optimizations
  - Mobile-first adjustments
  - Touch-friendly targets
  - Swipe gestures for cards
  - **Test:** E2E test on mobile viewport

---

### 6.3 Accessibility
**Agent: `frontend-architect`**

- [ ] **6.3.1** Audit and fix accessibility
  - Run axe-core audit
  - Fix color contrast issues
  - Add proper ARIA labels
  - Ensure keyboard navigation
  - Screen reader testing
  - **Test:** Automated a11y test with Playwright

---

## Phase 7: Quality Assurance

### 7.1 Code Review
**Agent: `feature-dev:code-reviewer`**

- [ ] **7.1.1** Full code review
  - Review all new components
  - Check for code quality issues
  - Verify conventions adherence
  - **Test:** Linting passes (`npm run lint`)

### 7.2 Security Review
**Agent: `security-guardian`**

- [ ] **7.2.1** Security audit
  - Input validation review
  - XSS prevention check
  - SQL injection prevention
  - API endpoint security
  - **Test:** Security-focused tests

### 7.3 Performance
**Agent: `frontend-architect`**

- [ ] **7.3.1** Performance optimization
  - Analyze bundle size
  - Optimize images
  - Lazy load components where needed
  - Memoize expensive computations
  - **Test:** Lighthouse performance score > 90

### 7.4 Final Testing
**Agent: `test-strategist`**

- [ ] **7.4.1** Complete E2E test suite
  - Test all user flows
  - Test error scenarios
  - Test responsive behavior
  - Cross-browser testing
  - **Test:** All E2E tests pass (`npx playwright test`)

- [ ] **7.4.2** Manual QA testing
  - Walk through all features manually
  - Test edge cases
  - Verify translations
  - **Test:** QA checklist complete

---

## Phase 8: Documentation & Deployment

### 8.1 Documentation

- [ ] **8.1.1** Update README with player features
  - Feature description
  - Screenshots
  - Usage instructions
  - **Test:** Review documentation accuracy

- [ ] **8.1.2** Add inline code documentation
  - JSDoc for complex functions
  - Component prop documentation
  - **Test:** Review completeness

### 8.2 Deployment Preparation

- [ ] **8.2.1** Final build verification
  - Production build succeeds
  - No console errors
  - All env vars documented
  - **Test:** `npm run build` passes

- [ ] **8.2.2** Create Pull Request
  **GitHub MCP tools: `create_pull_request`**
  - Comprehensive PR description
  - Screenshots/videos of features
  - Testing instructions
  - **Test:** PR checks pass

---

## Test Summary

| Phase | Unit Tests | Integration Tests | E2E Tests |
|-------|------------|-------------------|-----------|
| 1. Foundation | 5 | 3 | 1 |
| 2. Core UI | 10 | 0 | 8 |
| 3. List Page | 5 | 2 | 10 |
| 4. Detail Page | 3 | 1 | 5 |
| 5. API Routes | 0 | 10 | 0 |
| 6. Integration | 0 | 5 | 8 |
| 7. QA | 1 | 1 | 5 |
| **Total** | **24** | **22** | **37** |

---

## Agent Usage Summary

| Agent/Tool | Tasks |
|------------|-------|
| `database-architect` | 1.2.1, 1.2.2, 1.2.3 |
| `backend-service-architect` | 5.1.* |
| `frontend-architect` | 2.3.*, 3.1.*, 3.2.*, 4.2.*, 6.3.1, 7.3.1 |
| `frontend-design` plugin | 2.1.*, 2.2.*, 3.1.2, 3.2.1, 3.3.1, 4.1.*, 6.2.* |
| `security-guardian` | 2.3.2, 5.1.2, 5.1.4, 7.2.1 |
| `test-strategist` | 1.1.3, 7.4.* |
| `code-reviewer` | 7.1.1 |
| `feature-dev:code-reviewer` | 7.1.1 |
| `architecture-advisor` | 1.1.* |
| Playwright (E2E testing) | All E2E tests, visual tests |
| GitHub MCP | 8.2.2 |

---

## Development Workflow Notes

<<<<<<< HEAD
- Each task with a **Test:** annotation must have tests before being marked complete
- Use the `frontend-design` plugin for ALL visible UI components
- Run `npm run lint` and `npm run build` frequently
- Commit after each completed section
- Update translations in both `es.json` and `en.json` as you build
- Screenshot key UI states for PR documentation
=======
### Using Agents
- **Explore Agent**: Use for understanding existing code patterns before implementing
- **Plan Agent**: Use for complex architectural decisions (e.g., drag-and-drop library choice)
- **Code Review**: Perform after each numbered task section

### Testing Checklist (per task)
1. Component renders without errors
2. All props are typed correctly
3. Accessibility attributes present
4. Responsive on mobile/desktop
5. i18n keys all resolve
6. Edge cases handled (empty, loading, error)

### Code Review Checklist (per section)
1. TypeScript strict mode passes
2. No any types without justification
3. Components follow project patterns
4. Tailwind classes use cn() utility
5. All user-facing text uses translations
6. No console.logs or debug code
7. Error boundaries in place
8. Loading and empty states exist

---

## Legend
- [ ] Not started
- [x] Completed
- ✅ **Test** - Testing task
- 🔍 **Code Review** - Review task
>>>>>>> origin/main
