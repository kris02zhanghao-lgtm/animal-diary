function randomId() {
  return Math.random().toString(36).slice(2, 8)
}

export function createRequestContext(req) {
  return {
    requestId: req.headers['x-vercel-id'] || `${Date.now().toString(36)}-${randomId()}`,
    method: req.method,
    path: req.url || '',
  }
}

export function logInfo(context, event, extra = {}) {
  console.info(`[api] ${event}`, {
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    ...extra,
  })
}

export function logError(context, event, error, extra = {}) {
  console.error(`[api] ${event}`, {
    requestId: context.requestId,
    method: context.method,
    path: context.path,
    message: error?.message || String(error),
    ...extra,
  })
}

export function sendError(res, status, message, code) {
  return res.status(status).json({
    success: false,
    error: message,
    code,
  })
}

export function ensureMethod(req, res, method) {
  if (req.method !== method) {
    sendError(res, 405, 'Method not allowed', 'METHOD_NOT_ALLOWED')
    return false
  }

  return true
}

export function getBearerToken(req) {
  const authHeader = req.headers.authorization || ''
  return authHeader.replace('Bearer ', '')
}

export function getSupabaseEnv() {
  return {
    supabaseUrl: process.env.VITE_SUPABASE_URL,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  }
}

export function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY
}
