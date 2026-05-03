import { createClient } from '@supabase/supabase-js'
import {
  createRequestContext,
  ensureMethod,
  getBearerToken,
  getSupabaseEnv,
  getServiceRoleKey,
  logError,
  logInfo,
  sendError,
} from './_lib/http.js'
import { performDetectReturning } from './_lib/detectReturning.js'

export default async function handler(req, res) {
  const context = createRequestContext(req)
  if (!ensureMethod(req, res, 'POST')) {
    return
  }

  const { image_base64, location, title, species, category, species_tag, journal, latitude, longitude } = req.body || {}

  if (!image_base64 || !species || !journal) {
    logInfo(context, 'save_record_missing_fields', {
      hasImage: Boolean(image_base64),
      hasSpecies: Boolean(species),
      hasJournal: Boolean(journal),
    })
    return sendError(res, 400, '缺少必要字段，无法保存记录', 'INVALID_RECORD_PAYLOAD')
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

  const serviceRoleKey = getServiceRoleKey()
  if (!serviceRoleKey) {
    logInfo(context, 'missing_service_role_key')
    return sendError(res, 500, 'Service role key 缺失', 'SERVER_MISCONFIGURED')
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  try {
    const { data, error } = await supabase
      .from('records')
      .insert([
        {
          image_base64,
          location: location || '城市某处',
          title: title || species,
          species,
          category: category || '其他',
          species_tag: species_tag || 'other-animal',
          journal,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
        },
      ])
      .select()
      .single()

    if (error) {
      logError(context, 'save_record_failed', error)
      return sendError(res, 500, error.message || '保存失败，请重试', 'SAVE_RECORD_FAILED')
    }

    const recordId = data?.id
    logInfo(context, 'save_record_succeeded', { recordId })

    let returningDetection = null
    try {
      const apiKey = process.env.OPENROUTER_API_KEY
      const model = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini'

      if (apiKey && model) {
        const supabaseUser = supabase
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

        returningDetection = await performDetectReturning(
          context,
          recordId,
          supabaseUser,
          supabaseAdmin,
          apiKey,
          model
        )
      }
    } catch (detectError) {
      logError(context, 'save_record_detect_returning_failed', detectError)
      // 检测失败不影响保存结果，继续返回成功
    }

    return res.status(200).json({
      success: true,
      record: data,
      returningDetection: returningDetection || { detected: false },
    })
  } catch (error) {
    logError(context, 'save_record_crashed', error)
    return sendError(res, 500, error.message || '保存失败，请重试', 'SAVE_RECORD_CRASHED')
  }
}
