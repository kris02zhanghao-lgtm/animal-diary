## ADDED Requirements

### Requirement: Pokedex view displays two-layer structure

The system SHALL display a two-layer structure: species card grid (layer 1) and species photo grid (layer 2).

#### Scenario: View empty pokedex
- **WHEN** user navigates to pokedex and has no records
- **THEN** system displays empty state: "还没有发现任何物种，去记录偶遇吧～"

#### Scenario: View pokedex with species (layer 1)
- **WHEN** user opens pokedex with existing records
- **THEN** system displays 2-3 column responsive grid of species cards (2 cols mobile, 3 cols desktop)
- **AND** each card shows representative photo, species name, encounter count, and percentage

### Requirement: Species card displays encounter info with percentage

Each species card SHALL show: photo, species name, "遇到X次", and percentage of total records.

#### Scenario: Species card percentage calculation
- **WHEN** pokedex renders a species card
- **THEN** card displays "遇到3次 (15%)" where 15% = species count / total records count * 100
- **AND** percentage helps track species frequency for future achievement system

### Requirement: Click species card to view photo grid (layer 2)

User SHALL be able to click a species card to expand and view all photos of that species in a grid.

#### Scenario: Click species card expands to photo grid
- **WHEN** user clicks a species card
- **THEN** system switches to photo grid view showing all photos of that species
- **AND** displays back button "←" to return to species card grid
- **AND** header shows species name with encounter count (e.g., "橘猫 (遇到3次)")

#### Scenario: Click photo to view card detail
- **WHEN** user clicks a photo in species photo grid
- **THEN** system shows full card detail view (existing detail page logic)
