# v0.7 Share Encounter Implementation Tasks

## 1. Create Share Utilities

- [ ] 1.1 Create `src/utils/shareUtils.js` with main share function
  - `generateShareCard(record)`: Core function to generate PNG from Canvas
  - Input: encounter record object (imageBase64, species, location, journal, createdAt)
  - Returns: Promise<Blob> with PNG data
  - Handle Canvas rendering errors with try-catch

- [ ] 1.2 Implement Canvas rendering logic
  - Create off-screen canvas (600x800px)
  - Draw background (warm color #f9f0e6)
  - Draw photo (top 40%): load Base64 image, object-fit cover, center-crop
  - Draw info section (middle 30%): species name, location, date
  - Draw journal text (bottom 30%): truncate to 100 chars, add ellipsis
  - Add footer branding ("Animal Diary")
  - Use consistent fonts and colors

- [ ] 1.3 Implement export functionality
  - `downloadShareCard(blob, filename)`: Trigger browser download
    - Create object URL from blob
    - Create <a> tag with download attribute
    - Programmatic click to trigger download
  
  - `copyToClipboard(blob)`: Copy image to clipboard
    - Try Clipboard API first (navigator.clipboard.write)
    - Fallback: show error message or offer download alternative
    - Show success toast: "已复制到剪贴板"

- [ ] 1.4 Implement fallback text share
  - `generateShareText(record)`: Create formatted text version
    - Format: "【偶遇记录】\n🐱 Species\n📍 Location\n📅 Date\n日志：[excerpt]"
  - `copyTextToClipboard(text)`: Use simple navigator.clipboard.writeText()

## 2. Create Share Modal Component

- [ ] 2.1 Create `src/components/ShareModal.jsx`
  - Accept props: `record`, `isOpen`, `onClose`
  - Show loading spinner while Canvas renders
  - Render two buttons:
    - "下载图片" → calls downloadShareCard()
    - "复制到剪贴板" → calls copyToClipboard()
  - Auto-close after successful action (2s delay)

- [ ] 2.2 Implement fallback UI
  - If Canvas generation fails:
    - Hide image preview
    - Show text version of share card
    - Change buttons to "复制文案" and fallback options

- [ ] 2.3 Style ShareModal with Tailwind
  - Center modal on screen
  - Use semi-transparent backdrop
  - Match app's warm color theme
  - Responsive on mobile

## 3. Integrate with Detail Page

- [ ] 3.1 Modify `src/pages/DetailPage.jsx`
  - Import ShareModal component
  - Add state: `isShareModalOpen`
  - Update menu options: replace "即将上线" with functional share
  - Add "分享" menu click handler → opens ShareModal
  - Pass current record to ShareModal

- [ ] 3.2 Update menu rendering
  - Menu button (⋮) should show: "分享" | "删除"
  - Remove or replace any placeholder text

- [ ] 3.3 Verify existing delete functionality
  - Ensure "删除" option still works
  - No changes needed to delete logic

## 4. Optional: Report Page Enhancement (v0.7.x or later)

- [ ] 4.1 Add share button to top species cards in ReportPage
  - Add small share icon (📤 or 🔗) to each top 3 species card
  - Click triggers ShareModal with a "species summary" record
  - Species summary format: "2026年你遇见了 X 只 [species]"

## 5. Testing & Verification

- [ ] 5.1 Local testing on desktop
  - Open a record detail view
  - Click "分享" button
  - Verify ShareModal appears
  - Click "下载图片" → verify PNG downloads with correct filename
  - Click "复制到剪贴板" → verify toast message shows (or fallback error)

- [ ] 5.2 Test Canvas image quality
  - Verify photo renders without distortion
  - Verify text is readable (species, location, date, journal)
  - Check color theme matches app style
  - Test with various image orientations (portrait, landscape, square)

- [ ] 5.3 Test fallback scenarios
  - Simulate Clipboard API failure (modify navigator.clipboard)
  - Verify fallback UI appears
  - Verify text share works

- [ ] 5.4 Mobile testing
  - Test on phone browser
  - Verify touch interactions work
  - Check canvas rendering performance on mobile
  - Verify spinner shows during generation

- [ ] 5.5 Test with various record types
  - Record with long journal → verify text truncates
  - Record with long location name → verify text fits
  - Record with short journal → verify layout still looks good

## 6. Browser Compatibility Testing

- [ ] 6.1 Test on modern browsers
  - Chrome/Edge, Firefox, Safari (desktop and mobile)
  - Verify Canvas support in all browsers

- [ ] 6.2 Test Clipboard API fallback
  - Verify works on Chrome, Firefox (have Clipboard API)
  - Verify fallback on older Safari/IE (no Clipboard API)

## 7. Vercel Deployment & Final Testing

- [ ] 7.1 Deploy to staging/production
  - Push changes to main branch
  - Verify deployment succeeds

- [ ] 7.2 End-to-end testing on live site
  - Open detail page of a real record
  - Generate and download share card
  - Verify image looks correct
  - Share image manually to verify it looks good on social media

- [ ] 7.3 Update documentation
  - Update progress.md with v0.7 completion
  - List files created/modified
  - Note any limitations or future improvements

