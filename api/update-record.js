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
import { normalizeAnimalClassification } from './_lib/animalClassification.js'

export default async function handler(req, res) {
  const context = createRequestContext(req)
  if (!ensureMethod(req, res, 'PUT')) {
    return
  }

  const { id, ...fields } = req.body || {}

  if (!id) {
    logInfo(context, 'update_record_missing_id')
    return sendError(res, 400, '缺少记录 id', 'MISSING_RECORD_ID')
  }

  if (Object.keys(fields).length === 0) {
    logInfo(context, 'update_record_missing_fields', { recordId: id })
    return sendError(res, 400, '没有传入要更新的字段', 'MISSING_UPDATE_FIELDS')
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
    const nextFields = { ...fields }
    if (typeof nextFields.species === 'string' && nextFields.species.trim()) {
      const normalizedClassification = normalizeAnimalClassification(
        nextFields.species,
        nextFields.category,
        nextFields.species_tag
      )
      nextFields.category = normalizedClassification.category
      nextFields.species_tag = normalizedClassification.speciesTag
    }

    const { error } = await supabase
      .from('records')
      .update(nextFields)
      .eq('id', id)

    if (error) {
      logError(context, 'update_record_failed', error, { recordId: id })
      return sendError(res, 500, error.message || '更新失败，请重试', 'UPDATE_RECORD_FAILED')
    }

      logInfo(context, 'update_record_succeeded', {
      recordId: id,
      updatedFields: Object.keys(nextFields),
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    logError(context, 'update_record_crashed', error, { recordId: id })
    return sendError(res, 500, error.message || '更新失败，请重试', 'UPDATE_RECORD_CRASHED')
  }
}
