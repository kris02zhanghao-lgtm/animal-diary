import test from 'node:test'
import assert from 'node:assert/strict'
import {
  aggregateLocations,
  aggregateMonths,
  aggregateSpecies,
  calculateDateRange,
} from '../src/services/reportAggregation.js'

test('calculateDateRange returns full natural year bounds', () => {
  const now = new Date('2026-05-01T10:20:30.000Z')
  const { startDate, endDate } = calculateDateRange('naturalYear', now)
  const start = new Date(startDate)
  const end = new Date(endDate)

  assert.equal(start.getFullYear(), 2026)
  assert.equal(start.getMonth(), 0)
  assert.equal(start.getDate(), 1)
  assert.equal(start.getHours(), 0)
  assert.equal(start.getMinutes(), 0)

  assert.equal(end.getFullYear(), 2026)
  assert.equal(end.getMonth(), 11)
  assert.equal(end.getDate(), 31)
  assert.equal(end.getHours(), 23)
  assert.equal(end.getMinutes(), 59)
})

test('aggregateSpecies sorts by count then locale and keeps top 3', () => {
  const records = [
    { species: '鸽子' },
    { species: '橘猫' },
    { species: '麻雀' },
    { species: '橘猫' },
    { species: '麻雀' },
    { species: '白猫' },
  ]

  assert.deepEqual(aggregateSpecies(records), [
    { species: '橘猫', count: 2 },
    { species: '麻雀', count: 2 },
    { species: '白猫', count: 1 },
  ])
})

test('aggregateLocations sorts by count then locale and keeps top 3', () => {
  const records = [
    { location: '公园' },
    { location: '小区' },
    { location: '公园' },
    { location: '街角' },
    { location: '小区' },
    { location: '学校' },
  ]

  const result = aggregateLocations(records)

  assert.deepEqual(result.slice(0, 2), [
    { location: '公园', count: 2 },
    { location: '小区', count: 2 },
  ])
  assert.equal(result.length, 3)
  assert.equal(result[2].count, 1)
  assert.match(result[2].location, /^(学校|街角)$/)
})

test('aggregateMonths returns most active month and ordered month list', () => {
  const records = [
    { createdAt: '2026-03-01T08:00:00.000Z' },
    { createdAt: '2026-03-02T08:00:00.000Z' },
    { createdAt: '2026-01-03T08:00:00.000Z' },
    { createdAt: '2026-02-04T08:00:00.000Z' },
  ]

  assert.deepEqual(aggregateMonths(records), {
    months: [
      { month: '3月', count: 2 },
      { month: '1月', count: 1 },
      { month: '2月', count: 1 },
    ],
    mostActiveMonth: { month: '3月', count: 2 },
  })
})
