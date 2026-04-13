import { supabase } from './supabaseClient'

export async function ensureSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) return session

  const { data, error } = await supabase.auth.signInAnonymously()
  if (error) throw error
  return data.session
}

export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('会话不存在，请刷新页面')
  return session.access_token
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}
