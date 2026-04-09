## ADDED Requirements

### Requirement: Display page header with back button and title
The new encounter page SHALL display a left-aligned back arrow button and the title "记录偶遇" in the header area.

#### Scenario: Header renders correctly
- **WHEN** NewEncounterPage is displayed
- **THEN** a back arrow (←) button is visible on the left and "记录偶遇" title is centered

#### Scenario: User taps back arrow
- **WHEN** the user taps the back arrow
- **THEN** the app navigates back to ListPage

### Requirement: Image upload area with preview
The page SHALL display a tappable image upload area. After an image is selected, a preview SHALL be shown in place of the upload prompt.

#### Scenario: Upload area shown before image selected
- **WHEN** no image has been selected
- **THEN** a tappable rectangular area with an upload icon and prompt text is displayed

#### Scenario: Image preview shown after selection
- **WHEN** the user taps the upload area and selects an image file
- **THEN** the selected image is displayed as a preview within the upload area

### Requirement: Location text input
The page SHALL include a text input field for the user to enter a location description.

#### Scenario: User enters location
- **WHEN** the user taps the location input and types text
- **THEN** the input field displays the typed location text

### Requirement: Generate log button
The page SHALL display a "生成日志" button below the form inputs.

#### Scenario: Button is visible
- **WHEN** NewEncounterPage is rendered
- **THEN** a "生成日志" button is displayed in warm-green, full-width

#### Scenario: User taps generate button
- **WHEN** the user taps "生成日志"
- **THEN** the button shows a loading state (placeholder for future AI integration)

### Requirement: Page background matches list page
The new encounter page background SHALL use the same warm off-white color (`#fffdf7`) as the list page.

#### Scenario: Consistent background
- **WHEN** NewEncounterPage is displayed
- **THEN** the background color is `#fffdf7`
