import { getAccessToken } from './authService'

async function authHeaders() {
  try {
    const token = await getAccessToken()
    return { Authorization: `Bearer ${token}` }
  } catch {
    return {}
  }
}

async function requestJson(path, options, fallback) {
  const res = await fetch(path, options)
  const result = await res.json().catch(() => null)
  if (!res.ok || !result?.success) {
    throw new Error(result?.error || fallback)
  }
  return result
}

export async function getCollectionShare() {
  const headers = await authHeaders()
  const result = await requestJson('/api/share-collection', { headers }, '查询失败')
  return result.share
}

export async function createCollectionShare() {
  const headers = await authHeaders()
  const result = await requestJson('/api/share-collection', {
    method: 'POST',
    headers,
  }, '创建失败')
  return result.share
}

export async function deleteCollectionShare() {
  const headers = await authHeaders()
  await requestJson('/api/share-collection', {
    method: 'DELETE',
    headers,
  }, '删除失败')
}

export async function getPublicCollection(token) {
  const res = await fetch(`/api/public-collection/${token}`)
  const result = await res.json().catch(() => null)
  if (!res.ok || !result?.success) {
    const err = new Error(result?.error || '加载失败')
    err.status = res.status
    throw err
  }
  return result
}
