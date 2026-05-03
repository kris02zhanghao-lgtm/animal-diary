import { createClient } from '@supabase/supabase-js'
import {
  createRequestContext,
  ensureMethod,
  getBearerToken,
  getSupabaseEnv,
  logError,
  logInfo,
  sendError,
} from './_lib/http.js'

export default async function handler(req, res) {
  const context = createRequestContext(req)
  if (!ensureMethod(req, res, 'GET')) {
    return
  }

  const token = getBearerToken(req)
  if (!token) {
    logInfo(context, 'missing_auth_token')
    return sendError(res, 401, '缺少身份验证信息，请重新登录', 'AUTH_REQUIRED')
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  if (!supabaseUrl || !supabaseAnonKey) {
    logInfo(context, 'missing_supabase_env')
    return sendError(res, 500, 'Supabase 服务端配置缺失', 'SERVER_MISCONFIGURED')
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  try {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      logError(context, 'list_records_failed', error)
      return sendError(res, 500, error.message || '读取记录失败', 'LIST_RECORDS_FAILED')
    }

    const records = data || []

    // 查询反向关联：找出所有指向当前用户记录的关联
    const recordIds = records.map(r => r.id)
    const { data: linkedFromData, error: linkedFromError } = await supabase
      .from('records')
      .select('id, species, similarity_score, created_at, image_base64, similar_record_id')
      .in('similar_record_id', recordIds)
      .not('similar_record_id', 'is', null)
      .order('similarity_score', { ascending: false })

    if (linkedFromError) {
      logError(context, 'list_records_linked_from_failed', linkedFromError)
      // 继续返回主记录，linked_from 设为空数组
    }

    // 为每条记录关联反向引用数据（最多 3 条）
    const linkedFromMap = {}
    if (linkedFromData) {
      linkedFromData.forEach(record => {
        const targetId = record.similar_record_id
        if (!linkedFromMap[targetId]) {
          linkedFromMap[targetId] = []
        }
        if (linkedFromMap[targetId].length < 3) {
          linkedFromMap[targetId].push({
            id: record.id,
            species: record.species,
            similarity_score: record.similarity_score,
            created_at: record.created_at,
            image_base64: record.image_base64,
          })
        }
      })
    }

    // 将 linked_from 数据附加到每条记录
    const enrichedRecords = records.map(record => ({
      ...record,
      linked_from: linkedFromMap[record.id] || [],
    }))

    logInfo(context, 'list_records_succeeded', { count: enrichedRecords.length })
    return res.status(200).json({ success: true, records: enrichedRecords })
  } catch (error) {
    logError(context, 'list_records_crashed', error)
    return sendError(res, 500, error.message || '读取记录失败', 'LIST_RECORDS_CRASHED')
  }
}
