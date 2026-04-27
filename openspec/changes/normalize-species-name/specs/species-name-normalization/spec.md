## ADDED Requirements

### Requirement: AI returns standardized species names

The system SHALL return a standardized Chinese common name for the `species` field, avoiding color or pattern modifiers.

#### Scenario: Cat with mixed coloring identified
- **WHEN** user uploads a photo of an orange-and-white cat
- **THEN** AI returns `species: "橘猫"` (not "橘白猫" or "橘黄猫")

#### Scenario: Black-and-white cat identified
- **WHEN** user uploads a photo of a black-and-white cat
- **THEN** AI returns `species: "奶牛猫"` (not "黑白猫")

#### Scenario: Same species across multiple recognitions
- **WHEN** the same species is identified in multiple separate photos
- **THEN** `species` field returns the same string each time
- **AND** the pokedex groups them under one species card
