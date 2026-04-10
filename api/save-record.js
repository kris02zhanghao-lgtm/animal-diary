import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { image_base64, location, title, species, journal } = req.body || {}

  if (!image_base64 || !species || !journal) {
    return res.status(400).json({ success: false, error: '缺少必要字段，无法保存记录' })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ success: false, error: 'Supabase 服务端配置缺失' })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

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
