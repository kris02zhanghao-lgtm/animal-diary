import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { id } = req.body || {}

  if (!id) {
    return res.status(400).json({ success: false, error: '缺少记录 id，无法删除' })
  }

  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ success: false, error: '缺少身份验证信息，请重新登录' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ success: false, error: 'Supabase 服务端配置缺失' })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  try {
    const { data, error } = await supabase
      .from('records')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      return res.status(500).json({ success: false, error: error.message || '删除记录失败' })
    }

    if (!data || data.length === 0) {
      return res.status(403).json({ success: false, error: '无权限删除此记录' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || '删除记录失败' })
  }
}
