## ADDED Requirements

### Requirement: Display page title
The list page SHALL display the title "我的动物图鉴" at the top using a pixel-style font.

#### Scenario: User opens list page
- **WHEN** the list page is rendered
- **THEN** the title "我的动物图鉴" is visible at the top in pixel font

### Requirement: Show empty state when no records exist
When there are no encounter records, the list page SHALL display an empty state with an illustration and prompt text.

#### Scenario: No records exist
- **WHEN** the list page is rendered with zero encounter records
- **THEN** an animal emoji illustration (草丛探头小动物) and the text "还没有偶遇记录，出门遇见小动物拍一张吧～" are displayed

### Requirement: Floating action button to add new encounter
The list page SHALL display a circular green "+" button fixed at the bottom-right of the screen.

#### Scenario: User sees the add button
- **WHEN** the list page is rendered
- **THEN** a circular warm-green "+" button is visible at the bottom-right corner

#### Scenario: User taps the add button
- **WHEN** the user taps the "+" button
- **THEN** the app navigates to NewEncounterPage

### Requirement: Animal record cards use pixel-style frame
Each animal encounter record SHALL be displayed as a card with a 3px dark-brown border and a 4px bottom-right offset solid shadow.

#### Scenario: Record card renders correctly
- **WHEN** an encounter record is displayed in the list
- **THEN** the card shows a 3px solid dark-brown border (`#5a4a3a`) and a `4px 4px 0px #5a4a3a` box-shadow

### Requirement: Page background color
The list page background SHALL use a warm off-white color (`#fffdf7`).

#### Scenario: Page renders with correct background
- **WHEN** the list page is displayed
- **THEN** the background color is `#fffdf7`
