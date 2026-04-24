# Animal Emoji Mapping Capability

## ADDED Requirements

### Requirement: Species string maps to an emoji via a three-level lookup
The AnimalEmojiMapper module SHALL implement a three-level lookup:
1. **L1 (具体种类)**: 精确匹配，如"橘猫" → 🐱
2. **L2 (通用分类)**: 关键词匹配，如包含"猫"的都映射到 🐱
3. **L3 (兜底)**: 无法匹配时返回 ❓

#### Scenario: L1 exact match
- **WHEN** species is "橘猫"
- **THEN** getEmojiForSpecies returns "🐱"

#### Scenario: L1 exact match for different cat breed
- **WHEN** species is "奶牛猫"
- **THEN** getEmojiForSpecies returns "🐱"

#### Scenario: L2 keyword fallback
- **WHEN** species contains "猫" but is not in the L1 table
- **THEN** getEmojiForSpecies returns "🐱"

#### Scenario: L2 keyword fallback for birds
- **WHEN** species contains "鸟" or "雀" or "鸽" but is not in the L1 table
- **THEN** getEmojiForSpecies returns "🐦"

#### Scenario: L3 fallback for unknown species
- **WHEN** species is an unrecognized string with no keyword match
- **THEN** getEmojiForSpecies returns "❓"

#### Scenario: Empty or null species
- **WHEN** species is empty string or null
- **THEN** getEmojiForSpecies returns "❓"

### Requirement: Emoji mapping table covers common urban animals
The L1 table SHALL include at least the following species and their common variants:

| 类别 | 覆盖种类示例 | Emoji |
|------|------------|-------|
| 猫类 | 橘猫、奶牛猫、黑猫、白猫、三花猫、虎斑猫、狸花猫、布偶猫 | 🐱 |
| 狗类 | 金毛、柴犬、边牧、泰迪、比熊、博美、拉布拉多 | 🐶 |
| 鸟类 | 麻雀、喜鹊、乌鸦、山雀、白鸽、鸽子、翠鸟、燕子 | 🐦 |
| 啮齿 | 松鼠、花栗鼠、仓鼠、田鼠 | 🐿️ |
| 兔类 | 兔子、野兔 | 🐰 |
| 刺猬 | 刺猬 | 🦔 |
| 乌龟 | 乌龟、巴西龟 | 🐢 |
| 蛇类 | 蛇、翠青蛇、玉米蛇 | 🐍 |
| 蜥蜴 | 蜥蜴、石龙子 | 🦎 |
| 青蛙 | 青蛙、蟾蜍、雨蛙 | 🐸 |
| 鱼类 | 锦鲤、金鱼、鲫鱼 | 🐟 |
| 浣熊 | 浣熊 | 🦝 |
| 鸭子 | 鸭子、野鸭、绿头鸭 | 🦆 |
| 天鹅 | 天鹅 | 🦢 |
| 螳螂 | 螳螂 | 🦗 |
| 蝴蝶 | 蝴蝶 | 🦋 |
| 蜻蜓 | 蜻蜓 | 🪲 |

#### Scenario: Table lookup for dog breed
- **WHEN** species is "金毛"
- **THEN** getEmojiForSpecies returns "🐶"

#### Scenario: Table lookup for turtle
- **WHEN** species is "乌龟"
- **THEN** getEmojiForSpecies returns "🐢"
