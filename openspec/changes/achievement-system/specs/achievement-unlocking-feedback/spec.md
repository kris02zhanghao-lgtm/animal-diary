## ADDED Requirements

### Requirement: Achievement unlock notification
The system SHALL display a celebratory notification when a user unlocks a new achievement.

#### Scenario: Achievement unlock detection
- **WHEN** user action results in achievement unlock (time window switch, view report after saving record)
- **THEN** system compares current achievements with previously detected achievements
- **AND** if new achievements are detected, triggers unlock notification

#### Scenario: Unlock notification display
- **WHEN** a new achievement is unlocked
- **THEN** system displays a modal with:
  - Achievement name and congratulatory message
  - Achievement icon/visual representation
  - Brief description of what was achieved
- **AND** modal appears with zoom-in entrance animation

#### Scenario: Multiple simultaneous unlocks
- **WHEN** user unlocks multiple achievements at once
- **THEN** system displays them sequentially
- **AND** first achievement shows immediately
- **AND** subsequent achievements queue and show after dismissal

### Requirement: Unlock notification animation
The system SHALL provide visual feedback through entrance animations.

#### Scenario: Modal entrance animation
- **WHEN** unlock notification appears
- **THEN** modal uses zoom-in animation (scale 0.92→1, opacity 0→1)
- **AND** background overlay uses fade-in animation
- **AND** animation duration is 0.3 seconds

#### Scenario: No animation on subsequent views
- **WHEN** user re-opens Report Page without new unlocks
- **THEN** achievement badges display without animation

### Requirement: Unlock notification lifecycle
The system SHALL manage the lifecycle of unlock notifications (display duration, dismissal).

#### Scenario: Auto-dismiss unlock notification
- **WHEN** unlock notification is displayed
- **THEN** notification automatically dismisses after 3 seconds
- **AND** user can manually dismiss by clicking close button or outside modal
- **AND** clicking achievement details in notification opens full achievement modal

#### Scenario: No duplicate notifications
- **WHEN** user views Report Page multiple times without new unlocks
- **THEN** previously unlocked achievements do NOT trigger notifications again
- **AND** only genuinely new unlocks trigger the celebratory notification

### Requirement: Unlock feedback styling
The system SHALL use appropriate visual styling for celebration/unlock state.

#### Scenario: Unlock notification visual design
- **WHEN** unlock notification is displayed
- **THEN** uses warm color palette consistent with brand (#fffdf7 background)
- **AND** includes positive/celebratory messaging
- **AND** styling differentiates from regular modals (e.g., rounded corners, elevation shadow)
