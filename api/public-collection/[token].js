import { createClient } from '@supabase/supabase-js'
import {
  createRequestContext,
  getSupabaseEnv,
  getServiceRoleKey,
  logError,
  sendError,
} from '../_lib/http.js'

export default async function handler(req, res) {
  const context = createRequestContext(req)

  if (req.method !== 'GET') {
    return sendError(res, 405, 'Method not allowed', 'METHOD_NOT_ALLOWED')
  }

  const { token } = req.query
  if (!token) {
    return sendError(res, 400, '缺少 token', 'MISSING_TOKEN')
  }

  const { supabaseUrl } = getSupabaseEnv()
  const serviceRoleKey = getServiceRoleKey()

  if (!supabaseUrl || !serviceRoleKey) {
    return sendError(res, 500, '服务端配置缺失', 'SERVER_MISCONFIGURED')
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

  const { data: share, error: shareError } = await supabaseAdmin
    .from('collection_shares')
    .select('user_id')
    .eq('token', token)
    .single()

  if (shareError || !share) {
    return sendError(res, 404, '分享链接不存在或已失效', 'TOKEN_NOT_FOUND')
  }

  const { data: records, error: recordsError } = await supabaseAdmin
    .from('records')
    .select('id, species, category, location, created_at, image_base64')
    .eq('user_id', share.user_id)
    .order('created_at', { ascending: false })

  if (recordsError) {
    logError(context, 'public_collection_fetch_failed', recordsError)
    return sendError(res, 500, '读取数据失败', 'FETCH_FAILED')
  }

  const speciesCount = {}
  const locationCount = {}

  for (const r of records) {
    const key = r.category?.trim() || r.species || '其他'
    speciesCount[key] = (speciesCount[key] || 0) + 1
    if (r.location) {
      locationCount[r.location] = (locationCount[r.location] || 0) + 1
    }
  }

  const topSpecies = Object.entries(speciesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }))

  const topLocation = Object.entries(locationCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)[0] || null

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  return res.status(200).json({
    success: true,
    records: records.map(r => ({
      ...r,
      imageBase64: r.image_base64,
      createdAt: r.created_at,
    })),
    stats: { total: records.length, topSpecies, topLocation },
  })
}
