# v0.6 Encounter Report Implementation Tasks

## 1. Create Service Layer

- [ ] 1.1 Create `src/services/reportService.js` with `generateReport(timeRange)` function
  - Accept `timeRange` parameter: "recent3months" | "naturalYear"
  - Return object: `{ total, topSpecies, topLocations, mostActiveMonth, hasData, status }`
  - Query Supabase records table with appropriate date filters
  - Handle edge cases: no data, insufficient data, empty results
  
- [ ] 1.2 Implement `calculateDateRange(timeRange)` helper function
  - For "recent3months": calculate date 90 days ago or 3 calendar months ago
  - For "naturalYear": return Jan 1 - Dec 31 of current year
  - Return `{ startDate, endDate }` as ISO strings

- [ ] 1.3 Implement data aggregation functions:
  - `aggregateSpecies(records)`: return array of `{ species, count }` sorted by count desc, top 3
  - `aggregateLocations(records)`: return array of `{ location, count }` sorted by count desc, top 3
  - `aggregateMonths(records)`: return array of `{ month, count }`, find max

## 2. Create Report Page Component

- [ ] 2.1 Create `src/pages/ReportPage.jsx`
  - Use `useState` for `timeRange` state (default: "recent3months")
  - Call `generateReport(timeRange)` on mount and when timeRange changes
  - Handle loading state while fetching data

- [ ] 2.2 Implement time window toggle UI
  - Two buttons: "最近三个月" | "自然年"
  - Active button style highlight
  - onClick handler updates `timeRange` state

- [ ] 2.3 Implement report content rendering
  - **Empty state (no data):**
    - If total === 0: show "还没有偶遇呢，去记录你的第一次发现吧 🐾"
    - If total < 5: show "数据还在积累，继续探索城市吧"
  
  - **Report display (data >= 5):**
    - Hero stat: Large number with text "你[period]遇见了 X 只动物"
    - Top species card: list up to 3 species with counts
    - Top locations card: list up to 3 locations with counts
    - Most active month card: "最活跃的月份是 XX月，遇见了 Y 只"
    - Footer: "数据更新于 HH:mm"

- [ ] 2.4 Style component with Tailwind CSS
  - Match star valley UI theme (warm colors, card layout)
  - Use emoji decorations (🐾 🗺️ 📊)
  - Responsive layout: mobile-first, works on all screen sizes
  - Card-based design consistent with existing UI

## 3. Integrate Navigation

- [ ] 3.1 Modify `src/components/BottomTabBar.jsx`
  - Add new tab entry: `{ id: 'report', icon: '📊', label: '报告' }`
  - Update tab list to include report between collection and create (or at end)
  - Ensure all 5 tabs visible and clickable

- [ ] 3.2 Modify `src/App.jsx`
  - Add `currentTab === 'report'` condition to render ReportPage
  - Ensure ReportPage receives necessary props (user auth, etc.)
  - Update navigation logic to handle report tab clicks

- [ ] 3.3 Test navigation flow
  - Click each tab and verify correct page renders
  - Verify report tab shows report icon and is highlighted when active

## 4. Data Integration & Verification

- [ ] 4.1 Test reportService with real Supabase data
  - Verify date range calculations are correct
  - Verify species/location aggregation counts match actual records
  - Log sample output to console for manual verification

- [ ] 4.2 Test with various data scenarios
  - Zero records: empty state displays correctly
  - 1-4 records: "insufficient data" state displays
  - 5+ records: full report displays with correct data
  - Multiple species: top 3 sorted correctly
  - Same location multiple times: counts accumulate

- [ ] 4.3 Verify time window switching
  - Switch between "recent 3 months" and "natural year" shows different data
  - Most active month changes appropriately
  - Total counts update correctly

## 5. Testing & Polish

- [ ] 5.1 Local testing on desktop
  - Load page, verify all UI elements render
  - Check responsive behavior at different viewport widths
  - Verify no console errors

- [ ] 5.2 Mobile testing
  - Test on phone/tablet viewport
  - Verify BottomTabBar doesn't obscure content
  - Verify touch interactions work (button clicks)

- [ ] 5.3 Verify Vercel deployment
  - Deploy to staging/production
  - Verify report page loads and shows data correctly
  - Check data freshness after adding new records

## 6. Documentation & Completion

- [ ] 6.1 Update progress.md with v0.6 completion status
  - Note: Encounter Report feature completed
  - List files created/modified
  - Any known limitations or follow-ups

- [ ] 6.2 Verify git commit message
  - Include feature summary and file changes
