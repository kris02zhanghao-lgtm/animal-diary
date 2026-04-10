export async function getRecords() {
  try {
    const response = await fetch('/api/list-records')
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || '读取记录失败')
    }

    return result.records || []
  } catch (err) {
    console.error('Error fetching records:', err)
    throw err
  }
}

export async function saveRecord(record) {
  try {
    const response = await fetch('/api/save-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || '保存失败，请重试')
    }

    return result.record || null
  } catch (err) {
    console.error('Error saving record:', err)
    throw err
  }
}

export async function deleteRecord(id) {
  try {
    const response = await fetch('/api/delete-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || '删除记录失败')
    }
  } catch (err) {
    console.error('Error deleting record:', err)
    throw err
  }
}
