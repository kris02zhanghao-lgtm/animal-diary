## ADDED Requirements

### Requirement: Generate Annual Encounter Report
The system SHALL generate a report summarizing the user's annual animal encounters (January - December of current year). The report SHALL display total encounter count, top 3 species, most visited locations, and most active month.

#### Scenario: User views annual report
- **WHEN** user navigates to Report page and selects "自然年" (Annual) view
- **THEN** system aggregates all records from January 1 - December 31 of current year and displays:
  - Total count: "你今年遇见了 X 只动物"
  - Top 3 species by encounter count with frequency
  - Top 3 locations by encounter count
  - Most active month with count

#### Scenario: Annual report with no data
- **WHEN** user views Annual report but has zero encounters in current year
- **THEN** system displays: "还没有偶遇呢，去记录你的第一次发现吧 🐾"

#### Scenario: Annual report with insufficient data
- **WHEN** user views Annual report and has 1-4 encounters total
- **THEN** system displays the available data with message: "数据还在积累，继续探索城市吧"

---

### Requirement: Generate Recent 3-Month Encounter Report
The system SHALL generate a report summarizing the user's encounters from the last 3 calendar months (inclusive). The report format and data dimensions match the annual report.

#### Scenario: User views recent 3-month report
- **WHEN** user navigates to Report page and selects "最近三个月" (Recent 3 months) view
- **THEN** system aggregates all records from 90 days ago (or 3 most recent calendar months) to today and displays:
  - Total count: "最近三个月，你遇见了 X 只动物"
  - Top 3 species by encounter count
  - Top 3 locations by encounter count
  - Most active month in this period

#### Scenario: Recent 3-month report with no data
- **WHEN** user views Recent 3 months report and has zero encounters in this period
- **THEN** system displays: "还没有在这个季度遇到新的朋友，多去探索吧 🗺️"

---

### Requirement: Time Window Toggle
The system SHALL provide a UI control to switch between "最近三个月" and "自然年" report views. The selected time window SHALL persist during the current session.

#### Scenario: User toggles between time windows
- **WHEN** user clicks on "最近三个月" button from "自然年" view
- **THEN** system re-renders report with 3-month data, maintaining scroll position

#### Scenario: User navigates away and returns to report
- **WHEN** user leaves Report page and returns later
- **THEN** Report page resets to "最近三个月" as default view

---

### Requirement: Report Navigation Tab
The system SHALL add a new "报告" (Report) tab to the bottom navigation bar, alongside existing Time line, Map, Create, and Collection tabs.

#### Scenario: User clicks report tab
- **WHEN** user taps "报告" icon in BottomTabBar
- **THEN** system navigates to ReportPage and displays the report

#### Scenario: Report tab visibility
- **WHEN** user views BottomTabBar
- **THEN** "报告" tab is always visible and clickable on both desktop and mobile

---

### Requirement: Report Data Accuracy
The system SHALL ensure all reported numbers accurately reflect the underlying records in the database. Data aggregation SHALL query the Supabase records table with appropriate filters.

#### Scenario: New record added, report updates
- **WHEN** user saves a new encounter record
- **THEN** upon returning to or refreshing the Report page, the new record is included in the aggregated totals

#### Scenario: Record deleted, report updates
- **WHEN** user deletes an encounter record
- **THEN** upon refreshing Report page, the deleted record is removed from aggregated data
