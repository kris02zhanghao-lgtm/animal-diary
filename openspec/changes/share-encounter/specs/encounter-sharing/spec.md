## ADDED Requirements

### Requirement: Generate Share Card Image
The system SHALL generate a visually attractive share card as a PNG image from an encounter record. The card SHALL contain photo, species name, location, date, and journal excerpt.

#### Scenario: User clicks share button on detail page
- **WHEN** user clicks "分享" button in detail page menu
- **THEN** system generates a share card image (600x800px) with:
  - Top 40%: encounter photo (object-fit: cover)
  - Middle 30%: species name (bold, large), location (📍), date (📅)
  - Bottom 30%: journal text (first 100 characters, truncated with "...")
  - Background: warm colors (#f9f0e6 or similar, matching app theme)
  - Footer: small "Animal Diary" branding

#### Scenario: Share card generation succeeds
- **WHEN** share card finishes rendering via Canvas
- **THEN** system displays a modal with two options:
  - "下载图片" button → triggers browser download as PNG
  - "复制到剪贴板" button → copies image to clipboard (if supported)

#### Scenario: Share card generation fails
- **WHEN** Canvas rendering fails (old browser, memory limit, etc.)
- **THEN** system displays text-based fallback:
  ```
  【偶遇记录】
  🐱 Species Name
  📍 Location
  📅 YYYY-MM-DD
  日志摘要：[first 100 chars]...
  ```
  With "复制文案" button to copy text to clipboard

---

### Requirement: Share from Detail Page
The system SHALL enable sharing from the detail/expand view of an encounter record. The share action SHALL be accessible from the menu (⋮).

#### Scenario: Detail page menu includes share option
- **WHEN** user views an encounter in expanded detail view
- **THEN** menu button (⋮) displays options: "分享" | "删除" (removed "展开" from this context)

#### Scenario: User initiates share from detail menu
- **WHEN** user clicks "分享" in the detail page menu
- **THEN** system generates a share card for that specific encounter
  - Photo: the encounter's imageBase64
  - Species: the encounter's species field
  - Location: the encounter's location field
  - Date: the encounter's createdAt formatted as YYYY-MM-DD
  - Journal: the encounter's journal field (truncated)

#### Scenario: Share modal closes after action
- **WHEN** user clicks "下载图片" or "复制到剪贴板"
- **THEN** action completes and modal automatically closes after 2 seconds
  - Success toast/notification optional: "已复制到剪贴板" or "正在下载..."

---

### Requirement: Share Card Styling
The system SHALL render share cards with consistent visual design matching the app's star valley theme. Typography, colors, and layout SHALL be optimized for social media sharing (vertical, mobile-friendly).

#### Scenario: Card styling matches app theme
- **WHEN** share card is generated
- **THEN** card displays with:
  - Warm color palette (#f9f0e6, #d4c5a9, #5a4a3a)
  - Clear typography hierarchy (species > location > date > journal)
  - Emoji decorations (🐱 for species, 📍 for location, 📅 for date)
  - Proper spacing and padding (20px margins)

#### Scenario: Card is optimized for vertical sharing
- **WHEN** share card is generated
- **THEN** dimensions are 600x800px (vertical, phone-friendly)
  - Aspect ratio suits vertical phone screenshots
  - Text size is readable even when shared as small thumbnail

#### Scenario: Photo scaling preserves aspect ratio
- **WHEN** encounter photo is rendered on share card
- **THEN** photo scales to fit (object-fit: cover) without distortion
  - If photo is landscape, center-crop to fit top 40% of card
  - If photo is portrait, scale to fit with padding

---

### Requirement: Clipboard Support with Fallback
The system SHALL support copying the share card image to clipboard via Clipboard API. If Clipboard API is unavailable, system SHALL offer file download as fallback.

#### Scenario: Clipboard API available and image copied
- **WHEN** user clicks "复制到剪贴板" on modern browser
- **THEN** system:
  - Converts Canvas to Blob
  - Writes Blob to clipboard via navigator.clipboard.write()
  - Shows success message: "已复制到剪贴板"

#### Scenario: Clipboard API unavailable
- **WHEN** user clicks "复制到剪贴板" on older browser (no Clipboard support)
- **THEN** system falls back to:
  - Download PNG file instead, OR
  - Show error message with manual download option

#### Scenario: Download file has descriptive name
- **WHEN** share card PNG is downloaded
- **THEN** file is named: `encounter_[SPECIES]_[DATE].png`
  - Example: `encounter_橘猫_20260427.png`
