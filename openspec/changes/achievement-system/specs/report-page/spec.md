## MODIFIED Requirements

### Requirement: Report Page displays achievements section
The Report Page SHALL include a new section displaying user achievements alongside existing statistics and insights.

#### Scenario: Achievement section placement
- **WHEN** user views Report Page
- **THEN** achievement section appears above AI insights section
- **AND** section is titled "你的成就"
- **AND** achievements are displayed as a grid/flex layout of badges

#### Scenario: Achievement section with data
- **WHEN** user has unlocked achievements
- **THEN** unlocked achievements are displayed as interactive badges
- **AND** locked achievements are visible but visually distinguished
- **AND** each achievement shows name, icon, and unlock status

#### Scenario: Achievement section with no data
- **WHEN** user has no unlocked achievements
- **THEN** achievement section shows "还没有解锁成就呢" message
- **AND** locked achievements are not displayed

#### Scenario: Achievement visibility respects time window
- **WHEN** user switches between "最近三个月" and "自然年" time windows
- **THEN** achievements are recalculated based on filtered records
- **AND** achievement section updates to show new results
- **AND** loading state appears during recalculation

### Requirement: Report Page integrates achievement detection
The Report Page SHALL automatically detect achievements when loading data and track state changes.

#### Scenario: Initial achievement detection
- **WHEN** user navigates to Report Page
- **THEN** system loads records for current time window
- **AND** detects all achievements based on loaded records
- **AND** compares with previously detected achievements
- **AND** if new achievements found, triggers unlock notification

#### Scenario: Achievement detection on time window change
- **WHEN** user switches time window
- **THEN** Report Page calls achievement detection for new time window
- **AND** updates achievement display with new results
- **AND** shows loading indicator during detection

#### Scenario: Achievement state persistence in component
- **WHEN** user switches between pages and returns to Report Page
- **THEN** previously detected achievements are recalculated
- **AND** unlocks are re-evaluated based on current data state
