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

    logInfo(context, 'list_records_succeeded', { count: data?.length || 0 })
    return res.status(200).json({ success: true, records: data || [] })
  } catch (error) {
    logError(context, 'list_records_crashed', error)
    return sendError(res, 500, error.message || '读取记录失败', 'LIST_RECORDS_CRASHED')
  }
}
