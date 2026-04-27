## ADDED Requirements

### Requirement: User can view all records of a species

When user clicks a species card, the system SHALL display all records belonging to that species in timeline format.

#### Scenario: Expand species to view all records
- **WHEN** user clicks a species card
- **THEN** system filters records to show only those matching selected species
- **AND** displays filtered records in timeline/card format
- **AND** shows a back button labeled "←" to return to pokedex grid

### Requirement: Species detail view shows count

The species detail view SHALL display how many records exist for the selected species.

#### Scenario: Display species record count
- **WHEN** species detail view opens
- **THEN** header shows species name and encounter count (e.g., "橘猫（遇到3次）")

### Requirement: User can delete records from species detail view

User SHALL be able to delete individual records from the species detail timeline.

#### Scenario: Delete record from species detail
- **WHEN** user clicks delete on a record in species detail view
- **THEN** deletion confirmation popup appears
- **AND** after confirmation, record is deleted and species detail view updates
- **AND** if no records remain for species, pokedex returns to grid view
