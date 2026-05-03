## 1. Backend API Development

- [x] 1.1 Create `api/_lib/insightsGenerator.js` with functions to aggregate user records by species/time/location
- [x] 1.2 Implement record aggregation logic for "最近三个月" time window (past 90 days)
- [x] 1.3 Implement record aggregation logic for "自然年" time window (Jan 1 - Dec 31)
- [x] 1.4 Create Prompt template for AI that structures aggregated data with time/location/species patterns
- [x] 1.5 Implement AI model call via OpenRouter (or configured provider) to generate insights
- [x] 1.6 Add parsing logic to extract insights from AI response text into array of objects
- [x] 1.7 Add validation to filter low-quality/duplicate insights and ensure minimum quality
- [x] 1.8 Create `api/generate-insights.js` endpoint that receives timeWindow parameter and calls insightsGenerator

## 2. API Error Handling & Validation

- [x] 2.1 Add authentication check to `/api/generate-insights` (ensure user has auth token)
- [x] 2.2 Add record count check - return early if <5 records in window
- [x] 2.3 Implement timeout handling for AI model calls (max 10s, fallback to error response)
- [x] 2.4 Add error logging for debugging failed insight generations
- [x] 2.5 Return consistent JSON response format (success/error/insights fields)

## 3. Frontend Integration - ReportPage UI

- [x] 3.1 Identify where to add insights section in ReportPage.jsx (below data summary, before footer)
- [x] 3.2 Create new `InsightsSection` sub-component or add insights rendering logic to ReportPage
- [x] 3.3 Add loading state UI (spinner + "生成中..." text) for insights section
- [x] 3.4 Add empty/insufficient-data state UI ("记录越多，洞察越有趣...")
- [x] 3.5 Add error fallback state UI ("数据整理中，下次打开会有更多发现")
- [x] 3.6 Implement insights display: emoji prefix + insight text, one per line, warm color styling
- [x] 3.7 Add time window switching integration - regenerate insights when user toggles timeWindow

## 4. Frontend API Integration

- [x] 4.1 Add function to call `/api/generate-insights` from ReportPage (use supabaseService or fetch)
- [x] 4.2 Handle API response and populate insights state
- [x] 4.3 Handle API failure gracefully - show error fallback message, no crash
- [x] 4.4 Implement timeout handling (if API response >5s, show fallback)
- [x] 4.5 Ensure insights regenerate when timeWindow prop changes
- [x] 4.6 Test keyboard/accessibility for insights section

## 5. Styling & Visual Polish

- [x] 5.1 Define emoji mapping for insight types (🌙傍晚, 📍地点, 🐾动物 etc)
- [x] 5.2 Apply warm color palette to insights section (#f0e8d8, #fffdf7, border colors)
- [x] 5.3 Add rounded borders and box-shadow consistent with other report cards
- [x] 5.4 Ensure font size/weight emphasizes insights compared to data labels
- [x] 5.5 Test responsive design - mobile/tablet/desktop layout
- [x] 5.6 Verify animations/transitions smooth (loading spinner, state changes)

## 6. Local Testing & Validation

- [ ] 6.1 Run `vercel dev` to test API endpoint locally
- [ ] 6.2 Test API with curl/Postman: POST /api/generate-insights with timeWindow="month"
- [ ] 6.3 Verify API returns correct response format and insights count (3-5)
- [ ] 6.4 Test insufficient data case (<5 records) - verify correct response
- [ ] 6.5 Test error case - verify fallback behavior when AI call fails
- [ ] 6.6 Test in browser - open report page and verify insights section loads/displays
- [ ] 6.7 Test time window switching - verify insights regenerate with different content
- [ ] 6.8 Verify no console errors, check network tab for API calls

## 7. Integration Testing

- [ ] 7.1 Test full flow: create new record → navigate to report → insights display
- [ ] 7.2 Test edge case: create exactly 5 records, verify insights show (boundary)
- [ ] 7.3 Test edge case: have 4 records, verify "记录越多..." message shows
- [ ] 7.4 Test edge case: delete records to go below 5, verify message changes
- [ ] 7.5 Test different time windows with different data distributions
- [ ] 7.6 Test mobile experience - tap/scroll, ensure insights render properly
- [x] 7.7 Check ESLint & TypeScript (if used) pass on modified files

## 8. Code Quality & Documentation

- [x] 8.1 Review insightsGenerator.js code for readability and comments where needed
- [x] 8.2 Review API endpoint error handling and edge cases
- [x] 8.3 Review ReportPage changes for consistency with existing code style
- [x] 8.4 Remove any console.log debug statements
- [x] 8.5 Verify no unused imports or variables

## 9. Deployment & Production Verification

- [ ] 9.1 Update environment variables if needed (verify OPENROUTER_API_KEY available)
- [ ] 9.2 Deploy to Vercel staging/preview environment
- [ ] 9.3 Test on staging: create records, open report, verify insights generate
- [ ] 9.4 Monitor API logs for errors during staging test
- [ ] 9.5 Deploy to production
- [ ] 9.6 Verify production insights generation works
- [ ] 9.7 Check AI response quality - are insights meaningful and accurate?
- [ ] 9.8 Monitor costs if AI provider charges per call

## 10. Documentation & Closeout

- [x] 10.1 Update progress.md with v0.8.1 completion status
- [x] 10.2 Document Prompt template in code comments for future reference
- [x] 10.3 Add any notes about insights quality/limitations to design.md
- [ ] 10.4 Update growth.md if there are interesting PM decisions to record
- [ ] 10.5 Create git commit with clear message
