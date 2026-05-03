import { getAccessToken } from './authService'

async function authHeaders() {
  try {
    const token = await getAccessToken()
    return { Authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

function handleAuthError(response) {
  if (response.status === 401) {
    throw new Error('登录已失效，请刷新页面')
  }
}

async function safeParseJson(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function requestJson(path, options = {}, fallbackMessage) {
  try {
    const response = await fetch(path, options)
    handleAuthError(response)
    const result = await safeParseJson(response)

    if (!response.ok || !result?.success) {
      throw new Error(result?.error || fallbackMessage)
    }

    return result
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('网络连接失败，请稍后重试')
    }
    throw error
  }
}

export async function getRecords() {
  try {
    const headers = await authHeaders()
    const result = await requestJson('/api/list-records', { headers }, '读取记录失败')
    return result.records || []
  } catch (err) {
    console.error('Error fetching records:', err)
    throw err
  }
}

export async function saveRecord(record) {
  try {
    const headers = await authHeaders()
    const result = await requestJson('/api/save-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(record),
    }, '保存失败，请重试')

    return {
      record: result.record || null,
      returningDetection: result.returningDetection || { detected: false },
    }
  } catch (err) {
    console.error('Error saving record:', err)
    throw err
  }
}

export async function updateRecord(id, fields) {
  try {
    const headers = await authHeaders()
    await requestJson('/api/update-record', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ id, ...fields }),
    }, '更新失败，请重试')
  } catch (err) {
    console.error('Error updating record:', err)
    throw err
  }
}

export async function deleteRecord(id) {
  try {
    const headers = await authHeaders()
    await requestJson('/api/delete-record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ id }),
    }, '删除记录失败')
  } catch (err) {
    console.error('Error deleting record:', err)
    throw err
  }
}

export async function confirmReturning(recordId) {
  try {
    const headers = await authHeaders()
    await requestJson('/api/confirm-returning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ recordId }),
    }, '确认失败，请重试')
  } catch (err) {
    console.error('Error confirming returning:', err)
    throw err
  }
}

export async function detectReturning(recordId) {
  try {
    const headers = await authHeaders()
    const result = await requestJson('/api/detect-returning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ recordId }),
    }, '检测失败，请重试')

    return result
  } catch (err) {
    console.error('Error detecting returning:', err)
    throw err
  }
}
