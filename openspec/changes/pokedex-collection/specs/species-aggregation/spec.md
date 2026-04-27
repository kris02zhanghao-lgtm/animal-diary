## ADDED Requirements

### Requirement: System aggregates records by species

The system SHALL group all user records by the species field and calculate statistics for each species.

#### Scenario: Aggregate species data
- **WHEN** pokedex view loads or user navigates to pokedex tab
- **THEN** system processes records array and groups by species field
- **AND** for each species, calculates: total count, latest record, latest location, latest photo

### Requirement: Species aggregation is case-sensitive

Species matching SHALL be case-sensitive (e.g., "橘猫" ≠ "橘猫 ").

#### Scenario: Species matching
- **WHEN** system groups records
- **THEN** "橘猫" and "橘猫 " (with trailing space) are treated as different species
- **AND** user can see duplicates if data is inconsistent

### Requirement: Handling missing species field

Records with empty or null species field SHALL be excluded from species aggregation.

#### Scenario: Exclude records without species
- **WHEN** aggregating records with some having empty species
- **THEN** those records are skipped and not displayed in pokedex

### Requirement: Sort species by encounter count

Species SHALL be sorted by encounter frequency in descending order (most encountered first).

#### Scenario: Sort species
- **WHEN** pokedex view renders species cards
- **THEN** species with highest encounter count appears first
