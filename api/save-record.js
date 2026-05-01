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

  const { image_base64, location, title, species, category, journal, latitude, longitude } = req.body || {}

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

    logInfo(context, 'save_record_succeeded', { recordId: data?.id || null })
    return res.status(200).json({ success: true, record: data })
  } catch (error) {
    logError(context, 'save_record_crashed', error)
    return sendError(res, 500, error.message || '保存失败，请重试', 'SAVE_RECORD_CRASHED')
  }
}
