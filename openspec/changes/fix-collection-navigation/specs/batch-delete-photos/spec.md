## MODIFIED Requirements

### Requirement: Long-press enters selection mode on collection page

The collection page SHALL distinguish between a normal click (which navigates to detail) and a long-press (which enters selection mode). A long-press is defined as holding the mouse button or touch for 500ms without movement.

#### Scenario: Normal click navigates to detail on non-touch device
- **WHEN** user clicks (press and release within 500ms) a photo card in collection grid
- **THEN** system navigates to timeline page and expands that record's detail view

#### Scenario: Long-press enters selection mode on non-touch device
- **WHEN** user presses and holds (500ms+) a photo card in collection grid
- **THEN** system enters selection mode, displays checkbox indicators, and selects that record

#### Scenario: Normal tap navigates to detail on touch device
- **WHEN** user taps (press and release within 500ms) a photo card in collection grid
- **THEN** system navigates to timeline page and expands that record's detail view

#### Scenario: Long-press enters selection mode on touch device
- **WHEN** user presses and holds (500ms+) a photo card in collection grid
- **THEN** system enters selection mode, displays checkbox indicators, and selects that record

#### Scenario: Touch movement cancels long-press detection
- **WHEN** user presses and drags (onTouchMove) a photo card before 500ms
- **THEN** system treats it as a swipe gesture and cancels long-press detection
