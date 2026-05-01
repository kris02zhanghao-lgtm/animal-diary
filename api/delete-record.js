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
  if (!ensureMethod(req, res, 'POST')) {
    return
  }

  const { id } = req.body || {}

  if (!id) {
    logInfo(context, 'delete_record_missing_id')
    return sendError(res, 400, '缺少记录 id，无法删除', 'MISSING_RECORD_ID')
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
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      logError(context, 'delete_record_failed', error, { recordId: id })
      return sendError(res, 500, error.message || '删除记录失败', 'DELETE_RECORD_FAILED')
    }

    if (!data || data.length === 0) {
      logInfo(context, 'delete_record_forbidden', { recordId: id })
      return sendError(res, 403, '无权限删除此记录', 'DELETE_RECORD_FORBIDDEN')
    }

    logInfo(context, 'delete_record_succeeded', { recordId: id })
    return res.status(200).json({ success: true })
  } catch (error) {
    logError(context, 'delete_record_crashed', error, { recordId: id })
    return sendError(res, 500, error.message || '删除记录失败', 'DELETE_RECORD_CRASHED')
  }
}
