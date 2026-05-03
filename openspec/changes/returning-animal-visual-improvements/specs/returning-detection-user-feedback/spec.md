## ADDED Requirements

### Requirement: User feedback for manual returning animal detection
The system SHALL provide clear feedback to users when they manually trigger "查找回头客", whether a match is found or not.

#### Scenario: Detection in progress
- **WHEN** user clicks "查找回头客" button
- **THEN** system shows loading state (button becomes disabled or shows spinner) until detection completes

#### Scenario: Detection found similar record
- **WHEN** detection completes and finds a record with similarity_score >= 60
- **THEN** system displays the returning suggestion modal (existing behavior) for user to confirm association

#### Scenario: Detection found low similarity record
- **WHEN** detection completes and finds a record with 40 <= similarity_score < 60
- **THEN** system displays a non-modal feedback message "未找到相似度足够高的记录" and closes the detail view or returns to list

#### Scenario: Detection found no matches
- **WHEN** detection completes and finds no matching records (similarity_score < 40 or no history records)
- **THEN** system displays a friendly message "未找到相似记录，可能是新朋友呢" and does not close the detail view

#### Scenario: Detection fails
- **WHEN** detection fails due to network error or API failure
- **THEN** system displays an error message "检测失败，请重试" without interfering with the detail view
