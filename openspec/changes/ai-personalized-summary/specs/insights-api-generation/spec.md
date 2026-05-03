## ADDED Requirements

### Requirement: API endpoint for insight generation
The system SHALL provide an HTTP endpoint `/api/generate-insights` that accepts a time window parameter and returns AI-generated personalized insights for the authenticated user.

#### Scenario: Generate insights with valid request
- **WHEN** frontend calls POST `/api/generate-insights` with `{ timeWindow: "month" | "year" }`
- **THEN** API returns 200 with `{ success: true, insights: [...], recordCount: <number> }`

#### Scenario: Insufficient records
- **WHEN** frontend calls `/api/generate-insights` and user has <5 records in the specified window
- **THEN** API returns 200 with `{ success: true, insights: [], recordCount: <number>, reason: "insufficient_data" }`

#### Scenario: API generation failure
- **WHEN** AI model call fails, times out, or returns malformed response
- **THEN** API returns 200 with `{ success: false, error: "generation_failed" }` for frontend graceful degradation

### Requirement: Aggregate user records for AI analysis
The backend SHALL query the user's records within the specified time window, aggregate them by species/time/location, and format into a structured prompt for AI processing.

#### Scenario: Record aggregation for recent 3 months
- **WHEN** backend receives request with timeWindow="month"
- **THEN** backend queries records from past 90 days, groups by species, extracts frequency/location/time patterns

#### Scenario: Record aggregation for calendar year
- **WHEN** backend receives request with timeWindow="year"
- **THEN** backend queries records from Jan 1 to Dec 31 of current year, applies same aggregation logic

### Requirement: Call AI model to generate insights
The system SHALL use OpenRouter API (or configured model) to generate insights from aggregated record data.

#### Scenario: Successful AI generation
- **WHEN** backend sends structured prompt with aggregated records to AI model
- **THEN** AI returns 3-5 personalized insights (each ≤20 characters in Chinese)

#### Scenario: Prompt structure
- **WHEN** constructing prompt for AI
- **THEN** prompt includes: time window info, aggregated species data, encounter frequencies, location patterns, with instruction to generate colorful but accurate insights

### Requirement: Validate and format AI response
The system SHALL parse AI-generated text into structured insight objects and validate quality before returning to frontend.

#### Scenario: Parse insights from AI response
- **WHEN** AI returns raw text with multiple insights
- **THEN** backend parses into array of insight objects with metadata (insight text, pattern type, confidence)

#### Scenario: Filter low-quality insights
- **WHEN** parsed insights contain irrelevant or duplicate content
- **THEN** backend filters and returns only high-confidence insights (minimum 3 if possible)
