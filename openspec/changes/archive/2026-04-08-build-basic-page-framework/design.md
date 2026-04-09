## Context

The project is initialized with Vite + React template, showing default content. We need to establish a page routing and navigation system to support multiple views: a list page to display animal encounters and a form page to capture new encounters.

Current state:
- `src/App.jsx` contains default Vite template code
- No page routing or navigation system
- Tailwind CSS configured but not yet applied to components

## Goals / Non-Goals

**Goals:**
- Implement page state management using React `useState` hook
- Create ListPage component showing animal encyclopedia with empty state
- Create NewEncounterPage component with form inputs for encounter capture
- Apply Tailwind CSS for mobile-first responsive design
- Establish foundation for future AI integration

**Non-Goals:**
- Implement actual data persistence or localStorage integration (future task)
- Add API calls or AI image recognition (future task)
- Create navigation bar or header component reuse (can be added later)
- Support dark mode or advanced theming

## Decisions

1. **Page State Management**: Use React `useState` in `App.jsx` to track current page (`"list"` | `"new"`). Rationale: Simple, no external dependencies, sufficient for two-page flow. Alternative: React Router would be overkill for current scope.

2. **Component File Structure**: Create `src/pages/` directory with separate `ListPage.jsx` and `NewEncounterPage.jsx` files. Rationale: Separation of concerns, easier to test and modify later. Alternative: Keep all in App.jsx (less maintainable as features grow).

3. **Styling Approach**: All styling via Tailwind utility classes, no custom CSS. Rationale: Faster development, consistent design system, mobile-first responsive. Alternative: CSS modules would add unnecessary complexity.

4. **Image Upload**: Use native HTML `<input type="file">` for image selection with preview rendering via FileReader API. Rationale: Works without external dependencies, suitable for prototype. Alternative: Third-party upload library (defer to later if needed).

5. **Responsive Design**: Mobile-first Tailwind breakpoints (sm, md, lg). Rationale: Primary user context is mobile (taking animal photos), desktop is secondary. Buttons, inputs, and layout scale appropriately.

## Risks / Trade-offs

- **Risk**: useState at App level may become unwieldy if more pages added later. **Mitigation**: Document clearly that React Router or state management library should be introduced before adding >3 pages.
- **Risk**: Image preview stored in component state (base64) could cause memory issues with large images. **Mitigation**: Add compression or size validation in future iteration.
- **Risk**: No backend yet, so form submission only logs to console. **Mitigation**: Placeholder for future AI API integration; make button visually ready for async behavior.

## Migration Plan

1. Clean out `src/App.jsx` default code
2. Create page directory structure
3. Implement ListPage and NewEncounterPage components
4. Add page state switching logic in App.jsx
5. Test navigation and styling locally before commit

## Open Questions

- Should the "+" button appear in ListPage or be a fixed floating action button? (Propose: floating in bottom-right corner per mobile UX patterns)
- Should form inputs validate before submission? (Propose: basic validation, can enhance later)
