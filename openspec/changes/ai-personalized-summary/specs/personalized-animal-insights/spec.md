## ADDED Requirements

### Requirement: Generate animal observation insights
The system SHALL analyze a user's animal encounter history within a specified time window and generate personalized insights about observation patterns, including time preferences, location characteristics, and behavioral summaries.

#### Scenario: Generate insights for recent three months
- **WHEN** a user opens the report page with "最近三个月" time window and has ≥5 records in the past 3 months
- **THEN** system generates 3-5 personalized insights such as "你更容易在傍晚遇到鸟类" or "你在公司附近最常遇到橘猫"

#### Scenario: Generate insights for full year
- **WHEN** a user opens the report page with "自然年" time window and has ≥5 records in the current year
- **THEN** system generates 3-5 personalized insights covering the year's observation patterns

#### Scenario: Insufficient data
- **WHEN** a user has fewer than 5 records in the selected time window
- **THEN** system displays friendly message "记录越多，洞察越有趣，继续探索吧！" instead of generating insights

### Requirement: Analyze observation patterns
The system SHALL extract structured patterns from historical records by aggregating encounters by species, time, and location.

#### Scenario: Aggregate species frequency
- **WHEN** analyzing records for insight generation
- **THEN** system groups records by species and counts frequency, location distribution, and time patterns

#### Scenario: Identify time preferences
- **WHEN** analyzing a species' encounters
- **THEN** system identifies peak times (morning/afternoon/evening/night) and location hotspots where the species is most frequently encountered

### Requirement: Ensure insight accuracy
All generated insights SHALL use cautious language (e.g., "往往", "可能", "更容易") to reflect patterns rather than certainties, and SHALL be validated for relevance to the user's actual data.

#### Scenario: Insight relevance
- **WHEN** AI generates insights from aggregated data
- **THEN** each insight MUST be relevant to at least 2+ records and describe a genuine pattern in the data

### Requirement: Support multiple time windows
The system SHALL generate distinct insights for both "最近三个月" (recent 3 months) and "自然年" (calendar year) time windows.

#### Scenario: Window switching
- **WHEN** user switches time window in report page
- **THEN** system regenerates insights for the new window with different patterns and content
