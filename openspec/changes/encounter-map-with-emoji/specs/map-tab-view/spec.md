# Map Tab View Capability

## ADDED Requirements

### Requirement: List page displays map and timeline tabs
The ListPage SHALL display two navigation tabs at the top: "时间线" and "地图". The "时间线" tab is active by default.

#### Scenario: Timeline tab is active on page load
- **WHEN** user loads the list page
- **THEN** the "时间线" tab is visually highlighted (border-bottom color change to primary color)
- **AND** the timeline view (seasonal groups with Swiper cards) is displayed

#### Scenario: User switches to map tab
- **WHEN** user clicks the "地图" tab
- **THEN** the tab becomes active (border-bottom color changes to primary color)
- **AND** the timeline view is hidden
- **AND** the map view is displayed

#### Scenario: User switches back to timeline tab
- **WHEN** user is viewing the map and clicks the "时间线" tab
- **THEN** the tab becomes active
- **AND** the map view is hidden
- **AND** the timeline view is displayed with the same record groups

### Requirement: Tab state persists during the session
The active tab SHALL persist within the same page session but does not need to persist across page refreshes.

#### Scenario: Tab state during navigation
- **WHEN** user switches to map tab
- **AND** clicks on a record marker to view details
- **AND** returns from the detail view
- **THEN** the map tab remains active

### Requirement: Tab styling matches design system
Both tabs SHALL use the design system colors and typography defined in the global style guide.

#### Scenario: Tab styling
- **WHEN** a tab is active
- **THEN** its text color is var(--text-primary)
- **AND** its bottom border is 3px solid var(--primary-color)
- **WHEN** a tab is inactive
- **THEN** its text color is var(--text-secondary)
- **AND** it has no border
