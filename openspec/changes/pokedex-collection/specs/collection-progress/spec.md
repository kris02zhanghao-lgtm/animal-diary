## ADDED Requirements

### Requirement: System calculates unique species count

The system SHALL count the number of unique species in user's collection.

#### Scenario: Count unique species
- **WHEN** user opens pokedex view
- **THEN** system counts unique values in species field across all records
- **AND** displays count as "已发现物种：N"

### Requirement: Progress display updates in real-time

The species count SHALL update immediately when user adds or deletes a record.

#### Scenario: Species count updates after saving record
- **WHEN** user saves a new record with a species
- **THEN** pokedex view's species count increments (if species is new)
- **AND** grid reflects new species card

#### Scenario: Species count updates after deletion
- **WHEN** user deletes a record and it was the last record of that species
- **THEN** that species is removed from pokedex
- **AND** species count decrements
