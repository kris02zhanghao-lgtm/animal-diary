import test from 'node:test'
import assert from 'node:assert/strict'
import {
  checkCatColorMaster,
  checkNightOwl,
  checkOldFriend,
  checkRecordManiac,
  checkWorldTraveler,
  detectAchievements,
  extractCity,
} from '../src/services/achievementRules.js'

test('detectAchievements returns empty array for empty records', () => {
  assert.deepEqual(detectAchievements([]), [])
})

test('checkCatColorMaster tracks threshold and unlock time', () => {
  const locked = checkCatColorMaster([
    { species_tag: '橘猫', created_at: '2026-05-01T10:00:00' },
    { species_tag: '狸花猫', created_at: '2026-05-02T10:00:00' },
    { species_tag: '奶牛猫', created_at: '2026-05-03T10:00:00' },
  ])

  assert.equal(locked.unlocked, false)
  assert.equal(locked.progressLabel, '3/5')

  const unlocked = checkCatColorMaster([
    { species_tag: '橘猫', created_at: '2026-05-01T10:00:00' },
    { species_tag: '狸花猫', created_at: '2026-05-02T10:00:00' },
    { species_tag: '奶牛猫', created_at: '2026-05-03T10:00:00' },
    { species_tag: '黑猫', created_at: '2026-05-04T10:00:00' },
    { species_tag: '白猫', created_at: '2026-05-05T10:00:00' },
    { species_tag: '白猫', created_at: '2026-05-06T10:00:00' },
  ])

  assert.equal(unlocked.unlocked, true)
  assert.equal(unlocked.progressLabel, '5/5')
  assert.equal(unlocked.unlockedAt, '2026-05-05T10:00:00')
})

test('checkNightOwl only unlocks for 22:00-06:00 records', () => {
  const locked = checkNightOwl([{ created_at: '2026-05-01T21:59:00' }])
  assert.equal(locked.unlocked, false)

  const unlocked = checkNightOwl([
    { created_at: '2026-05-01T23:15:00' },
    { created_at: '2026-05-02T08:30:00' },
  ])

  assert.equal(unlocked.unlocked, true)
  assert.equal(unlocked.unlockedAt, '2026-05-01T23:15:00')
})

test('checkOldFriend unlocks when one location reaches three records', () => {
  const result = checkOldFriend([
    { location: '静安公园', created_at: '2026-05-01T10:00:00' },
    { location: '静安公园', created_at: '2026-05-02T10:00:00' },
    { location: '街角便利店', created_at: '2026-05-03T10:00:00' },
    { location: '静安公园', created_at: '2026-05-04T10:00:00' },
  ])

  assert.equal(result.unlocked, true)
  assert.equal(result.progressLabel, '3/3')
  assert.equal(result.highlight, '静安公园')
  assert.equal(result.unlockedAt, '2026-05-04T10:00:00')
})

test('extractCity uses lightweight location parsing rules', () => {
  assert.equal(extractCity('上海市徐汇区衡山路'), '上海市')
  assert.equal(extractCity('杭州西湖公园'), '杭州')
  assert.equal(extractCity('深圳湾公园'), '深圳')
})

test('checkWorldTraveler unlocks after the second distinct city', () => {
  const result = checkWorldTraveler([
    { location: '上海市徐汇区', created_at: '2026-05-01T10:00:00' },
    { location: '上海市静安区', created_at: '2026-05-02T10:00:00' },
    { location: '杭州西湖公园', created_at: '2026-05-03T10:00:00' },
  ])

  assert.equal(result.unlocked, true)
  assert.equal(result.progressLabel, '2/2')
  assert.equal(result.unlockedAt, '2026-05-03T10:00:00')
})

test('checkRecordManiac respects the 50-record boundary', () => {
  const almostThere = Array.from({ length: 49 }, (_, index) => ({
    created_at: `2026-05-${String((index % 28) + 1).padStart(2, '0')}T10:00:00`,
  }))
  const unlockedRecords = Array.from({ length: 50 }, (_, index) => ({
    created_at: `2026-05-${String((index % 28) + 1).padStart(2, '0')}T10:00:00`,
  }))

  assert.equal(checkRecordManiac(almostThere).unlocked, false)

  const unlocked = checkRecordManiac(unlockedRecords)
  assert.equal(unlocked.unlocked, true)
  assert.equal(unlocked.progressLabel, '50/50')
  assert.ok(unlocked.unlockedAt)
})
