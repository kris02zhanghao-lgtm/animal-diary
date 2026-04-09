## ADDED Requirements

### Requirement: App manages current page via state
The app SHALL use React `useState` in `App.jsx` to track which page is currently visible. Valid states are `"list"` and `"new"`. The default state SHALL be `"list"`.

#### Scenario: App loads showing list page
- **WHEN** the user opens the app
- **THEN** the list page is displayed by default

### Requirement: Navigate to new encounter page
The app SHALL navigate to `NewEncounterPage` when the user triggers the new encounter action.

#### Scenario: User taps "+" button
- **WHEN** the user taps the "+" button on the list page
- **THEN** the app transitions to show `NewEncounterPage`

### Requirement: Navigate back to list page
The app SHALL return to `ListPage` when the user triggers the back action from the new encounter page.

#### Scenario: User taps back arrow
- **WHEN** the user taps the back arrow button on `NewEncounterPage`
- **THEN** the app transitions back to show `ListPage`
