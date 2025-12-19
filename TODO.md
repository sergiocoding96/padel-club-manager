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

### Feature 5: Attendance System ⭐ COMPREHENSIVE PLAN

> **Status**: 🚧 In Development
> **Priority**: High
> **Estimated Complexity**: Large Feature
> **Dependencies**: Players, Groups, Bookings, Courts (database tables exist)

---

#### 📋 Phase 5.0: Foundation & Prerequisites

##### 5.0.1 Database & Types Setup
- [ ] Create TypeScript types for all database tables (`src/types/database.ts`)
  - [ ] Player, Coach, Court, Group, GroupPlayer types
  - [ ] Booking type with all booking_type variants
  - [ ] Attendance type with status enum
  - [ ] AttendanceWithRelations (joined with player, booking, coach)
  - **Testing**: Verify types match Supabase schema
  - **Code Review**: Ensure types are strict and comprehensive

- [ ] Set up Supabase client (`src/lib/supabase/client.ts`)
  - [ ] Browser client configuration
  - [ ] Server client configuration
  - [ ] Type-safe database queries
  - **Testing**: Test connection to Supabase
  - **Code Review**: Verify environment variable handling

- [ ] Add attendance migration enhancement (`supabase/migrations/002_attendance_enhancements.sql`)
  - [ ] Add `check_in_method` column ('coach' | 'self' | 'auto')
  - [ ] Add `excused` to status enum
  - [ ] Add `check_in_time` timestamp for late detection
  - [ ] Add RLS policies for attendance
  - **Testing**: Run migration, verify schema changes
  - **Code Review**: Review SQL for security

##### 5.0.2 Internationalization Setup
- [ ] Add comprehensive attendance translations
  - [ ] English translations (`messages/en.json`)
  - [ ] Spanish translations (`messages/es.json`)
  - [ ] Include all status labels, actions, stats, errors
  - **Testing**: Verify all keys render correctly
  - **Code Review**: Check for missing translations

---

#### 📋 Phase 5.1: Core UI Components (Impressive & Reusable)

##### 5.1.1 AttendanceStatusBadge Component
- [ ] Create `src/components/attendance/AttendanceStatusBadge.tsx`
  - [ ] Status variants: pending, present, late, absent, excused
  - [ ] Color coding per status (stone, green, amber, red, blue)
  - [ ] Icon support (CheckCircle, Clock, XCircle, AlertCircle)
  - [ ] Size variants: sm, md, lg
  - [ ] Animated pulse for pending status
  - **Testing**: Visual regression tests, all variants
  - **Code Review**: Accessibility (ARIA labels)

##### 5.1.2 AttendanceQuickActions Component
- [ ] Create `src/components/attendance/AttendanceQuickActions.tsx`
  - [ ] One-click status buttons (Present, Late, Absent, Excused)
  - [ ] Visual feedback on selection (scale, shadow)
  - [ ] Tooltip descriptions
  - [ ] Keyboard navigation support
  - [ ] Optimistic UI updates
  - **Testing**: Click handling, state updates
  - **Code Review**: UX flow validation

##### 5.1.3 AttendancePlayerRow Component
- [ ] Create `src/components/attendance/AttendancePlayerRow.tsx`
  - [ ] Player avatar with level badge
  - [ ] Player name and contact info
  - [ ] Current attendance status badge
  - [ ] Quick action buttons inline
  - [ ] Notes input (expandable)
  - [ ] Last attendance info tooltip
  - [ ] Swipe gestures for mobile (mark present/absent)
  - **Testing**: Responsive design, mobile interactions
  - **Code Review**: Performance (memo optimization)

##### 5.1.4 AttendanceCard Component
- [ ] Create `src/components/attendance/AttendanceCard.tsx`
  - [ ] Booking info header (date, time, court)
  - [ ] Group/coach info section
  - [ ] Player list with attendance rows
  - [ ] Progress bar showing marked vs total
  - [ ] Bulk actions footer
  - [ ] Collapse/expand animation
  - [ ] Color-coded border by completion status
  - **Testing**: Data binding, calculations
  - **Code Review**: Component composition

##### 5.1.5 AttendanceCalendarHeatmap Component ⭐
- [ ] Create `src/components/attendance/AttendanceCalendarHeatmap.tsx`
  - [ ] GitHub-style contribution heatmap
  - [ ] Color intensity based on attendance rate
  - [ ] Day-by-day breakdown on hover
  - [ ] Week/month/year view toggle
  - [ ] Legend with color scale
  - [ ] Click to drill down to specific day
  - [ ] Responsive grid layout
  - **Testing**: Date calculations, color scaling
  - **Code Review**: Performance with large datasets

