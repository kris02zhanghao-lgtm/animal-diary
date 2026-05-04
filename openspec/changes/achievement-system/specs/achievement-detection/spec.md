## ADDED Requirements

### Requirement: Achievement detection logic
The system SHALL provide functions to detect whether a user has unlocked each of the 5 achievements based on their records.

#### Scenario: Cat Color Master - successful unlock
- **WHEN** user has records with species_tag containing at least 5 different cat colors
- **THEN** system detects `猫色大师` achievement as unlocked

#### Scenario: Cat Color Master - not enough colors
- **WHEN** user has records with only 3 different cat colors
- **THEN** system shows `猫色大师` as locked with progress "3/5"

#### Scenario: Night Owl - successful unlock
- **WHEN** user has at least 1 record with created_at time between 22:00 and 06:00
- **THEN** system detects `夜行者` achievement as unlocked

#### Scenario: Old Friend - successful unlock
- **WHEN** user has at least 1 location with 3 or more records
- **THEN** system detects `老朋友` achievement as unlocked

#### Scenario: World Traveler - successful unlock
- **WHEN** user has records from at least 2 different cities (extracted from location field)
- **THEN** system detects `跨城旅行家` achievement as unlocked

#### Scenario: Record Maniac - successful unlock
- **WHEN** user has 50 or more total records
- **THEN** system detects `记录狂人` achievement as unlocked

#### Scenario: Record Maniac - not enough records
- **WHEN** user has 35 records
- **THEN** system shows `记录狂人` as locked with progress "35/50"

### Requirement: Detection respects time window
The system SHALL detect achievements only for records within the selected time window (「最近三个月」or 「自然年」).

#### Scenario: Recent 3 months window
- **WHEN** user switches to "最近三个月" time window
- **THEN** achievement detection uses only records from the past 90 days

#### Scenario: Natural year window
- **WHEN** user switches to "自然年" time window
- **THEN** achievement detection uses only records from January 1 to December 31 of current year

### Requirement: Achievement progress tracking
The system SHALL provide progress information for locked achievements.

#### Scenario: Progress for locked achievement
- **WHEN** user views a locked achievement
- **THEN** system displays current progress (e.g., "3/5 cats" for Cat Color Master)
