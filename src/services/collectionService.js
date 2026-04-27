export function getSpeciesStats(records) {
  if (!records || records.length === 0) {
    return []
  }

  const totalCount = records.length

  const speciesMap = {}
  records.forEach((record) => {
    const species = record.species?.trim()
    if (!species) return

    if (!speciesMap[species]) {
      speciesMap[species] = {
        species,
        records: [],
      }
    }
    speciesMap[species].records.push(record)
  })

  const stats = Object.values(speciesMap).map((item) => {
    const count = item.records.length
    const percentage = Math.round((count / totalCount) * 100)
    const sortedByDate = item.records.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    const latestRecord = sortedByDate[0]

    return {
      species: item.species,
      count,
      percentage,
      latestRecord,
      latestPhoto: latestRecord.imageBase64,
      mostRecentLocation: latestRecord.location || '暂无地点',
      allRecords: item.records,
    }
  })

  stats.sort((a, b) => b.count - a.count)

  return stats
}
