const STORAGE_KEY = 'animal-diary-records'

export function getRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const records = raw ? JSON.parse(raw) : []
    return records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch {
    return []
  }
}

export function saveRecord(record) {
  try {
    const records = getRecords()
    records.push(record)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    throw new Error('保存失败：' + e.message)
  }
}

export function deleteRecord(id) {
  try {
    const records = getRecords()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.filter(r => r.id !== id)))
  } catch (e) {
    throw new Error('删除失败：' + e.message)
  }
}
