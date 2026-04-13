import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { image_base64, location, title, species, journal } = req.body || {}

  if (!image_base64 || !species || !journal) {
    return res.status(400).json({ success: false, error: '缺少必要字段，无法保存记录' })
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
      .insert([
        {
          image_base64,
          location: location || '城市某处',
          title: title || species,
          species,
          journal,
        },
      ])
      .select()
      .single()

    if (error) {
      return res.status(500).json({ success: false, error: error.message || '保存失败，请重试' })
    }

    return res.status(200).json({ success: true, record: data })
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || '保存失败，请重试' })
  }
}
