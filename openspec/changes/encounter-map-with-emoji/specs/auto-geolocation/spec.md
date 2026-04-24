# Auto Geolocation Capability

## ADDED Requirements

### Requirement: App automatically requests location on new encounter page load
When the NewEncounterPage loads, the app SHALL automatically call `navigator.geolocation.getCurrentPosition()` to obtain the user's current coordinates.

#### Scenario: Geolocation succeeds
- **WHEN** user opens the new encounter page
- **AND** browser geolocation is available and permission granted
- **THEN** the location field is pre-filled with a human-readable location string
- **AND** the user sees a "📍 已自动定位" hint below the location field

#### Scenario: Geolocation permission denied
- **WHEN** user opens the new encounter page
- **AND** user denies the geolocation permission popup
- **THEN** the location field remains empty and editable
- **AND** a non-blocking hint is shown: "无法获取位置，请手动输入"

#### Scenario: Geolocation unavailable (non-HTTPS or older browser)
- **WHEN** geolocation API is not available
- **THEN** the location field remains empty and editable
- **AND** no error is thrown

#### Scenario: Geolocation request in progress
- **WHEN** the geolocation request has been sent but not yet resolved
- **THEN** a small loading indicator appears in the location field area
- **AND** the rest of the form is usable

### Requirement: Coordinates are stored alongside each record
Each encounter record SHALL store latitude and longitude alongside the existing text location field.

#### Scenario: Record saved with coordinates
- **WHEN** geolocation succeeds and user saves the record
- **THEN** the record in the database includes latitude and longitude fields
- **AND** the location text field also stores the human-readable location string

#### Scenario: Record saved without coordinates
- **WHEN** geolocation was denied or unavailable
- **AND** user saves the record
- **THEN** the record is saved with null latitude and longitude
- **AND** this record does not appear as a map marker
