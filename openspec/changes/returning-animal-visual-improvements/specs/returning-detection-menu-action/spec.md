## MODIFIED Requirements

### Requirement: Manual returning animal detection accessible from detail view
The system SHALL provide an easily discoverable way to manually trigger returning animal detection from a record's detail view. The detection action is now prominently placed in the detail view header rather than hidden in a menu.

#### Scenario: Primary detection button visible
- **WHEN** user views a record detail page
- **THEN** system displays a "🔍 查找回头客" button next to the "✏️ 编辑" button in the header, always visible and clickable

#### Scenario: Trigger detection from header button
- **WHEN** user clicks "🔍 查找回头客" button in the header
- **THEN** system triggers the manual returning detection flow (same as menu action), showing loading state and eventual feedback

#### Scenario: Menu option still available
- **WHEN** user opens the detail page menu (⋮ button)
- **THEN** system still displays "查找回头客" in the menu as a secondary option (for backward compatibility)

#### Scenario: Button state during detection
- **WHEN** detection is in progress
- **THEN** system disables the "查找回头客" button and shows a loading indicator to prevent multiple simultaneous requests
