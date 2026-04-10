## ADDED Requirements

### Requirement: OpenRouter API proxy via Vercel Function
The system SHALL provide a backend HTTP endpoint at `POST /api/recognize` that proxies OpenRouter API calls, hiding the API Key from the frontend.

#### Scenario: Frontend calls OpenRouter via proxy
- **WHEN** the frontend calls POST /api/recognize with `{ imageBase64, location }`
- **THEN** the Vercel Function receives the request, calls OpenRouter API with the stored VITE_OPENROUTER_API_KEY, and returns the result `{ species, journal, title }` to frontend

#### Scenario: API Key not exposed to frontend
- **WHEN** network inspection tools intercept frontend requests
- **THEN** no API Key is visible; the key is stored only in Vercel environment variables (server-side)

#### Scenario: Invalid request handling
- **WHEN** the frontend sends malformed data (missing imageBase64, oversized payload)
- **THEN** the API returns HTTP 400 with an error message

#### Scenario: OpenRouter API failure
- **WHEN** OpenRouter API returns an error (rate limit, network failure, invalid key)
- **THEN** the Vercel Function returns HTTP 500 with the OpenRouter error message to frontend

### Requirement: Proxy endpoint uses same prompt as before
The system SHALL maintain the existing AI prompt logic (city animal observation station, animal as protagonist) in the proxy endpoint.

#### Scenario: AI generates same quality responses
- **WHEN** the frontend calls /api/recognize with an image
- **THEN** the result includes species, journal, and title with the same tone and format as the original frontend-direct OpenRouter calls
