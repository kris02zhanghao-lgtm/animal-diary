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

  const { recordId } = req.body || {}

  if (!recordId) {
    logInfo(context, 'confirm_returning_missing_record_id')
    return sendError(res, 400, 'Missing recordId', 'MISSING_RECORD_ID')
  }

  const token = getBearerToken(req)
  if (!token) {
    logInfo(context, 'confirm_returning_missing_auth')
    return sendError(res, 401, '缺少身份验证信息', 'AUTH_REQUIRED')
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  if (!supabaseUrl || !supabaseAnonKey) {
    logInfo(context, 'confirm_returning_missing_env')
    return sendError(res, 500, 'Supabase 配置缺失', 'SERVER_MISCONFIGURED')
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  try {
    const { error } = await supabase
      .from('records')
      .update({ confirmed_returning: true })
      .eq('id', recordId)

    if (error) {
      logError(context, 'confirm_returning_failed', error)
      return sendError(res, 500, error.message || '确认失败，请重试', 'CONFIRM_FAILED')
    }

    logInfo(context, 'confirm_returning_succeeded', { recordId })
    return res.status(200).json({ success: true })
  } catch (error) {
    logError(context, 'confirm_returning_crashed', error)
    return sendError(res, 500, error.message || '确认失败，请重试', 'CONFIRM_CRASHED')
  }
}
