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

### Feature 4: Court Booking Calendar (COMPREHENSIVE PLAN)

#### 4.0 Prerequisites & Infrastructure
- [ ] **4.0.1** Create Supabase client configuration
  - [ ] Create `src/lib/supabase/client.ts` (browser client)
  - [ ] Create `src/lib/supabase/server.ts` (server client with cookies)
  - [ ] Add environment variables template (.env.example)
  - [ ] ✅ **Test**: Verify Supabase connection works
  - [ ] 🔍 **Code Review**: Review client setup and security

- [ ] **4.0.2** Define TypeScript types for bookings
  - [ ] Create `src/types/database.ts` with Supabase generated types
  - [ ] Create `src/types/bookings.ts` with booking-specific interfaces
  - [ ] Define `RecurringPattern` type
  - [ ] Define `BookingWithRelations` type (joins with court, player, coach, group)
  - [ ] ✅ **Test**: TypeScript compilation passes
  - [ ] 🔍 **Code Review**: Review type definitions for completeness

- [ ] **4.0.3** Add booking-related translations
  - [ ] Update `messages/es.json` with booking namespace
  - [ ] Update `messages/en.json` with booking namespace
  - [ ] Include calendar, form, validation, and status messages
  - [ ] ✅ **Test**: All translation keys work in both languages
  - [ ] 🔍 **Code Review**: Review translation completeness

#### 4.1 Court Management (Dependency for Bookings)
- [ ] **4.1.1** Create courts page structure
  - [ ] Create `src/app/courts/page.tsx` (server component)
  - [ ] Create `src/app/courts/loading.tsx` (skeleton loader)
  - [ ] Add route to navigation
  - [ ] ✅ **Test**: Page renders without errors
  - [ ] 🔍 **Code Review**: Review page structure

- [ ] **4.1.2** Build CourtList component
  - [ ] Create `src/components/courts/CourtList.tsx`
  - [ ] Display courts in responsive grid (1-2-3 columns)
  - [ ] Show court name, surface type, status badge
  - [ ] Empty state with "Add Court" CTA
  - [ ] ✅ **Test**: Component renders with mock data
  - [ ] 🔍 **Code Review**: Review component patterns

- [ ] **4.1.3** Build CourtCard component
  - [ ] Create `src/components/courts/CourtCard.tsx`
  - [ ] Display court icon based on surface type
  - [ ] Show status with colored badge
  - [ ] Action buttons (edit, delete)
  - [ ] Hover state with subtle shadow
  - [ ] ✅ **Test**: Card displays all states correctly
  - [ ] 🔍 **Code Review**: Review accessibility

- [ ] **4.1.4** Build CourtForm modal
  - [ ] Create `src/components/courts/CourtForm.tsx`
  - [ ] Form fields: name, surface type (radio), location, status
  - [ ] Form validation (name required, unique)
  - [ ] Create and edit modes
  - [ ] ✅ **Test**: Form validation works, submit disabled when invalid
  - [ ] 🔍 **Code Review**: Review form handling

- [ ] **4.1.5** Create court server actions
  - [ ] Create `src/lib/actions/courts.ts`
  - [ ] `getCourts()` - List all courts
  - [ ] `getCourtById(id)` - Single court
  - [ ] `createCourt(data)` - Create new court
  - [ ] `updateCourt(id, data)` - Update court
  - [ ] `deleteCourt(id)` - Delete (soft delete check for bookings)
  - [ ] ✅ **Test**: All CRUD operations work with Supabase
  - [ ] 🔍 **Code Review**: Review error handling and validation

- [ ] **4.1.6** Integrate courts with Supabase
  - [ ] Wire up CourtList to fetch real data
  - [ ] Connect CourtForm to create/update actions
  - [ ] Implement optimistic updates
  - [ ] Add error toasts/notifications
  - [ ] ✅ **Test**: Full CRUD flow works end-to-end
  - [ ] 🔍 **Code Review**: Review data flow and error handling

#### 4.2 Calendar UI Foundation
- [ ] **4.2.1** Create bookings page structure
  - [ ] Create `src/app/bookings/page.tsx` (server component)
  - [ ] Create `src/app/bookings/loading.tsx` (calendar skeleton)
  - [ ] Add route to navigation with active state
  - [ ] ✅ **Test**: Page renders with loading state
  - [ ] 🔍 **Code Review**: Review page structure

- [ ] **4.2.2** Build CalendarHeader component
  - [ ] Create `src/components/bookings/CalendarHeader.tsx`
  - [ ] Week navigation (previous/next buttons)
  - [ ] Current week display (e.g., "Dec 16-22, 2025")
  - [ ] "Today" quick navigation button
  - [ ] View toggle (Week/Day) for responsive design
  - [ ] Add booking button (primary CTA)
  - [ ] ✅ **Test**: Navigation updates displayed week
  - [ ] 🔍 **Code Review**: Review date handling logic

