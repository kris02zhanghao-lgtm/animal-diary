# Map Rendering Capability

## ADDED Requirements

### Requirement: Map renders with all encounter records as markers
The MapView component SHALL display a map (powered by AMap JS API via CDN) with a marker for each encounter record that has a location.

#### Scenario: Map loads with records
- **WHEN** user switches to the map tab
- **THEN** a map renders centered on the midpoint of all encounter locations
- **AND** each encounter record with a non-empty location is displayed as an emoji marker

#### Scenario: Map loads with no records
- **WHEN** user switches to the map tab
- **AND** there are no records
- **THEN** the map renders centered on a default location (e.g., 北京天安门广场)
- **AND** a prompt message is shown: "出去遇见小动物，你的地图就会热闹起来！"

#### Scenario: Map auto-fits all markers
- **WHEN** the map loads with multiple markers
- **THEN** the map automatically zooms and pans to fit all visible markers within the viewport

### Requirement: Emoji markers visually represent each encounter
Each marker on the map SHALL display as a large emoji that corresponds to the species of that encounter.

#### Scenario: Emoji marker displayed
- **WHEN** a record is shown on the map
- **THEN** its marker shows the emoji returned by AnimalEmojiMapper for that species
- **AND** the emoji is large enough to be tappable (min 40px touch target)

### Requirement: Clicking a marker shows encounter details
Tapping or clicking a marker SHALL open an info popup or slide-up panel showing that encounter's key details.

#### Scenario: Marker click opens detail popup
- **WHEN** user clicks an emoji marker
- **THEN** a card appears showing the record's species, location text, date, and a thumbnail image
- **AND** a button or link is available to "查看完整详情"

#### Scenario: Tapping outside popup closes it
- **WHEN** a popup is open
- **AND** user taps outside it
- **THEN** the popup closes
