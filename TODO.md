# Padel Club Manager - Feature Backlog

## Phase 1: Core Foundation

### Feature 1: Player Profiles
- [ ] Database schema for players table
- [ ] Player list page with search/filter
- [ ] Player detail/edit modal
- [ ] Level system (1-7 with categories)
- [ ] Player status (active/inactive)
- [ ] Contact info (phone, email)
- [ ] Notes/objectives field

**Testing Tasks:**
- [ ] Unit tests for player server actions
- [ ] Component tests for PlayerCard, PlayerForm

**Recommended Agents:**
- `frontend-design` skill for PlayerCard component
- `database-architect` for schema review
- `test-strategist` for test coverage planning

---

### Feature 2: Court Management [COMPLETED & VERIFIED]
- [x] Database schema for courts table
- [x] Supabase client configuration
- [x] TypeScript types for all database entities
- [x] Server actions with validation
- [x] Court list/grid view with toggle
- [x] Court CRUD operations
- [x] Surface type (indoor/outdoor)
- [x] Status management (available/maintenance/reserved)
- [x] Visual gradient cards (blue=indoor, green=outdoor)
- [x] Search and filter functionality
- [x] Empty states (no courts, no results)
- [x] Loading skeletons
- [x] Spanish and English translations

**Testing Tasks (Completed):**
- [x] Unit tests for server actions (`actions.test.ts`)
- [x] Component tests for CourtCard, CourtStatusBadge

**Verification Status:**
| Check | Result |
|-------|--------|
| Unit Tests | 36/36 PASSED |
| Build | PASSED |

**Files Created:**
```
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/index.ts
src/types/database.ts
src/app/courts/page.tsx
src/app/courts/CourtsClient.tsx
src/app/courts/actions.ts
src/app/courts/__tests__/actions.test.ts
src/components/courts/index.ts
src/components/courts/CourtCard.tsx
src/components/courts/CourtListItem.tsx
src/components/courts/CourtForm.tsx
src/components/courts/CourtStatusBadge.tsx
src/components/courts/SurfaceTypeIndicator.tsx
src/components/courts/CourtsToolbar.tsx
src/components/courts/CourtsEmptyState.tsx
src/components/courts/CourtsSkeleton.tsx
src/components/courts/__tests__/CourtCard.test.tsx
src/components/courts/__tests__/CourtStatusBadge.test.tsx
jest.config.js
jest.setup.js
.env.example
```

---

### Feature 3: Group Management
- [ ] Database schema for groups and group_players
- [ ] Group list with player count
- [ ] Create/edit group modal
- [ ] Assign players to groups
- [ ] Level range validation
- [ ] Coach assignment
- [ ] Weekly schedule template

**Testing Tasks:**
- [ ] Unit tests for group server actions
- [ ] Component tests for GroupCard, GroupForm

**Recommended Agents:**
- `database-architect` for many-to-many relationships
- `frontend-architect` for state management (group members)

---

## Phase 2: Booking & Operations

### Feature 4: Court Booking Calendar
- [ ] Week view calendar component
- [ ] Court columns, time rows
- [ ] Booking types (rental, group class, private lesson)
- [ ] Drag-and-drop booking
- [ ] Recurring booking support
- [ ] Conflict detection

**Testing Tasks:**
- [ ] Unit tests for booking validation (conflicts, time slots)
- [ ] Component tests for CalendarGrid, BookingSlot

**Recommended Agents:**
- `frontend-design` skill for calendar UI
- `frontend-architect` for complex state management
- `test-strategist` for edge case testing

---

### Feature 5: Attendance System
- [ ] Database schema for attendance
- [ ] Mark attendance UI (coach view)
- [ ] Self check-in option (player view)
- [ ] Attendance history per player
- [ ] Absence notifications
- [ ] Auto-cancel groups below threshold

**Testing Tasks:**
- [ ] Unit tests for attendance server actions
- [ ] Component tests for AttendanceList

---

### Feature 6: Payment Tracking
- [ ] Database schema for payments
- [ ] Payment status per player
- [ ] Monthly/per-session tracking
- [ ] Payment reminders
- [ ] Payment history export

**Testing Tasks:**
- [ ] Unit tests for payment calculations
- [ ] Component tests for PaymentStatus

**Recommended Agents:**
- `security-guardian` for payment data handling

---

## Phase 3: Activities & Engagement

### Feature 7: Activities Hub
- [ ] Mixings (social play events)
- [ ] Leagues (round-robin, elimination)
- [ ] Rankings (point-based leaderboard)
- [ ] Activity calendar integration

**Testing Tasks:**
- [ ] Unit tests for league standings calculation
- [ ] Component tests for event creation

---

### Feature 8: Player Zone
- [ ] Player dashboard
- [ ] Event announcements
- [ ] League standings view
- [ ] Ranking position
- [ ] Activity history
- [ ] Personal schedule

**Testing Tasks:**
- [ ] Component tests for Dashboard widgets

---

### Feature 9: Feedback System
- [ ] Player - Coach feedback form
- [ ] Coach - Player feedback form
- [ ] Feedback history
- [ ] Anonymous option

**Testing Tasks:**
- [ ] Component tests for feedback forms

---

## Phase 4: Automation & Extras

### Feature 10: Coach Scheduling
- [ ] Coach availability calendar
- [ ] Session objectives per group
- [ ] Private lesson booking with objectives
- [ ] Coach workload overview

---

### Feature 11: Promotions Module
- [ ] Happy hour slot configuration
- [ ] Discount management
- [ ] Club announcements
- [ ] Push notifications (future)

---

## Infrastructure

- [x] Project setup
- [x] UI component library
- [x] i18n (Spanish + English)
- [x] Supabase client configuration
- [x] Jest testing setup (36 tests passing)
- [ ] Authentication (admin/coach/player roles)
- [ ] Vercel deployment
- [ ] Error tracking (Sentry)

**Testing Infrastructure Details:**
- Jest configured with `jest.config.js` and `jest.setup.js`
- React Testing Library for component tests

---

## Testing Commands

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test:watch
```

---

## Development Guidelines

### For Each Feature:
1. **Plan**: Use `EnterPlanMode` for complex features
2. **Explore**: Use `Explore` agent to understand existing patterns
3. **Design**: Use `frontend-design` skill for key visual components
4. **Implement**: Create types, actions, components, pages
5. **Test**: Write unit, component, and E2E tests
6. **Review**: Run `code-reviewer` agent
7. **Document**: Update CLAUDE.md and TODO.md

### Testing Strategy:
- **Unit Tests**: Server actions, utility functions
- **Component Tests**: Interactive UI components with user events

---

## Notes

- Each feature should be developed in its own worktree
- Small PRs, incremental progress
- Test as you build
- Update translations for both languages
- Use agents proactively for code review and testing strategy