- [ ] **4.2.3** Build TimeColumn component
  - [ ] Create `src/components/bookings/TimeColumn.tsx`
  - [ ] Display time slots from 07:00 to 22:00
  - [ ] 30-minute slot increments
  - [ ] Current time indicator (red line)
  - [ ] Sticky positioning during scroll
  - [ ] ✅ **Test**: Time slots render correctly
  - [ ] 🔍 **Code Review**: Review time calculations

- [ ] **4.2.4** Build CalendarGrid component
  - [ ] Create `src/components/bookings/CalendarGrid.tsx`
  - [ ] Grid layout with court columns
  - [ ] Time row alignment with TimeColumn
  - [ ] Current day highlight
  - [ ] Past time slot visual distinction (greyed out)
  - [ ] ✅ **Test**: Grid renders with correct dimensions
  - [ ] 🔍 **Code Review**: Review grid layout responsiveness

- [ ] **4.2.5** Build CourtColumn component
  - [ ] Create `src/components/bookings/CourtColumn.tsx`
  - [ ] Court name header with surface indicator
  - [ ] Clickable empty slots
  - [ ] Booking slot rendering
  - [ ] Hover state on empty slots
  - [ ] ✅ **Test**: Click events fire correctly
  - [ ] 🔍 **Code Review**: Review event handling

- [ ] **4.2.6** Build BookingCalendar container
  - [ ] Create `src/components/bookings/BookingCalendar.tsx`
  - [ ] Compose all calendar sub-components
  - [ ] State management for selected date/week
  - [ ] State management for selected booking
  - [ ] Horizontal scroll for many courts
  - [ ] ✅ **Test**: Calendar displays with mock data
  - [ ] 🔍 **Code Review**: Review state management approach

#### 4.3 Booking Slot Display
- [ ] **4.3.1** Build BookingSlot component
  - [ ] Create `src/components/bookings/BookingSlot.tsx`
  - [ ] Calculate position and height from time range
  - [ ] Color coding by booking type (rental, group_class, private_lesson)
  - [ ] Display booking title (group name, player name, or "Court Rental")
  - [ ] Display time range
  - [ ] Status indicator (pending dashed border, confirmed solid)
  - [ ] Coach badge for classes/lessons
  - [ ] ✅ **Test**: Slots render with correct positioning
  - [ ] 🔍 **Code Review**: Review positioning calculations

- [ ] **4.3.2** Build BookingDetails panel
  - [ ] Create `src/components/bookings/BookingDetails.tsx`
  - [ ] Slide-in panel from right (desktop) or bottom sheet (mobile)
  - [ ] Full booking information display
  - [ ] Participants list for group classes
  - [ ] Action buttons: Edit, Duplicate, Cancel, Delete
  - [ ] Close button and backdrop click to close
  - [ ] ✅ **Test**: Panel opens and closes correctly
  - [ ] 🔍 **Code Review**: Review animation and accessibility

- [ ] **4.3.3** Implement click interactions
  - [ ] Single click on slot → Open BookingDetails
  - [ ] Double click on slot → Open BookingForm (edit mode)
  - [ ] Click on empty slot → Open BookingForm (create mode)
  - [ ] Keyboard: Enter to select, Escape to close
  - [ ] ✅ **Test**: All click interactions work
  - [ ] 🔍 **Code Review**: Review event delegation

#### 4.4 Booking Form & Creation
- [ ] **4.4.1** Build TimeSlotPicker component
  - [ ] Create `src/components/bookings/TimeSlotPicker.tsx`
  - [ ] Start time dropdown (07:00 - 21:30)
  - [ ] End time dropdown (auto-filtered based on start)
  - [ ] Duration quick-select buttons (1h, 1.5h, 2h)
  - [ ] Visual time range preview
  - [ ] ✅ **Test**: Time selection validates correctly
  - [ ] 🔍 **Code Review**: Review validation logic

- [ ] **4.4.2** Build BookingForm modal - Basic fields
  - [ ] Create `src/components/bookings/BookingForm.tsx`
  - [ ] Court selection (dropdown with availability indicator)
  - [ ] Date picker integration
  - [ ] Time slot picker integration
  - [ ] Booking type radio selection
  - [ ] ✅ **Test**: Form renders with all fields
  - [ ] 🔍 **Code Review**: Review form structure

