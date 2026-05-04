import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import {
  createRequestContext,
  getBearerToken,
  getSupabaseEnv,
  logError,
  logInfo,
  sendError,
} from './_lib/http.js'

function generateToken() {
  return randomBytes(6).toString('hex')
}

function getAppUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https'
  const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'animal-diary.vercel.app'
  return `${proto}://${host}`
}

export default async function handler(req, res) {
  const context = createRequestContext(req)

  const token = getBearerToken(req)
  if (!token) {
    return sendError(res, 401, '缺少身份验证信息', 'AUTH_REQUIRED')
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv()
  if (!supabaseUrl || !supabaseAnonKey) {
    return sendError(res, 500, 'Supabase 服务端配置缺失', 'SERVER_MISCONFIGURED')
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('collection_shares')
      .select('token, created_at')
      .maybeSingle()

    if (error) {
      logError(context, 'get_share_token_failed', error)
      return sendError(res, 500, '查询失败', 'QUERY_FAILED')
    }

    if (!data) {
      return res.status(200).json({ success: true, share: null })
    }

    const shareUrl = `${getAppUrl(req)}/shared/${data.token}`
    return res.status(200).json({ success: true, share: { ...data, url: shareUrl } })
  }

  if (req.method === 'POST') {
    const { data: existing, error: queryError } = await supabase
      .from('collection_shares')
      .select('token, created_at')
      .maybeSingle()

    if (queryError) {
      logError(context, 'query_existing_share_failed', queryError)
      return sendError(res, 500, '查询失败', 'QUERY_FAILED')
    }

    if (existing) {
      const shareUrl = `${getAppUrl(req)}/shared/${existing.token}`
      return res.status(200).json({ success: true, share: { ...existing, url: shareUrl } })
    }

    const newToken = generateToken()
    const { data, error } = await supabase
      .from('collection_shares')
      .insert([{ token: newToken }])
      .select('token, created_at')
      .single()

    if (error) {
      logError(context, 'create_share_token_failed', error)
      return sendError(res, 500, '创建分享链接失败', 'CREATE_FAILED')
    }

    logInfo(context, 'share_token_created')
    const shareUrl = `${getAppUrl(req)}/shared/${data.token}`
    return res.status(200).json({ success: true, share: { ...data, url: shareUrl } })
  }

  if (req.method === 'DELETE') {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return sendError(res, 401, '身份验证失败', 'AUTH_FAILED')
    }

    const { error } = await supabase
      .from('collection_shares')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      logError(context, 'delete_share_token_failed', error)
      return sendError(res, 500, '删除失败', 'DELETE_FAILED')
    }

    logInfo(context, 'share_token_deleted')
    return res.status(200).json({ success: true })
  }

  return sendError(res, 405, 'Method not allowed', 'METHOD_NOT_ALLOWED')
}
