## Why

Build a foundational page structure and navigation system to enable users to view their animal encounter records and add new encounters. This establishes the core UX flow needed before integrating AI features.

## What Changes

- Refactor `src/App.jsx` to manage page state using React hooks (currently shows default Vite template)
- Create `src/pages/ListPage.jsx` displaying the animal encyclopedia with empty state messaging
- Create `src/pages/NewEncounterPage.jsx` for capturing encounters with image upload and location input
- Apply Tailwind CSS styling across all pages for mobile-first responsive design

## Capabilities

### New Capabilities
- `page-navigation`: Page state management and switching between list and new-encounter views
- `animal-list-display`: Display animal encounter list with empty state, title, and action button
- `encounter-capture-form`: Form interface for recording encounters with image upload, location input, and submission capability

### Modified Capabilities
<!-- Leave empty - no existing capabilities affected -->

## Impact

- Modified: `src/App.jsx` (replaces default Vite template with custom page routing)
- New files: `src/pages/ListPage.jsx`, `src/pages/NewEncounterPage.jsx`
- CSS: All styling via Tailwind utilities, no custom CSS needed for these pages
- No dependency changes required
