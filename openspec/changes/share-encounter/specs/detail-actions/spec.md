## MODIFIED Requirements

### Requirement: Detail Page Menu Options
The system SHALL display a context menu (⋮) on the detail/expanded view of an encounter record. The menu SHALL include options for user actions.

#### Scenario: Detail page menu displays all available actions
- **WHEN** user views an encounter in expanded detail view
- **THEN** menu button (⋮) displays options: "分享" | "删除"

#### Scenario: User can share from detail page menu
- **WHEN** user clicks "分享" option in detail page menu
- **THEN** system opens a share card modal for that encounter record
  - Share card contains photo, species, location, date, journal

#### Scenario: User can delete from detail page menu
- **WHEN** user clicks "删除" option in detail page menu
- **THEN** system displays delete confirmation modal (existing behavior unchanged)

#### Scenario: Menu closes after action
- **WHEN** user selects any menu option
- **THEN** menu closes and corresponding modal/action triggers
