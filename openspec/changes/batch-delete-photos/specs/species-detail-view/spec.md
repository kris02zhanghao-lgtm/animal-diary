## MODIFIED Requirements

### Requirement: Delete interaction changes from hover button to long-press selection (BREAKING)

The hover-based delete button on photo cards SHALL be removed. Deletion is now triggered exclusively via long-press selection mode.

#### Scenario: No delete button visible in normal state
- **WHEN** user views the species photo grid in normal mode
- **THEN** no delete button is visible on any photo card
- **AND** tapping a photo navigates to detail view (future)

#### Scenario: Delete only available in selection mode
- **WHEN** user wants to delete a photo
- **THEN** user must long-press to enter selection mode first
- **THEN** select photos and tap "删除" in the toolbar
