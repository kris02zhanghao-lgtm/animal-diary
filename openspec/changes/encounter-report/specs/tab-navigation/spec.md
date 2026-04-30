## MODIFIED Requirements

### Requirement: Bottom Navigation Tab Layout
The system SHALL display a bottom navigation bar with tabs for primary features. The tab list now includes: Timeline, Map, Create, Collection, and Report.

#### Scenario: Bottom tab bar displays all five tabs
- **WHEN** user views the app on any page
- **THEN** BottomTabBar displays exactly 5 icons in order: 时间线 | 地图 | ➕ | 图鉴 | 报告

#### Scenario: Report tab is clickable and navigates correctly
- **WHEN** user clicks the "报告" tab
- **THEN** app navigates to Report page and highlights the Report tab as active

#### Scenario: Tab styles remain consistent
- **WHEN** user views BottomTabBar
- **THEN** Report tab follows the same styling pattern as other tabs (active/inactive states, icons, labels)

#### Scenario: Mobile responsive layout
- **WHEN** user views the app on mobile (viewport < 768px)
- **THEN** BottomTabBar remains visible and all 5 tabs are accessible without horizontal scroll
