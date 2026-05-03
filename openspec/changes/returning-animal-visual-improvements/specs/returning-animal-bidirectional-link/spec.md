## ADDED Requirements

### Requirement: Bidirectional returning animal relationship display
The system SHALL display both outgoing and incoming returning animal relationships in the detail view. When viewing a record, users SHALL see not only which record this one is linked to, but also which other records are linked to it.

#### Scenario: View outgoing link
- **WHEN** user opens a record that has `similarity_score >= 40` and `similar_record_id` set
- **THEN** system displays a section showing "关联到这只动物" with the linked record's details and "查看关联" button

#### Scenario: View incoming links
- **WHEN** user opens a record that has other records pointing to it via their `similar_record_id`
- **THEN** system displays a section showing "有其他记录关联到我" with up to 3 linked records and their similarity scores

#### Scenario: Navigate between linked records
- **WHEN** user clicks "查看关联" button on either outgoing or incoming link
- **THEN** system navigates to that record's detail view, preserving scroll position or providing context

#### Scenario: No relationships exist
- **WHEN** user opens a record with no outgoing and no incoming relationships
- **THEN** system does not display either section (normal detail view behavior)
