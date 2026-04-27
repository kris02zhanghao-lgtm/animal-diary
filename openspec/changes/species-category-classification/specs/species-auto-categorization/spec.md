## ADDED Requirements

### Requirement: AI auto-categorizes species into broad categories

After identifying the species, the system SHALL call AI again to categorize it into one of six broad categories: 猫、狗、鸟、松鼠、兔子、其他.

#### Scenario: Cat species categorized correctly
- **WHEN** AI identifies species as "虎斑猫" or "橘猫"
- **THEN** system calls AI with prompt asking for category
- **AND** AI returns category: "猫"
- **AND** recognition response includes `category: "猫"`

#### Scenario: Dog species categorized correctly
- **WHEN** AI identifies species as "柯基" or "泰迪"
- **THEN** system categorizes as "狗"

#### Scenario: Unknown animal defaults to "其他"
- **WHEN** AI cannot confidently categorize
- **THEN** system returns category: "其他"

#### Scenario: Category is consistent across similar species
- **WHEN** user uploads multiple cat photos (虎斑猫、橘猫、奶牛猫)
- **THEN** all return `category: "猫"`
- **AND** pokedex aggregates them under one "猫" card
