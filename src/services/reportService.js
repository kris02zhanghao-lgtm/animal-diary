import { getRecords } from './supabaseService'

function normalizeRecord(record) {
  return {
    ...record,
    createdAt: record.created_at ?? record.createdAt,
    location: record.location?.trim() || '未填写地点',
    species: record.species?.trim() || '未命名动物',
  }
}

export function calculateDateRange(timeRange, now = new Date()) {
  const currentDate = new Date(now)

  if (timeRange === 'naturalYear') {
    const startDate = new Date(currentDate.getFullYear(), 0, 1, 0, 0, 0, 0)
    const endDate = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999)

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }
  }

  const startDate = new Date(currentDate)
  startDate.setMonth(startDate.getMonth() - 3)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(currentDate)
  endDate.setHours(23, 59, 59, 999)

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  }
}

export function aggregateSpecies(records) {
  const speciesMap = records.reduce((map, record) => {
    const key = record.species
    map[key] = (map[key] || 0) + 1
    return map
  }, {})

  return Object.entries(speciesMap)
    .map(([species, count]) => ({ species, count }))
    .sort((a, b) => b.count - a.count || a.species.localeCompare(b.species, 'zh-Hans-CN'))
    .slice(0, 3)
}

export function aggregateLocations(records) {
  const locationMap = records.reduce((map, record) => {
    const key = record.location
    map[key] = (map[key] || 0) + 1
    return map
  }, {})

  return Object.entries(locationMap)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count || a.location.localeCompare(b.location, 'zh-Hans-CN'))
    .slice(0, 3)
}

export function aggregateMonths(records) {
  const monthMap = records.reduce((map, record) => {
    const date = new Date(record.createdAt)
    const month = `${date.getMonth() + 1}月`
    map[month] = (map[month] || 0) + 1
    return map
  }, {})

  const monthStats = Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => b.count - a.count || Number.parseInt(a.month, 10) - Number.parseInt(b.month, 10))

  return {
    months: monthStats,
    mostActiveMonth: monthStats[0] || null,
  }
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