##### 5.1.6 AttendanceStatsWidget Component ⭐
- [ ] Create `src/components/attendance/AttendanceStatsWidget.tsx`
  - [ ] Circular progress ring for attendance rate
  - [ ] Animated percentage counter
  - [ ] Sessions attended / total sessions
  - [ ] Streak counter (consecutive attendances)
  - [ ] Trend indicator (up/down arrow)
  - [ ] Comparison to group/club average
  - [ ] Mini sparkline chart
  - **Testing**: Statistical calculations
  - **Code Review**: Animation performance

##### 5.1.7 AttendanceHistoryTable Component
- [ ] Create `src/components/attendance/AttendanceHistoryTable.tsx`
  - [ ] Sortable columns (date, status, group, coach)
  - [ ] Filter by status, date range, group
  - [ ] Search functionality
  - [ ] Pagination with page size options
  - [ ] Export button integration
  - [ ] Empty state illustration
  - [ ] Loading skeleton
  - **Testing**: Sorting, filtering, pagination
  - **Code Review**: Query optimization

##### 5.1.8 AttendanceBulkActions Component
- [ ] Create `src/components/attendance/AttendanceBulkActions.tsx`
  - [ ] "Mark All Present" button
  - [ ] "Mark All Absent" button
  - [ ] Selection mode with checkboxes
  - [ ] Confirmation modal for bulk actions
  - [ ] Undo functionality (5-second window)
  - **Testing**: Bulk operations, undo logic
  - **Code Review**: Edge cases handling

##### 5.1.9 AttendanceExportButton Component
- [ ] Create `src/components/attendance/AttendanceExportButton.tsx`
  - [ ] Export to CSV format
  - [ ] Export to PDF report
  - [ ] Date range selector in modal
  - [ ] Include/exclude columns options
  - [ ] Download progress indicator
  - **Testing**: File generation, data integrity
  - **Code Review**: Memory usage for large exports

##### 5.1.10 Component Barrel Export
- [ ] Create `src/components/attendance/index.ts`
  - [ ] Export all components
  - **Testing**: Import verification
  - **Code Review**: Named exports consistency

---

#### 📋 Phase 5.2: Attendance Pages & Routes

