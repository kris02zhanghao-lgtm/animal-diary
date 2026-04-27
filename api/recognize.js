export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { imageBase64, location } = req.body

  if (!imageBase64) {
    return res.status(400).json({ success: false, error: 'Missing imageBase64' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  console.log('[recognize] env check:', {
    hasKey: !!apiKey,
    keyLength: apiKey?.length,
    keyStart: apiKey?.slice(0, 10),
    allEnvKeys: Object.keys(process.env).filter(k => !k.includes('TOKEN') && !k.includes('SECRET')),
  })
  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'API key not configured' })
  }

  const locationText = location || '城市某处'

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 25000)

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://animal-diary.vercel.app',
        'X-Title': 'Animal Diary',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `你是一个城市动物观察站，正在为用户生成偶遇档案。

【任务】
1. 从预定义列表中选择最接近的物种
2. 生成10字以内的偶遇小标题，语气简练有趣
3. 写一段50-60字的中文偶遇日志（以「你」为主语）

【预定义物种列表（必须从中选择）】
猫：橘猫、虎斑猫、奶牛猫、三花猫、狸花猫、黑猫、白猫
狗：柯基、泰迪、萨摩耶、金毛、拉布拉多、哈士奇、柴犬、贵宾
鸟：喜鹊、乌鸦、鸽子、鹦鹉、麻雀、燕子、家鸡
其他：松鼠、兔子、刺猬

【识别规则（重要）】
- 物种名必须从列表中选择，不创建新名称
- 不因颜色不同就改名：橘色条纹、纯橘都是"橘猫"；黑白花纹都是"奶牛猫"
- 虎纹、棕虎纹都识别为"虎斑猫"
- 无法确定时选"其他"
- species字段只写物种名，不要附加"条纹""花纹"等修饰词

【日志风格】
- 语气像App出具正式的偶遇档案
- 动物是主导者，你只是它今天遭遇的环境的一部分
- 白描为主，偶尔一句冷幽默
- 必须包含照片中真实存在的具体视觉细节
- 语言自然流畅，符合中文母语者表达习惯

【禁止】
- "可爱"、"治愈"、"萌"、"温暖"
- 拾荒者、打工人等社会身份比喻
- 编造照片中不存在的场景细节
- 超过65字

返回JSON格式（不要其他内容）：{"title": "...", "species": "...", "journal": "在${locationText}，你..."}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
      }),
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        success: false,
        error: errorData.error?.message || `API 请求失败: ${response.status}`,
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()
    console.log('[recognize] raw content:', content)

    if (!content) {
      return res.status(500).json({ success: false, error: '没有收到 AI 响应' })
    }

    let result
    try {
      result = JSON.parse(content)
    } catch {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        return res.status(500).json({ success: false, error: '无法解析 AI 响应' })
      }
    }

    if (!result.species) {
      return res.status(200).json({
        success: false,
        error: '未能识别出动物，请尝试上传更清晰的动物照片',
      })
    }

    // 分类：根据 species 判断大类
    let category = '其他'
    try {
      const categoryResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://animal-diary.vercel.app',
          'X-Title': 'Animal Diary',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-lite',
          messages: [
            {
              role: 'user',
              content: `物种：${result.species}

以下哪个是这个物种所属的大类？
- 猫
- 狗
- 鸟
- 松鼠
- 兔子
- 其他

回复ONLY大类名，不要有其他词语。例如回复：猫`,
            },
          ],
        }),
      })

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json()
        const categoryContent = categoryData.choices?.[0]?.message?.content?.trim()
        if (categoryContent) {
          // 灵活匹配：检查返回值中是否包含关键词
          if (categoryContent.includes('猫')) category = '猫'
          else if (categoryContent.includes('狗')) category = '狗'
          else if (categoryContent.includes('鸟')) category = '鸟'
          else if (categoryContent.includes('松鼠')) category = '松鼠'
          else if (categoryContent.includes('兔子')) category = '兔子'
        }
      }
    } catch (err) {
      console.log('[recognize] category classification failed:', err.message)
      // fallback to default '其他'
    }

    const rawTitle = result.title || result.species
    const title = rawTitle.length > 15 ? rawTitle.slice(0, 15) : rawTitle

    return res.status(200).json({
      success: true,
      title,
      species: result.species,
      category,
      journal: result.journal,
    })
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      return res.status(504).json({ success: false, error: '识别超时（25秒），请重试' })
    }
    return res.status(500).json({
      success: false,
      error: error.message || '识别失败，请检查网络连接后重试',
    })
  }
}
