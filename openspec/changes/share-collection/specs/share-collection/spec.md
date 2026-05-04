## ADDED Requirements

### Requirement: Generate share collection token
The system SHALL allow authenticated users to generate a unique token that provides public access to their collection.

#### Scenario: User generates first share token
- **WHEN** user clicks "Share Collection" and confirms token generation
- **THEN** system generates a unique 12-character alphanumeric token and stores it in collection_shares table
- **THEN** system returns the complete share URL to the user (e.g., `https://animal-diary.vercel.app/shared/<token>`)

#### Scenario: User requests share token when already shared
- **WHEN** user clicks "Share Collection" and a token already exists
- **THEN** system returns the existing token and URL without generating a new one

### Requirement: Disable collection sharing
The system SHALL allow users to delete their share token and disable public access.

#### Scenario: User deletes share token
- **WHEN** user clicks "Cancel Share" or "Disable Sharing" and confirms deletion
- **THEN** system deletes the token from collection_shares table
- **THEN** subsequent requests to `/shared/<token>` return 404 Not Found

### Requirement: Manage share tokens
The system SHALL provide an API endpoint for users to retrieve and manage their current share token.

#### Scenario: User retrieves current share token
- **WHEN** user calls `GET /api/share-collection` with valid authentication
- **THEN** system returns the current token and created date if one exists
- **THEN** if no token exists, system returns null or empty response

#### Scenario: User generates new share token
- **WHEN** user calls `POST /api/share-collection` with valid authentication
- **THEN** system creates or returns existing collection_shares entry
- **THEN** system returns token and share URL

#### Scenario: User deletes share token
- **WHEN** user calls `DELETE /api/share-collection` with valid authentication
- **THEN** system removes the token from collection_shares
- **THEN** system returns success confirmation

### Requirement: Store share tokens securely
The system SHALL store share tokens in a dedicated table with proper constraints and RLS policies.

#### Scenario: Token uniqueness is enforced
- **WHEN** attempting to create a duplicate token (collision, though extremely unlikely)
- **THEN** system either regenerates until unique, or returns error and prompts user to retry

#### Scenario: Tokens are associated with users
- **WHEN** querying collection_shares table
- **THEN** each token row contains user_id, token, and created_at
- **THEN** RLS policy ensures users can only manage their own tokens
