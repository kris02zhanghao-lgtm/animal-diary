# Location Editing Capability

## ADDED Requirements

### Requirement: User can confirm or override the auto-detected location text
The location text field in NewEncounterPage SHALL be editable regardless of whether it was auto-filled by geolocation.

#### Scenario: User edits auto-filled location
- **WHEN** geolocation fills in a location string
- **AND** user taps the location field
- **THEN** the field becomes editable and user can modify the text
- **AND** editing the text does NOT change the stored coordinates

#### Scenario: User manually enters location when geolocation failed
- **WHEN** geolocation was denied or unavailable
- **AND** user types a location manually
- **THEN** the record is saved with the manually typed location string
- **AND** latitude and longitude remain null

### Requirement: Location field shows geolocation status feedback
The location field area SHALL display status feedback based on the geolocation state.

#### Scenario: Status hint while locating
- **WHEN** geolocation request is in progress
- **THEN** a spinner or "定位中..." hint is shown near the location field

#### Scenario: Status hint on success
- **WHEN** geolocation succeeds
- **THEN** a "📍 已自动定位" badge or hint is shown

#### Scenario: Status hint on failure
- **WHEN** geolocation fails or is denied
- **THEN** a "无法获取位置，请手动输入" hint is shown in muted color
