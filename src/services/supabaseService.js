import { getAccessToken } from './authService'

async function authHeaders() {
  try {
    const token = await getAccessToken()
    return { Authorization: `Bearer ${token}` }
  } catch (err) {
    return {}
  }
}

function handleAuthError(response) {
  if (response.status === 401) {
    throw new Error('登录已失效，请刷新页面')
  }
}

export async function getRecords() {
  try {
    const headers = await authHeaders()
    const response = await fetch('/api/list-records', { headers })
    handleAuthError(response)
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
    const headers = await authHeaders()
    const response = await fetch('/api/save-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(record),
    })

    handleAuthError(response)
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

export async function updateRecord(id, fields) {
  try {
    const headers = await authHeaders()
    const response = await fetch('/api/update-record', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ id, ...fields }),
    })

    handleAuthError(response)
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || '更新失败，请重试')
    }
  } catch (err) {
    console.error('Error updating record:', err)
    throw err
  }
}

export async function deleteRecord(id) {
  try {
    const headers = await authHeaders()
    const response = await fetch('/api/delete-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ id }),
    })

    handleAuthError(response)
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || '删除记录失败')
    }
  } catch (err) {
    console.error('Error deleting record:', err)
    throw err
  }
}
