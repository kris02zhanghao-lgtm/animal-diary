import { getRecords } from './supabaseService.js'
import {
  aggregateLocations,
  aggregateMonths,
  aggregateSpecies,
  calculateDateRange,
} from './reportAggregation.js'

function normalizeRecord(record) {
  return {
    ...record,
    createdAt: record.created_at ?? record.createdAt,
    location: record.location?.trim() || '未填写地点',
    species: record.species?.trim() || '未命名动物',
  }
}

export {
  aggregateLocations,
  aggregateMonths,
  aggregateSpecies,
  calculateDateRange,
}

export async function generateReport(timeRange) {
  const { startDate, endDate } = calculateDateRange(timeRange)
  const allRecords = await getRecords()
  const filteredRecords = allRecords
    .map(normalizeRecord)
    .filter((record) => {
      const createdAt = new Date(record.createdAt).getTime()
      return createdAt >= new Date(startDate).getTime() && createdAt <= new Date(endDate).getTime()
    })

  const total = filteredRecords.length
  let status = 'ready'
  if (total === 0) {
    status = 'empty'
  } else if (total <= 2) {
    status = 'sparse'
  } else if (total <= 4) {
    status = 'growing'
  }
  const { months, mostActiveMonth } = aggregateMonths(filteredRecords)

  return {
    total,
    topSpecies: aggregateSpecies(filteredRecords),
    topLocations: aggregateLocations(filteredRecords),
    mostActiveMonth,
    monthlyCounts: months,
    hasData: total > 0,
    status,
    startDate,
    endDate,
    generatedAt: new Date().toISOString(),
  }
}
