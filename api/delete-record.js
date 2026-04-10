import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { id } = req.body || {}

  if (!id) {
    return res.status(400).json({ success: false, error: '缺少记录 id，无法删除' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ success: false, error: 'Supabase 服务端配置缺失' })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  try {
    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ success: false, error: error.message || '删除记录失败' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || '删除记录失败' })
  }
}
