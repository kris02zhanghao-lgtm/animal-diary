import { supabase } from './supabaseClient'
import { retryAsync, withTimeout } from '../utils/promiseUtils'

const SESSION_TIMEOUT_MS = 8000
const SESSION_ATTEMPTS = 2
const SESSION_RETRY_DELAY_MS = 500

let pendingSessionPromise = null

async function establishSession() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (sessionData.session) return sessionData.session

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  if (!data.session) throw new Error('未能获取会话')
  return data.session
}

export function ensureSession() {
  if (pendingSessionPromise) return pendingSessionPromise

  const request = retryAsync(
    () => withTimeout(establishSession(), SESSION_TIMEOUT_MS, '会话连接超时'),
    {
      attempts: SESSION_ATTEMPTS,
      delayMs: SESSION_RETRY_DELAY_MS,
      // A timed-out SDK request cannot be cancelled here. Starting another one
      // could create overlapping anonymous sign-ins, so timeout waits for the
      // user's explicit retry instead.
      shouldRetry: error => error?.code !== 'OPERATION_TIMEOUT',
    },
  )

  const trackedRequest = request.finally(() => {
    if (pendingSessionPromise === trackedRequest) {
      pendingSessionPromise = null
    }
  })

  pendingSessionPromise = trackedRequest
  return trackedRequest
}

export function getSessionErrorMessage(error) {
  if (error?.code === 'OPERATION_TIMEOUT') {
    return '连接服务超时，请检查网络后重试'
  }
  return '无法建立会话，请检查网络后重试'
}

export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('会话不存在，请刷新页面')
  return session.access_token
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}
