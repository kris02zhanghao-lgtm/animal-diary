## ADDED Requirements

### Requirement: Display personalized insights section
The report page SHALL display a new "你的动物观察记录" section that shows AI-generated personalized insights about the user's observation patterns.

#### Scenario: Insights section with data
- **WHEN** user opens report page and has ≥5 records in selected time window
- **THEN** page displays insights section below data summary with 3-5 personalized insights, each preceded by emoji and limited to one line

#### Scenario: Insights section loading state
- **WHEN** insights are being generated
- **THEN** section shows loading spinner with text "生成中..." to indicate async operation

#### Scenario: Insights section when insufficient data
- **WHEN** user has <5 records in selected time window
- **THEN** section displays friendly message "记录越多，洞察越有趣，继续探索吧！" instead of insights

#### Scenario: Insights section on API failure
- **WHEN** insight generation API fails or times out
- **THEN** section displays fallback message "数据整理中，下次打开会有更多发现" without error details

### Requirement: Support time window switching
Insights section SHALL regenerate content when user switches between "最近三个月" and "自然年" time windows.

#### Scenario: Window switch triggers regeneration
- **WHEN** user clicks time window toggle button in report page
- **THEN** insights section enters loading state, calls API with new window parameter, displays refreshed insights

### Requirement: Format and present insights visually
Each insight SHALL be displayed as a single line of text with visual enhancement (emoji prefix, consistent styling) that maintains the "story-telling" experience.

#### Scenario: Insight visual formatting
- **WHEN** insights are displayed
- **THEN** each insight has: emoji prefix (🌙/📍/🐾/etc), insight text (max 1 line), consistent font size larger than data labels

#### Scenario: Insight container styling
- **WHEN** insights section is rendered
- **THEN** section uses project's warm color palette (#f0e8d8, #fffdf7), rounded borders, and box shadow consistent with other cards
