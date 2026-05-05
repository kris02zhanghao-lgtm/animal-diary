/**
 * @typedef {Object} AchievementRecord
 * @property {string} [speciesTag]
 * @property {string} [species_tag]
 * @property {string} [species]
 * @property {string} [location]
 * @property {string} [createdAt]
 * @property {string} [created_at]
 */

export const ACHIEVEMENTS = [
  {
    id: 'cat-color-master',
    name: '猫色大师',
    icon: '🐱',
    description: '你已经能从城市角落里认出一整套猫猫花色谱系了。',
    condition: '遇见至少 5 种不同类型的猫猫',
  },
  {
    id: 'night-owl',
    name: '夜行者',
    icon: '🌙',
    description: '当大多数人睡着时，你还在和夜色里的小动物打照面。',
    condition: '在 22:00 到次日 06:00 之间记录至少 1 次偶遇',
  },
  {
    id: 'old-friend',
    name: '老朋友',
    icon: '🤝',
    description: '有些地点已经像固定会面的老地方，总会遇见熟悉的身影。',
    condition: '同一地点累计记录至少 3 次',
  },
  {
    id: 'world-traveler',
    name: '跨城旅行家',
    icon: '🧭',
    description: '你的偶遇不只发生在一座城，观察版图已经开始扩张。',
    condition: '在至少 2 个不同城市留下偶遇记录',
  },
  {
    id: 'record-maniac',
    name: '记录狂人',
    icon: '📚',
    description: '你已经把城市里的动物相遇，认真写成了一本厚厚的观察日记。',
    condition: '累计记录至少 50 次偶遇',
  },
]

function normalizeRecords(records = []) {
  return records
    .filter(Boolean)
    .map((record) => ({
      ...record,
      species: String(record.species ?? '').trim(),
      speciesTag: String(record.speciesTag ?? record.species_tag ?? '').trim(),
      location: String(record.location ?? '').trim(),
      createdAt: record.createdAt ?? record.created_at ?? '',
    }))
}

function safeDate(value) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function buildResult(achievementId, current, target, unlockedAt = null, extra = {}) {
  return {
    id: achievementId,
    current,
    target,
    unlocked: current >= target,
    progressLabel: `${Math.min(current, target)}/${target}`,
    unlockedAt,
    ...extra,
  }
}

function sortByCreatedAt(records) {
  return [...records].sort((a, b) => {
    const left = safeDate(a.createdAt)?.getTime() ?? Number.MAX_SAFE_INTEGER
    const right = safeDate(b.createdAt)?.getTime() ?? Number.MAX_SAFE_INTEGER
    return left - right
  })
}

function isCatSpecies(speciesTag) {
  return /猫/.test(speciesTag)
}

function normalizeCatSpeciesName(species) {
  return String(species).trim()
}

export function extractCity(location = '') {
  const trimmed = String(location).trim()
  if (!trimmed) return ''

  const parts = trimmed.split(/[\s,，/|｜·•-]+/).filter(Boolean)
  const primary = parts[0] || trimmed
  const cityMatch = primary.match(/^([\u4e00-\u9fa5]{2,3}市)/)
  if (cityMatch) return cityMatch[1]

  const districtMatch = primary.match(/^([\u4e00-\u9fa5]{2,3}(?:区|县))/)
  if (districtMatch) return districtMatch[1]

  // 初版只做轻量规则，城市后缀缺失时回退到前两个汉字。
  const plainChineseMatch = primary.match(/^([\u4e00-\u9fa5]{2})/)
  if (plainChineseMatch) return plainChineseMatch[1]

  return primary.slice(0, 12)
}

export function checkCatColorMaster(records) {
  const normalized = sortByCreatedAt(normalizeRecords(records))
  const seenCats = new Set()
  let unlockedAt = null

  for (const record of normalized) {
    if (!isCatSpecies(record.speciesTag)) continue
    const catSpeciesName = normalizeCatSpeciesName(record.species)
    if (!catSpeciesName) continue
    const beforeSize = seenCats.size
    seenCats.add(catSpeciesName)
    if (!unlockedAt && beforeSize < 5 && seenCats.size >= 5) {
      unlockedAt = record.createdAt
    }
  }

  return buildResult('cat-color-master', seenCats.size, 5, unlockedAt, {
    unitLabel: '种猫猫',
  })
}

export function checkNightOwl(records) {
  const normalized = sortByCreatedAt(normalizeRecords(records))
  const qualifyingRecord = normalized.find((record) => {
    const createdAt = safeDate(record.createdAt)
    if (!createdAt) return false
    const hour = createdAt.getHours()
    return hour >= 22 || hour < 6
  })

  return buildResult('night-owl', qualifyingRecord ? 1 : 0, 1, qualifyingRecord?.createdAt ?? null, {
    unitLabel: '次夜间记录',
  })
}

export function checkOldFriend(records) {
  const normalized = sortByCreatedAt(normalizeRecords(records))
  const locationCounts = new Map()
  let unlockedAt = null
  let maxCount = 0
  let bestLocation = ''

  for (const record of normalized) {
    const key = record.location || '未填写地点'
    const nextCount = (locationCounts.get(key) || 0) + 1
    locationCounts.set(key, nextCount)

    if (nextCount > maxCount) {
      maxCount = nextCount
      bestLocation = key
    }

    if (!unlockedAt && nextCount >= 3) {
      unlockedAt = record.createdAt
    }
  }

  return buildResult('old-friend', maxCount, 3, unlockedAt, {
    unitLabel: '次同地偶遇',
    highlight: bestLocation,
  })
}

export function checkWorldTraveler(records) {
  const normalized = sortByCreatedAt(normalizeRecords(records))
  const seenCities = new Set()
  let unlockedAt = null

  for (const record of normalized) {
    const city = extractCity(record.location)
    if (!city) continue
    const beforeSize = seenCities.size
    seenCities.add(city)
    if (!unlockedAt && beforeSize < 2 && seenCities.size >= 2) {
      unlockedAt = record.createdAt
    }
  }

  return buildResult('world-traveler', seenCities.size, 2, unlockedAt, {
    unitLabel: '座城市',
  })
}

export function checkRecordManiac(records) {
  const normalized = sortByCreatedAt(normalizeRecords(records))
  const unlockedAt = normalized[49]?.createdAt ?? null

  return buildResult('record-maniac', normalized.length, 50, unlockedAt, {
    progressLabel: `${normalized.length}/50`,
    unitLabel: '次记录',
  })
}

export function evaluateAchievements(records) {
  return [
    checkCatColorMaster(records),
    checkNightOwl(records),
    checkOldFriend(records),
    checkWorldTraveler(records),
    checkRecordManiac(records),
  ]
}

export function detectAchievements(records) {
  return evaluateAchievements(records)
    .filter((achievement) => achievement.unlocked)
    .map((achievement) => achievement.id)
}
