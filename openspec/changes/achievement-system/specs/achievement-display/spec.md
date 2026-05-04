## ADDED Requirements

### Requirement: Achievement section in Report Page
The system SHALL display achievements in the Report Page with unlocked achievements shown as badges.

#### Scenario: Display achievement badges
- **WHEN** user opens Report Page with achievements detected
- **THEN** achievements appear as a new section titled "你的成就"
- **AND** unlocked achievements are displayed as badges/cards
- **AND** locked achievements are visible but visually distinguished as locked

#### Scenario: Empty achievements state
- **WHEN** user has no unlocked achievements
- **THEN** achievement section shows a friendly message "还没有解锁成就呢"

#### Scenario: Partial achievements state
- **WHEN** user has some unlocked achievements
- **THEN** system displays unlocked achievements prominently
- **AND** locked achievements are shown below with different styling

### Requirement: Achievement details modal
The system SHALL allow users to click on achievements to view detailed information.

#### Scenario: Click to expand achievement details
- **WHEN** user clicks on an achievement badge/card
- **THEN** system displays a modal showing:
  - Achievement name and icon
  - Achievement description/story
  - Unlock condition (if locked)
  - Current progress (if locked)
  - Unlock date (if unlocked)

#### Scenario: Close achievement details modal
- **WHEN** user clicks the close button or clicks outside the modal
- **THEN** modal is dismissed
- **AND** focus returns to Report Page

### Requirement: Achievement badge styling
The system SHALL use consistent visual design for achievement badges aligned with existing UI patterns.

#### Scenario: Badge visual design
- **WHEN** achievements are displayed
- **THEN** unlocked badges use warm color palette (#f7f3df background, brand colors)
- **AND** locked badges use muted colors to show disabled state
- **AND** each badge displays achievement name and a symbolic icon/emoji

### Requirement: Achievements update on data changes
The system SHALL recalculate and refresh achievements when time window changes or new records are added.

#### Scenario: Time window switch triggers detection
- **WHEN** user switches between "最近三个月" and "自然年"
- **THEN** achievements are recalculated for the new time window
- **AND** achievement section updates to reflect new detection results

#### Scenario: Achievement refresh after saving record
- **WHEN** new record is successfully saved
- **THEN** Report Page automatically recalculates achievements on next view
- **AND** new unlocked achievements trigger unlock notification
