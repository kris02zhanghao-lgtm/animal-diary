## 1. Core Achievement Detection Logic

- [x] 1.1 Create `src/services/achievementRules.js` with pure functions for 5 achievements
  - Export `ACHIEVEMENTS` constant with definitions (name, description, condition, icon)
  - Implement `checkCatColorMaster(records)` — detect 5+ cat colors
  - Implement `checkNightOwl(records)` — detect records between 22:00-06:00
  - Implement `checkOldFriend(records)` — detect location with 3+ records
  - Implement `checkWorldTraveler(records)` — detect 2+ cities
  - Implement `checkRecordManiac(records)` — detect 50+ total records
  - Export `detectAchievements(records)` — run all checks, return array of unlocked achievement IDs

- [x] 1.2 Create unit tests for achievementRules.js
  - Test each achievement function with boundary conditions (0, at-threshold, above-threshold)
  - Test with empty records array
  - Test time window filtering scenarios

## 2. Service Layer

- [x] 2.1 Create `src/services/achievementService.js`
  - Implement `getAchievements(records)` — wrapper around detectAchievements with error handling
  - Implement `compareAchievements(prev, current)` — returns newly unlocked achievements
  - Use existing requestJson pattern if backend API needed (optional for v0.9)

## 3. UI Components

- [x] 3.1 Create `src/components/AchievementModal.jsx`
  - Fixed position modal with fade-in overlay + zoom-in content animation
  - Displays achievement name, description, icon, progress (if locked), unlock date (if unlocked)
  - Click outside or close button to dismiss
  - Props: `{ achievement, isOpen, onClose, progress }`
  - Reuse styling pattern from ShareModal and ReturningSuggestionModal

- [x] 3.2 Create `src/components/AchievementBadge.jsx`
  - Individual achievement display component
  - Shows name, icon, locked/unlocked state
  - Clickable to open AchievementModal
  - Props: `{ achievement, isUnlocked, onClick, progress }`

- [x] 3.3 Create `src/components/AchievementSection.jsx`
  - Container for achievement display in Report Page
  - Renders grid/flex layout of badges
  - Handles empty state ("还没有解锁成就呢")
  - Props: `{ achievements, unlockedIds, onBadgeClick }`

## 4. Report Page Integration

- [x] 4.1 Modify `src/pages/ReportPage.jsx`
  - Add state: `achievements`, `unlockedAchievements`, `selectedAchievement`
  - Add state: `previousUnlockedAchievements` for change detection
  - Call `detectAchievements(report.records)` when report data loads
  - Compare with previous state to detect new unlocks
  - Insert AchievementSection after existing sections (above InsightsSection)
  - Recalculate achievements when timeRange changes

- [x] 4.2 Create unlock notification trigger in ReportPage
  - Detect newly unlocked achievements by comparing with previous state
  - Show unlock modal automatically when new achievement detected
  - Auto-dismiss after 3 seconds or on user action
  - Handle edge case: ignore unlocks on first page load (compare only if previousUnlockedAchievements exists)

## 5. Styling and Animations

- [x] 5.1 Add `bounce-in` keyframe to `src/index.css`
  - Optional enhancement for unlock animation (can use zoom-in initially)
  - Define: opacity 0→1, scale 0.7→1.08→1

- [x] 5.2 Verify CSS classes for achievement badges
  - Use existing `.animal-card` or define new `achievement-badge` class
  - Color scheme: warm palette (#f7f3df, #fffdf7), muted gray for locked
  - Ensure z-index alignment (modal z-[120], overlay proper stacking)

## 6. Integration and Testing

- [ ] 6.1 End-to-end testing
  - Save 5+ records with different cat colors → verify Cat Color Master unlocks
  - Save record at 23:00 → verify Night Owl unlocks
  - Save 3+ records at same location → verify Old Friend unlocks
  - Save records in different cities → verify World Traveler unlocks
  - Save 50+ records → verify Record Maniac unlocks

- [ ] 6.2 Interaction testing
  - Click achievement badge → modal opens
  - Click outside modal → modal closes
  - Switch time window → achievements recalculate
  - Save new record → report page auto-refresh detects new unlocks

- [ ] 6.3 Edge case testing
  - Time window boundary (end-of-month, year transition)
  - Empty records → no achievements display
  - Multiple simultaneous unlocks → display order/sequencing
  - Back/forward navigation → state persistence

## 7. Code Quality

- [x] 7.1 ESLint check
  - Run `npm run lint` on modified files
  - Fix any warnings in achievementRules, achievementService, new components

- [x] 7.2 Type safety (if using JSDoc or TypeScript)
  - Add JSDoc comments to achievement functions
  - Document record object structure expected by detection functions

## 8. Documentation

- [x] 8.1 Update progress.md
  - Add achievement system details to v0.9 completed section
  - Note any known limitations or future improvements

- [x] 8.2 Update codebase comments (minimal)
  - Add brief explanation in achievementRules for complex logic (e.g., city extraction)
