## MODIFIED Requirements

### Requirement: Record list view remains unchanged (MODIFIED)

The record list view (timeline with seasonal grouping and Swiper coverflow) SHALL remain as is. Pokedex is now accessed independently via bottom tab bar.

#### Scenario: Timeline view preserved
- **WHEN** user is on timeline tab
- **THEN** system displays records grouped by season (existing behavior preserved)
- **AND** Swiper coverflow effect continues to work
- **AND** no additional tab switching within timeline view

#### Scenario: Navigate to pokedex from bottom tab
- **WHEN** user clicks "图鉴" tab in bottom navigation bar
- **THEN** system switches to independent pokedex page
- **AND** returns to timeline when user clicks "时间线" tab
