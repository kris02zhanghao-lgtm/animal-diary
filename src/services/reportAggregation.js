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