- [ ] **4.4.3** Build BookingForm - Type-specific fields
  - [ ] **Rental**: Player selection (searchable dropdown), contact info
  - [ ] **Group Class**: Group selection, coach selection, max participants
  - [ ] **Private Lesson**: Player selection, coach selection, objectives
  - [ ] Conditional field rendering based on type
  - [ ] ✅ **Test**: Fields show/hide based on type
  - [ ] 🔍 **Code Review**: Review conditional logic

- [ ] **4.4.4** Build BookingForm - Notes and status
  - [ ] Notes textarea (optional)
  - [ ] Status selection (pending, confirmed)
  - [ ] Total duration display
  - [ ] Form validation summary
  - [ ] Submit and cancel buttons
  - [ ] ✅ **Test**: Full form validation works
  - [ ] 🔍 **Code Review**: Review validation messages

- [ ] **4.4.5** Create booking server actions
  - [ ] Create `src/lib/actions/bookings.ts`
  - [ ] `getBookingsByDateRange(startDate, endDate)` - Week bookings
  - [ ] `getBookingById(id)` - Single booking with relations
  - [ ] `createBooking(data)` - Create with conflict check
  - [ ] `updateBooking(id, data)` - Update with conflict check
  - [ ] `cancelBooking(id)` - Soft cancel (set status)
  - [ ] `deleteBooking(id)` - Hard delete
  - [ ] ✅ **Test**: All actions work with Supabase
  - [ ] 🔍 **Code Review**: Review SQL queries and RLS

- [ ] **4.4.6** Integrate BookingForm with actions
  - [ ] Wire up form submit to createBooking/updateBooking
  - [ ] Implement optimistic updates for instant feedback
  - [ ] Success toast and calendar refresh
  - [ ] Error handling with user-friendly messages
  - [ ] ✅ **Test**: Full create/edit flow works
  - [ ] 🔍 **Code Review**: Review error handling

#### 4.5 Conflict Detection
- [ ] **4.5.1** Build conflict detection utilities
  - [ ] Create `src/lib/utils/conflicts.ts`
  - [ ] `checkCourtConflict(courtId, date, startTime, endTime, excludeBookingId?)`
  - [ ] `checkCoachConflict(coachId, date, startTime, endTime, excludeBookingId?)`
  - [ ] `checkGroupConflict(groupId, date, startTime, endTime, excludeBookingId?)`
  - [ ] `checkPlayerConflict(playerId, date, startTime, endTime)` - Warning only
  - [ ] ✅ **Test**: Unit tests for all conflict scenarios
  - [ ] 🔍 **Code Review**: Review conflict logic completeness

- [ ] **4.5.2** Build ConflictIndicator component
  - [ ] Create `src/components/bookings/ConflictIndicator.tsx`
  - [ ] Red warning badge/tooltip
  - [ ] List of conflicts found
  - [ ] Suggestions (e.g., "Court 2 is available at this time")
  - [ ] ✅ **Test**: Indicator shows for conflicts
  - [ ] 🔍 **Code Review**: Review UX of conflict display

- [ ] **4.5.3** Integrate conflict detection in form
  - [ ] Real-time conflict check as user selects options
  - [ ] Prevent submit if hard conflicts exist
  - [ ] Show warning for soft conflicts (player double-booking)
  - [ ] Visual highlighting of conflicting time slots
  - [ ] ✅ **Test**: Conflicts prevent invalid bookings
  - [ ] 🔍 **Code Review**: Review conflict integration

#### 4.6 Recurring Bookings
- [ ] **4.6.1** Build RecurringForm component
  - [ ] Create `src/components/bookings/RecurringForm.tsx`
  - [ ] Recurring toggle checkbox
  - [ ] Frequency selection (weekly, biweekly, monthly)
  - [ ] Day of week selection (for weekly)
  - [ ] End date or occurrence count
  - [ ] Preview of generated dates
  - [ ] ✅ **Test**: Pattern generates correct dates
  - [ ] 🔍 **Code Review**: Review pattern generation

- [ ] **4.6.2** Implement recurring booking creation
  - [ ] Generate all booking instances from pattern
  - [ ] Conflict check for all instances
  - [ ] Batch insert to database
  - [ ] Link bookings with recurring_pattern JSONB
  - [ ] ✅ **Test**: Recurring bookings created correctly
  - [ ] 🔍 **Code Review**: Review batch operations

- [ ] **4.6.3** Implement recurring booking management
  - [ ] "This occurrence" vs "All occurrences" edit options
  - [ ] Add exceptions to pattern (skip dates)
  - [ ] Cancel series functionality
  - [ ] Visual indicator for recurring bookings
  - [ ] ✅ **Test**: Edit/cancel affects correct bookings
  - [ ] 🔍 **Code Review**: Review series management logic

