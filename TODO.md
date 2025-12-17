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

### Feature 2: Court Management
- [ ] Database schema for courts table
- [ ] Court list/grid view
- [ ] Court CRUD operations
- [ ] Surface type (indoor/outdoor)
- [ ] Status management (available/maintenance/reserved)

### Feature 3: Group Management
- [ ] Database schema for groups and group_players
- [ ] Group list with player count
- [ ] Create/edit group modal
- [ ] Assign players to groups
- [ ] Level range validation
- [ ] Coach assignment
- [ ] Weekly schedule template

---

## Phase 2: Booking & Operations

### Feature 4: Court Booking Calendar
- [ ] Week view calendar component
- [ ] Court columns, time rows
- [ ] Booking types (rental, group class, private lesson)
- [ ] Drag-and-drop booking
- [ ] Recurring booking support
- [ ] Conflict detection

### Feature 5: Attendance System
- [ ] Database schema for attendance
- [ ] Mark attendance UI (coach view)
- [ ] Self check-in option (player view)
- [ ] Attendance history per player
- [ ] Absence notifications
- [ ] Auto-cancel groups below threshold

### Feature 6: Payment Tracking
- [ ] Database schema for payments
- [ ] Payment status per player
- [ ] Monthly/per-session tracking
- [ ] Payment reminders
- [ ] Payment history export

---

## Phase 3: Activities & Engagement

### Feature 7: Activities Hub
- [ ] Mixings (social play events)
- [ ] Leagues (round-robin, elimination)
- [ ] Rankings (point-based leaderboard)
- [ ] Activity calendar integration

### Feature 8: Player Zone
- [ ] Player dashboard
- [ ] Event announcements
- [ ] League standings view
- [ ] Ranking position
- [ ] Activity history
- [ ] Personal schedule

### Feature 9: Feedback System
- [ ] Player → Coach feedback form
- [ ] Coach → Player feedback form
- [ ] Feedback history
- [ ] Anonymous option

---

## Phase 4: Automation & Extras

### Feature 10: Coach Scheduling
- [ ] Coach availability calendar
- [ ] Session objectives per group
- [ ] Private lesson booking with objectives
- [ ] Coach workload overview

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
- [ ] Supabase setup and connection
- [ ] Authentication (admin/coach/player roles)
- [ ] Vercel deployment
- [ ] Error tracking (Sentry)

---

## Notes

- Each feature should be developed in its own worktree
- Small PRs, incremental progress
- Test as you build
- Update translations for both languages
