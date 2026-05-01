import test from 'node:test'
import assert from 'node:assert/strict'
import { getSpeciesStats } from '../src/services/collectionService.js'

test('getSpeciesStats groups records by category and sorts by count', () => {
  const records = [
    { id: 1, category: '猫', createdAt: '2026-05-01T10:00:00.000Z', imageBase64: 'cat-1', location: '公园' },
    { id: 2, category: '狗', createdAt: '2026-05-02T10:00:00.000Z', imageBase64: 'dog-1', location: '小区' },
    { id: 3, category: '猫', createdAt: '2026-05-03T10:00:00.000Z', imageBase64: 'cat-2', location: '街角' },
    { id: 4, category: '', createdAt: '2026-05-04T10:00:00.000Z', imageBase64: 'other-1', location: '' },
  ]

  const stats = getSpeciesStats(records)

  assert.equal(stats.length, 3)
  assert.equal(stats[0].category, '猫')
  assert.equal(stats[0].count, 2)
  assert.equal(stats[0].latestPhoto, 'cat-2')
  assert.equal(stats[0].mostRecentLocation, '街角')

  assert.equal(stats[1].category, '狗')
  assert.equal(stats[2].category, '其他')
  assert.equal(stats[2].mostRecentLocation, '暂无地点')
})
