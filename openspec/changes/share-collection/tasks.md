## 1. Database Setup

- [ ] 1.1 Create `collection_shares` table with user_id, token (UNIQUE), created_at
- [ ] 1.2 Add RLS policy: allow users to SELECT/INSERT/DELETE only their own rows
- [ ] 1.3 Add database indexes on (user_id, token) for query performance
- [x] 1.4 Create migration file and test locally with `vercel dev`

## 2. Backend API Development

- [x] 2.1 Create `/api/share-collection.js` with POST endpoint (generate/get token)
- [x] 2.2 Create DELETE endpoint in `/api/share-collection.js` to disable sharing
- [x] 2.3 Create GET endpoint in `/api/share-collection.js` to retrieve current token
- [x] 2.4 Create `/api/public-collection/[token].js` endpoint (public access)
- [ ] 2.5 Test all endpoints locally: token generation, retrieval, deletion, public access
- [x] 2.6 Add error handling for invalid tokens, missing auth

## 3. Frontend - CollectionPage Share UI

- [x] 3.1 Add "Share Collection" button to CollectionPage header
- [x] 3.2 Create `ShareCollectionModal` component
- [x] 3.3 Implement modal state management
- [x] 3.4 Add copy-to-clipboard functionality for share URL
- [ ] 3.5 Integrate share card generation (reuse existing shareUtils if applicable)
- [x] 3.6 Style modal to match existing design (warm colors, consistent with project aesthetic)

## 4. Frontend - Public Collection Page

- [x] 4.1 Create `PublicCollectionPage` component
- [x] 4.2 Display collection grid (reuse CollectionPage structure)
- [x] 4.3 Display collection statistics section
- [x] 4.4 Implement read-only behavior
- [x] 4.5 Handle error states
- [x] 4.6 Add route to App.jsx: `/shared/<token>` → PublicCollectionPage

## 5. Routing & Navigation

- [x] 5.1 Update `App.jsx` to add new route for public collection: `/shared/:token`
- [x] 5.2 Update navigation logic to not show bottom TabBar on public collection page
- [x] 5.3 Add breadcrumb or back button on public page for navigation

## 6. Testing & Validation

- [ ] 6.1 Test token generation: user generates first token, verify URL format and uniqueness
- [ ] 6.2 Test public access: visit `/shared/<token>`, verify data displays correctly
- [ ] 6.3 Test token deletion: disable sharing, verify URL returns 404
- [ ] 6.4 Test share card generation: verify image quality and content
- [ ] 6.5 Test error cases: invalid token, deleted token, network failures
- [ ] 6.6 Cross-browser testing: mobile and desktop, different browsers
- [ ] 6.7 Verify RLS policies: users cannot see other users' tokens or collections

## 7. Code Quality & Documentation

- [x] 7.1 Run `npm run lint` and fix any issues
- [x] 7.2 Run `npm run build` and verify production build succeeds
- [ ] 7.3 Verify no console errors or warnings
- [ ] 7.4 Update JSDoc/comments for new functions (if needed)
- [ ] 7.5 Clean up debug code and unused variables

## 8. Deployment & Verification

- [ ] 8.1 Deploy to Vercel staging environment
- [ ] 8.2 Test full flow on staging: generate → share → public access → delete
- [ ] 8.3 Verify database migrations applied successfully
- [ ] 8.4 Check Vercel function logs for any errors
- [ ] 8.5 Verify RLS policies are enforced (users cannot bypass permissions)
- [ ] 8.6 Deploy to production
- [ ] 8.7 Smoke test on production
