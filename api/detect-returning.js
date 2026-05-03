import { createClient } from '@supabase/supabase-js'
import {
  createRequestContext,
  ensureMethod,
  getBearerToken,
  getSupabaseEnv,
  getServiceRoleKey,
  logInfo,
  sendError,
} from './_lib/http.js'
import { performDetectReturning } from './_lib/detectReturning.js'

export default async function handler(req, res) {
  const context = createRequestContext(req)
  if (!ensureMethod(req, res, 'POST')) {
    return
  }

  const { recordId } = req.body || {}

  if (!recordId) {
    logInfo(context, 'detect_returning_missing_record_id')
    return sendError(res, 400, 'Missing recordId', 'MISSING_RECORD_ID')
  }

  const token = getBearerToken(req)
  if (!token) {
    logInfo(context, 'detect_returning_missing_auth')
    return sendError(res, 401, '缺少身份验证信息', 'AUTH_REQUIRED')
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  const serviceRoleKey = getServiceRoleKey()

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    logInfo(context, 'detect_returning_missing_env')
    return sendError(res, 500, 'Supabase 配置缺失', 'SERVER_MISCONFIGURED')
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini'

  if (!apiKey) {
    logInfo(context, 'detect_returning_missing_api_key')
    return sendError(res, 500, 'API key not configured', 'SERVER_MISCONFIGURED')
  }

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

  const result = await performDetectReturning(context, recordId, supabaseUser, supabaseAdmin, apiKey, model)
  return res.status(200).json(result)
}
