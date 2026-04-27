## MODIFIED Requirements

### Requirement: Pokedex aggregates by category, not by species

The pokedex collection page SHALL group records by `category` (broad animal type) instead of `species` (specific breed). One category card represents all records of that animal type, regardless of breed variation.

#### Scenario: Multiple cat breeds shown as one card
- **WHEN** user has records of "虎斑猫", "橘猫", and "奶牛猫"
- **THEN** pokedex displays a single "猫" card
- **AND** the card shows count of all cat records (3+)
- **AND** clicking the card shows all cat photos in layer 2

#### Scenario: Species name is retained for detail view
- **WHEN** user expands a category (e.g., "猫") to layer 2
- **THEN** each photo's detail view shows the specific species: "虎斑猫", "橘猫", etc.
- **AND** user can edit the species name individually

#### Scenario: Category card displays latest photo from that category
- **WHEN** a category contains multiple species records
- **THEN** the category card displays the latest photo chronologically from any species in that category
