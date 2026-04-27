## ADDED Requirements

### Requirement: Long press enters selection mode

The system SHALL enter selection mode when user long-presses (500ms) a photo in the species photo grid.

#### Scenario: Long press activates selection mode
- **WHEN** user long-presses a photo for 500ms
- **THEN** system enters selection mode
- **AND** the pressed photo is automatically selected
- **AND** each photo shows a circle indicator in the top-left corner (empty = unselected, green checkmark = selected)
- **AND** the top area shows a selection toolbar: "已选X张", "取消", "删除"

#### Scenario: Tap to toggle selection in selection mode
- **WHEN** user is in selection mode
- **AND** user taps a photo
- **THEN** system toggles that photo's selected state
- **AND** the selection count in the toolbar updates

#### Scenario: Tap cancel exits selection mode
- **WHEN** user is in selection mode
- **AND** user taps "取消"
- **THEN** system exits selection mode
- **AND** all selections are cleared
- **AND** toolbar reverts to normal back button and title

#### Scenario: Batch delete selected photos
- **WHEN** user has selected one or more photos
- **AND** user taps "删除" in the toolbar
- **THEN** system shows a confirmation dialog: "确认删除这X条偶遇记录？"
- **AND** user confirms
- **THEN** system deletes all selected records
- **AND** exits selection mode
- **AND** refreshes the photo grid

#### Scenario: All photos of a species deleted
- **WHEN** batch delete removes all photos of the current species
- **THEN** system automatically returns to the species card grid (layer 1)
