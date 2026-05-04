## ADDED Requirements

### Requirement: Display share collection button
The system SHALL display a share button on the collection page header.

#### Scenario: Share button is visible on collection page
- **WHEN** authenticated user navigates to Collection page
- **THEN** page header displays a "Share Collection" button or icon
- **THEN** button is prominently placed near the page title or in the top-right area
- **THEN** button is always accessible regardless of collection content

#### Scenario: User clicks share button
- **WHEN** user clicks "Share Collection" button
- **THEN** system opens a share modal/sheet with sharing options
- **THEN** modal does not block the underlying collection view

### Requirement: Share collection modal interactions
The system SHALL handle three states in the share modal: unshared, shared (with link), and loading.

#### Scenario: User generates share token for first time
- **WHEN** share modal opens and user has no existing token
- **THEN** modal displays "Generate Share Link" button and explanation text
- **WHEN** user clicks "Generate Share Link"
- **THEN** modal shows loading state briefly
- **THEN** modal displays the generated URL, "Copy Link" button, and "Generate Share Card" button

#### Scenario: User views existing share token
- **WHEN** share modal opens and user already has an active token
- **THEN** modal displays the current share URL
- **THEN** modal provides "Copy Link" button
- **THEN** modal provides "Generate Share Card" button to create a shareable image
- **THEN** modal provides "Disable Sharing" or "Delete Link" button

#### Scenario: User disables sharing
- **WHEN** user clicks "Disable Sharing" or "Delete Link" in the modal
- **THEN** system shows confirmation prompt ("Are you sure?")
- **WHEN** user confirms deletion
- **THEN** modal shows loading state
- **THEN** token is deleted from the backend
- **THEN** modal resets to "Generate Share Link" state

#### Scenario: User copies share link
- **WHEN** user clicks "Copy Link" button
- **THEN** system copies the URL to clipboard
- **THEN** button briefly shows confirmation text ("Copied!")

#### Scenario: User generates share card
- **WHEN** user clicks "Generate Share Card" button
- **THEN** system generates a shareable image similar to individual encounter cards
- **THEN** image includes: user name/emoji, collection count, top species, top location
- **THEN** system opens share options (copy image, download, or platform share)

### Requirement: Handle share modal errors gracefully
The system SHALL handle API failures and edge cases in the share modal.

#### Scenario: Share token generation fails
- **WHEN** backend returns an error while generating token
- **THEN** modal displays user-friendly error message ("Unable to create share link, please try again")
- **THEN** user can dismiss error and retry

#### Scenario: Share token deletion fails
- **WHEN** backend returns an error while deleting token
- **THEN** modal displays error message and allows user to retry or cancel

#### Scenario: User navigates away during share operation
- **WHEN** user closes modal or navigates to different page while share operation is in progress
- **THEN** request completes in background without blocking the UI