##### 5.2.1 Attendance Dashboard Page ⭐
- [ ] Create `src/app/attendance/page.tsx`
  - [ ] Today's sessions overview
  - [ ] Upcoming sessions list (next 24 hours)
  - [ ] Quick stats cards (today's attendance rate)
  - [ ] Sessions requiring attention (pending attendance)
  - [ ] Recent activity feed
  - [ ] Quick access buttons
  - [ ] Responsive grid layout
  - **Testing**: Data loading, empty states
  - **Code Review**: Server/client component split

##### 5.2.2 Attendance Dashboard Layout
- [ ] Create `src/app/attendance/layout.tsx`
  - [ ] Navigation tabs (Dashboard, Calendar, Reports)
  - [ ] Breadcrumb navigation
  - [ ] Quick search bar
  - **Testing**: Navigation flow
  - **Code Review**: Layout composition

##### 5.2.3 Mark Attendance Page (Booking View) ⭐
- [ ] Create `src/app/attendance/booking/[id]/page.tsx`
  - [ ] Full booking details header
  - [ ] Court and time information
  - [ ] Coach assignment display
  - [ ] Player attendance list with quick actions
  - [ ] Notes section for booking
  - [ ] Confirmation/save button
  - [ ] Auto-save functionality
  - [ ] Print-friendly view
  - **Testing**: CRUD operations, validation
  - **Code Review**: Error handling

##### 5.2.4 Attendance Calendar Page ⭐
- [ ] Create `src/app/attendance/calendar/page.tsx`
  - [ ] Full calendar heatmap view
  - [ ] Day/week/month toggles
  - [ ] Filter by group, coach, player
  - [ ] Legend with attendance rates
  - [ ] Click to view day details
  - [ ] Mini stats sidebar
  - **Testing**: Date navigation, filters
  - **Code Review**: Calendar performance

##### 5.2.5 Attendance Reports Page
- [ ] Create `src/app/attendance/reports/page.tsx`
  - [ ] Report type selector (player, group, coach, overall)
  - [ ] Date range picker
  - [ ] Visual charts and graphs
  - [ ] Top attendees leaderboard
  - [ ] Absence patterns analysis
  - [ ] Export options
  - [ ] Print stylesheet
  - **Testing**: Report generation, data accuracy
  - **Code Review**: Analytics logic

##### 5.2.6 Player Attendance History Page
- [ ] Create `src/app/players/[id]/attendance/page.tsx`
  - [ ] Player profile header
  - [ ] Attendance stats widget
  - [ ] Calendar heatmap for player
  - [ ] History table with filters
  - [ ] Attendance rate trend chart
  - [ ] Comparison to group average
  - **Testing**: Player-specific queries
  - **Code Review**: Data privacy considerations

##### 5.2.7 Group Attendance Overview Page
- [ ] Create `src/app/groups/[id]/attendance/page.tsx`
  - [ ] Group info header
  - [ ] Group-wide statistics
  - [ ] Player comparison table
  - [ ] Session-by-session breakdown
  - [ ] Low attendance alerts
  - [ ] Auto-cancel threshold indicator
  - **Testing**: Group aggregations
  - **Code Review**: Performance with many players

---

#### 📋 Phase 5.3: Server Actions & API

##### 5.3.1 Attendance Server Actions
- [ ] Create `src/app/attendance/actions.ts`
  - [ ] `markAttendance(bookingId, playerId, status, notes)`
  - [ ] `bulkMarkAttendance(bookingId, playerStatuses[])`
  - [ ] `getBookingAttendance(bookingId)`
  - [ ] `getPlayerAttendanceHistory(playerId, filters)`
  - [ ] `getGroupAttendanceStats(groupId, dateRange)`
  - [ ] `getTodaysSessions()`
  - [ ] `getAttendanceRate(playerId | groupId, dateRange)`
  - **Testing**: All actions with mocked data
  - **Code Review**: Error handling, validation

##### 5.3.2 Attendance Utilities
- [ ] Create `src/lib/attendance.ts`
  - [ ] `calculateAttendanceRate(attendances[])`
  - [ ] `getAttendanceStreak(playerId)`
  - [ ] `shouldAutoCancel(bookingId, threshold)`
  - [ ] `getAbsencePattern(playerId)` - day of week analysis
  - [ ] `formatAttendanceForExport(attendances[])`
  - [ ] `generateCSVReport(data, columns)`
  - [ ] `generatePDFReport(data, options)` - using jsPDF or similar
  - **Testing**: Unit tests for all utilities
  - **Code Review**: Algorithm correctness

---

#### 📋 Phase 5.4: Self Check-in Feature

##### 5.4.1 Self Check-in API
- [ ] Create self check-in server action
  - [ ] Verify player identity
  - [ ] Check booking exists and player is registered
  - [ ] Validate time window (e.g., 30 min before to 15 min after)
  - [ ] Record check-in method as 'self'
  - [ ] Optional: QR code validation
  - **Testing**: Time window validation, authorization
  - **Code Review**: Security audit

##### 5.4.2 Self Check-in UI (Player View)
- [ ] Create self check-in component/page
  - [ ] Player's upcoming sessions list
  - [ ] "I'm Here" button for eligible sessions
  - [ ] Confirmation animation
  - [ ] Already checked-in state
  - [ ] Time window countdown
  - **Testing**: Mobile responsiveness
  - **Code Review**: UX flow

##### 5.4.3 QR Code Check-in (Optional Enhancement)
- [ ] Generate unique QR codes for sessions
- [ ] QR scanner integration
- [ ] Instant check-in on scan
- **Testing**: QR generation and scanning
- **Code Review**: Security of QR tokens

---

#### 📋 Phase 5.5: Notifications & Automation

##### 5.5.1 Absence Notification System
- [ ] Create notification trigger for absences
- [ ] Email notification template
- [ ] In-app notification component
- [ ] Configurable notification preferences
- **Testing**: Notification delivery
- **Code Review**: Email security

##### 5.5.2 Auto-Cancel Logic
- [ ] Implement cancellation threshold check
- [ ] Create cancellation confirmation flow
- [ ] Notify affected players
- [ ] Update booking status
- [ ] Configurable per group
- **Testing**: Threshold calculations
- **Code Review**: Edge cases

##### 5.5.3 Reminder System
- [ ] Session reminder notifications
- [ ] Unmarked attendance reminders for coaches
- [ ] Weekly attendance summary emails
- **Testing**: Scheduling accuracy
- **Code Review**: Performance

---

#### 📋 Phase 5.6: Navigation & Integration

##### 5.6.1 Update Main Navigation
- [ ] Add "Attendance" to main nav menu
- [ ] Add attendance icon (ClipboardCheck from Lucide)
- [ ] Update nav translations
- **Testing**: Navigation flow
- **Code Review**: Consistency with existing nav

##### 5.6.2 Dashboard Integration
- [ ] Add attendance widget to main dashboard
- [ ] Quick access to today's sessions
- [ ] Pending attendance count badge
- **Testing**: Widget rendering
- **Code Review**: Dashboard layout

##### 5.6.3 Player Profile Integration
- [ ] Add attendance tab/section to player profile
- [ ] Show mini stats widget
- [ ] Link to full attendance history
- **Testing**: Profile page integration
- **Code Review**: Data loading strategy

##### 5.6.4 Group Management Integration
- [ ] Add attendance overview to group page
- [ ] Show group attendance rate
- [ ] Quick link to group attendance page
- **Testing**: Group page updates
- **Code Review**: Component reuse

---

#### 📋 Phase 5.7: Testing & Quality Assurance

##### 5.7.1 Unit Tests
- [ ] Test all attendance utility functions
- [ ] Test date/time calculations
- [ ] Test attendance rate algorithms
- [ ] Test export formatters
- [ ] Achieve >80% code coverage for utilities
- **Code Review**: Test quality and coverage

##### 5.7.2 Component Tests
- [ ] Test AttendanceStatusBadge variants
- [ ] Test AttendanceQuickActions interactions
- [ ] Test AttendancePlayerRow state changes
- [ ] Test AttendanceCard data binding
- [ ] Test AttendanceHistoryTable sorting/filtering
- **Code Review**: Test completeness

##### 5.7.3 Integration Tests
- [ ] Test server actions with database
- [ ] Test attendance marking flow
- [ ] Test bulk operations
- [ ] Test export functionality
- **Code Review**: Test reliability

##### 5.7.4 End-to-End Tests
- [ ] Test complete attendance marking workflow
- [ ] Test self check-in flow
- [ ] Test report generation
- [ ] Test calendar navigation
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- **Code Review**: E2E coverage

##### 5.7.5 Accessibility Testing
- [ ] Keyboard navigation for all components
- [ ] Screen reader compatibility
- [ ] Color contrast verification
- [ ] Focus management
- [ ] ARIA labels and roles
- **Code Review**: WCAG compliance

##### 5.7.6 Performance Testing
- [ ] Test with large datasets (1000+ attendance records)
- [ ] Measure page load times
- [ ] Profile component re-renders
- [ ] Test on low-end devices
- **Code Review**: Performance optimizations

---

#### 📋 Phase 5.8: Documentation & Final Review

##### 5.8.1 Code Documentation
- [ ] JSDoc comments for all functions
- [ ] README for attendance components
- [ ] API documentation for server actions
- [ ] Type documentation
- **Code Review**: Documentation completeness

##### 5.8.2 User Documentation
- [ ] Feature usage guide
- [ ] Coach workflow documentation
- [ ] Player self check-in guide
- [ ] FAQ section
- **Code Review**: Clarity and accuracy

##### 5.8.3 Final Code Review Checklist
- [ ] All components follow project conventions
- [ ] No TypeScript errors or warnings
- [ ] ESLint passes with no warnings
- [ ] All tests pass
- [ ] i18n complete (ES + EN)
- [ ] Responsive design verified
- [ ] Error boundaries in place
- [ ] Loading states implemented
- [ ] Empty states designed
- [ ] Performance acceptable
- [ ] Security review passed
- [ ] Accessibility verified

##### 5.8.4 Deployment Preparation
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Rollback plan documented
- [ ] Feature flag setup (if needed)
- **Code Review**: Deployment readiness

---

#### 🔧 Development Tools & Resources

**Recommended MCPs/Plugins:**
- Supabase MCP for database operations
- File system operations for code generation
- Git operations for version control

**Subagent Usage:**
- Use `Explore` agent for codebase analysis
- Use `Plan` agent for complex component design
- Use `general-purpose` agent for multi-step implementations

**External Libraries to Consider:**
- `recharts` or `chart.js` - For attendance charts
- `jspdf` + `jspdf-autotable` - PDF report generation
- `date-fns` - Date manipulation (already installed)
- `react-hot-toast` - Toast notifications
- `framer-motion` - Animations (optional)

**UI Inspiration:**
- GitHub contribution graph for heatmap
- Notion databases for table design
- Linear for quick actions UX
- Stripe dashboard for stats widgets

---

#### 📊 Success Metrics

- [ ] Attendance can be marked in <3 seconds
- [ ] Dashboard loads in <2 seconds
- [ ] 100% mobile responsive
- [ ] 0 accessibility violations
- [ ] >80% test coverage
- [ ] All translations complete
- [ ] Coach satisfaction feedback positive

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
