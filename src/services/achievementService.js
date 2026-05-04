import {
  ACHIEVEMENTS,
  detectAchievements,
  evaluateAchievements,
} from './achievementRules'

function mergeAchievementMeta(results) {
  const resultMap = new Map(results.map((result) => [result.id, result]))

  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    ...(resultMap.get(achievement.id) || {}),
  }))
}

export function compareAchievements(previous = [], current = []) {
  const previousSet = new Set(previous)
  return current.filter((achievementId) => !previousSet.has(achievementId))
}

export function getAchievements(records) {
  try {
    const results = evaluateAchievements(records)

    return {
      achievements: mergeAchievementMeta(results),
      unlockedIds: detectAchievements(records),
      progressById: Object.fromEntries(results.map((result) => [result.id, result])),
    }
  } catch (error) {
    console.error('Failed to evaluate achievements:', error)
    return {
      achievements: mergeAchievementMeta([]),
      unlockedIds: [],
      progressById: {},
    }
  }
}
