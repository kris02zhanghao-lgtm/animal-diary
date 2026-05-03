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
import { generateInsights } from './_lib/insightsGenerator.js'

const DEFAULT_MODEL = 'openai/gpt-4o-mini'

export default async function handler(req, res) {
  const context = createRequestContext(req)
  if (!ensureMethod(req, res, 'POST')) {
    return
  }

  const { timeWindow } = req.body || {}
  if (!['month', 'year'].includes(timeWindow)) {
    logInfo(context, 'generate_insights_invalid_time_window', { timeWindow })
    return sendError(res, 400, '无效的 timeWindow 参数', 'INVALID_TIME_WINDOW')
  }

  const token = getBearerToken(req)
  if (!token) {
    logInfo(context, 'generate_insights_missing_auth')
    return sendError(res, 401, '缺少身份验证信息，请重新登录', 'AUTH_REQUIRED')
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  if (!supabaseUrl || !supabaseAnonKey) {
    logInfo(context, 'generate_insights_missing_supabase_env')
    return sendError(res, 500, 'Supabase 服务端配置缺失', 'SERVER_MISCONFIGURED')
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  const model =
    process.env.OPENROUTER_INSIGHTS_MODEL ||
    process.env.OPENROUTER_MODEL ||
    process.env.VITE_OPENROUTER_MODEL ||
    DEFAULT_MODEL
  if (!apiKey) {
    logInfo(context, 'generate_insights_missing_api_key', { model })
    return sendError(res, 500, 'API key not configured', 'SERVER_MISCONFIGURED')
  }

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: authData, error: authError } = await supabaseUser.auth.getUser()
  const userId = authData?.user?.id
  if (authError || !userId) {
    logError(context, 'generate_insights_auth_failed', authError || new Error('Missing user id'))
    return sendError(res, 401, '身份验证已失效，请重新登录', 'AUTH_REQUIRED')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const result = await generateInsights(context, supabaseUser, {
      userId,
      timeWindow,
      apiKey,
      model,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (result.recordCount < 5) {
      return res.status(200).json({
        success: true,
        insights: [],
        reason: 'insufficient_data',
        recordCount: result.recordCount,
      })
    }

    return res.status(200).json({
      success: true,
      insights: result.insights,
      recordCount: result.recordCount,
    })
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      logError(context, 'generate_insights_timeout', error, { timeWindow })
    } else {
      logError(context, 'generate_insights_crashed', error, { timeWindow })
    }

    return res.status(200).json({
      success: false,
      error: 'generation_failed',
      recordCount: error.recordCount || 0,
    })
  }
}