#### 4.7 Advanced Features
- [ ] **4.7.1** Build BookingFilters component
  - [ ] Create `src/components/bookings/BookingFilters.tsx`
  - [ ] Filter by booking type (checkboxes)
  - [ ] Filter by court (multi-select)
  - [ ] Filter by coach (dropdown)
  - [ ] Filter by status
  - [ ] Quick filter presets (My Classes, Rentals Today)
  - [ ] ✅ **Test**: Filters apply correctly
  - [ ] 🔍 **Code Review**: Review filter logic

- [ ] **4.7.2** Implement drag-and-drop (Optional Enhancement)
  - [ ] Install drag library (dnd-kit or react-dnd)
  - [ ] Drag booking to different time slot
  - [ ] Drag booking to different court
  - [ ] Visual drop target indicators
  - [ ] Conflict check on drop
  - [ ] Undo action for accidental moves
  - [ ] ✅ **Test**: Drag operations work smoothly
  - [ ] 🔍 **Code Review**: Review drag implementation

- [ ] **4.7.3** Build mobile day view
  - [ ] Create `src/components/bookings/DayView.tsx`
  - [ ] Single day with all courts as tabs or accordion
  - [ ] Swipe gestures for day navigation
  - [ ] Touch-friendly booking interactions
  - [ ] Responsive breakpoint switching
  - [ ] ✅ **Test**: Mobile view works on touch devices
  - [ ] 🔍 **Code Review**: Review touch interactions

- [ ] **4.7.4** Implement keyboard navigation
  - [ ] Arrow keys to navigate time slots
  - [ ] Enter to select/open booking
  - [ ] Escape to close modals/panels
  - [ ] Tab to move between elements
  - [ ] Shortcut: N for new booking
  - [ ] Shortcut: T for today
  - [ ] ✅ **Test**: All keyboard shortcuts work
  - [ ] 🔍 **Code Review**: Review accessibility compliance

#### 4.8 Polish & Performance
- [ ] **4.8.1** Add loading states
  - [ ] Calendar skeleton loader
  - [ ] Booking form loading overlay
  - [ ] Inline loading for slot operations
  - [ ] Optimistic update visual feedback
  - [ ] ✅ **Test**: Loading states show appropriately
  - [ ] 🔍 **Code Review**: Review loading UX

- [ ] **4.8.2** Add empty states
  - [ ] No courts configured message
  - [ ] No bookings this week message
  - [ ] No results for filter message
  - [ ] Helpful CTAs in empty states
  - [ ] ✅ **Test**: Empty states render correctly
  - [ ] 🔍 **Code Review**: Review empty state copy

- [ ] **4.8.3** Add error handling
  - [ ] Network error recovery
  - [ ] Validation error display
  - [ ] Conflict error messages
  - [ ] Retry mechanisms
  - [ ] Error boundary for calendar
  - [ ] ✅ **Test**: Errors handled gracefully
  - [ ] 🔍 **Code Review**: Review error UX

- [ ] **4.8.4** Performance optimization
  - [ ] Memoize expensive calculations
  - [ ] Virtualize long court lists
  - [ ] Debounce filter changes
  - [ ] Lazy load booking details
  - [ ] Cache API responses
  - [ ] ✅ **Test**: Performance metrics acceptable
  - [ ] 🔍 **Code Review**: Review performance patterns

#### 4.9 Final Testing & Code Review
- [ ] **4.9.1** Unit tests
  - [ ] Test all utility functions
  - [ ] Test conflict detection logic
  - [ ] Test time calculation helpers
  - [ ] Test recurring pattern generation
  - [ ] Target: 80%+ coverage

- [ ] **4.9.2** Component tests
  - [ ] Test BookingSlot rendering
  - [ ] Test BookingForm validation
  - [ ] Test CalendarGrid interactions
  - [ ] Test BookingFilters state
  - [ ] Use React Testing Library

- [ ] **4.9.3** Integration tests
  - [ ] Test booking CRUD with Supabase
  - [ ] Test conflict detection with real data
  - [ ] Test recurring booking creation
  - [ ] Test filter + data combinations

- [ ] **4.9.4** E2E tests (Playwright)
  - [ ] Test full booking creation flow
  - [ ] Test booking edit flow
  - [ ] Test recurring booking flow
  - [ ] Test conflict scenarios
  - [ ] Test mobile responsive behavior

- [ ] **4.9.5** Final code review
  - [ ] Review all components for consistency
  - [ ] Review accessibility compliance (WCAG 2.1 AA)
  - [ ] Review i18n completeness
  - [ ] Review error handling coverage
  - [ ] Review security (RLS, input sanitization)
  - [ ] Review TypeScript strictness
  - [ ] Review code documentation
  - [ ] Run ESLint and fix issues
  - [ ] Run build and verify no errors

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

## Development Workflow Notes

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
