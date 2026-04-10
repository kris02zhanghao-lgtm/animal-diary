## ADDED Requirements

### Requirement: User authentication with Supabase
The system SHALL automatically authenticate users via Supabase Auth with anonymous login, generating a unique user ID for each browser/device without requiring email registration.

#### Scenario: First visit - automatic anonymous signup
- **WHEN** a new user opens the application for the first time
- **THEN** the system automatically calls `signInAnonymously()`, creates a new user in Supabase, and stores the session token in localStorage

#### Scenario: Returning user - session restoration
- **WHEN** a returning user opens the application
- **THEN** the system retrieves the existing session from localStorage and validates it with Supabase

#### Scenario: Session expiration
- **WHEN** a user's session token expires (>7 days)
- **THEN** the system automatically calls `signInAnonymously()` to create a new user, treating this as a fresh device

#### Scenario: Session persistence across page reloads
- **WHEN** a user refreshes or navigates to another page during their session
- **THEN** the system maintains the session without re-authenticating

### Requirement: Session initialization in React
The system SHALL initialize Supabase authentication in the main App component before rendering pages, ensuring the session is available to all child components.

#### Scenario: App component initializes auth
- **WHEN** App.jsx mounts
- **THEN** it calls `supabase.auth.getSession()`, and if no session exists, calls `signInAnonymously()`

#### Scenario: Auth context available to pages
- **WHEN** pages (ListPage, NewEncounterPage) render
- **THEN** they can access the authenticated user ID via `supabase.auth.getUser()`

### Requirement: Future email login upgrade path
The system SHALL support optional email/password login in future versions without disrupting anonymous users.

#### Scenario: Anonymous user can optionally upgrade to email account
- **WHEN** a user has an anonymous session and chooses to link an email
- **THEN** the system preserves their user_id and associates it with an email account (implementation deferred to P1)
