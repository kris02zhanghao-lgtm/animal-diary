## MODIFIED Requirements

### Requirement: Returning animal suggestion modal with photo display
The system SHALL display a modal to suggest potential returning animals when a new record is saved with high similarity to existing records. The modal now includes a photo of the potential returning animal for visual confirmation.

#### Scenario: Modal displays with full context
- **WHEN** a new record is saved and similarity_score >= 60
- **THEN** system displays a modal containing:
  - Photo of the similar record (上方图片，object-fit: contain)
  - Text "这可能是你之前遇到过的那只" 
  - Similar record's metadata: date, location, species name
  - Similarity score percentage
  - "确认关联" and "忽略" buttons

#### Scenario: User confirms association
- **WHEN** user clicks "确认关联" button in the modal
- **THEN** system calls API to set `confirmed_returning = true`, closes modal, and navigates to list view

#### Scenario: User dismisses suggestion
- **WHEN** user clicks "忽略" button or clicks outside modal
- **THEN** system closes modal without modifying the association, navigates to list view
