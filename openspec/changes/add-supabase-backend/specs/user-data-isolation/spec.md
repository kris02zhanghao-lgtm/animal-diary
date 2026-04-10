## ADDED Requirements

### Requirement: Row Level Security (RLS) on records table
The system SHALL enforce Row Level Security policies on the `records` table in Supabase, ensuring users can only access their own records.

#### Scenario: User can read their own records
- **WHEN** a user calls supabase.from('records').select()
- **THEN** the query returns only records where user_id matches the authenticated user's ID

#### Scenario: User cannot read other users' records
- **WHEN** a user attempts to query records with a different user_id (e.g., via raw SQL or API)
- **THEN** Supabase RLS policy rejects the query and returns an error

#### Scenario: User can insert new record
- **WHEN** a user calls supabase.from('records').insert({ species, journal, ... })
- **THEN** the insert succeeds and the record is automatically associated with the user's user_id

#### Scenario: User cannot insert record for another user
- **WHEN** a user attempts to insert a record with a different user_id
- **THEN** Supabase RLS policy rejects the insert

#### Scenario: User can update only their own records
- **WHEN** a user calls supabase.from('records').update(...).eq('id', recordId)
- **THEN** if the record belongs to the user, the update succeeds; otherwise, RLS rejects it

#### Scenario: User can delete only their own records
- **WHEN** a user calls supabase.from('records').delete().eq('id', recordId)
- **THEN** if the record belongs to the user, the delete succeeds; otherwise, RLS rejects it

### Requirement: Automatic user_id assignment
The system SHALL automatically set user_id to the authenticated user when inserting records, without requiring frontend to provide it.

#### Scenario: Frontend inserts without specifying user_id
- **WHEN** the frontend calls supabase.from('records').insert({ species, journal, location, ... }) (no user_id)
- **THEN** Supabase's RLS policy or trigger automatically assigns user_id from the authenticated session
