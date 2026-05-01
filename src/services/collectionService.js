export function getSpeciesStats(records) {
  if (!records || records.length === 0) {
    return []
  }

  const categoryMap = {}
  records.forEach((record) => {
    const category = record.category?.trim() || '其他'
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        records: [],
      }
    }
    categoryMap[category].records.push(record)
  })

  const stats = Object.values(categoryMap).map((item) => {
    const count = item.records.length
    const sortedByDate = item.records.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
    const latestRecord = sortedByDate[0]

    return {
      category: item.category,
      count,
      latestRecord,
      latestPhoto: latestRecord.imageBase64,
      mostRecentLocation: latestRecord.location || '暂无地点',
      allRecords: item.records,
    }
  })

  stats.sort((a, b) => b.count - a.count)

  return stats
}
