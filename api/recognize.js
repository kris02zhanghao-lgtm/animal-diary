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
                text: `你是一个城市动物观察站，识别图片中的动物物种。

【物种识别】
看图片中的动物，判断是哪种物种。常见物种有：
- 猫类：橘猫、虎斑猫、奶牛猫、三花猫、狸花猫、黑猫、白猫
- 犬类：柯基、泰迪、萨摩耶、金毛、拉布拉多、哈士奇、柴犬
- 鸟类：喜鹊、乌鸦、鸽子、鹦鹉、麻雀、燕子
- 其他：松鼠、兔子、刺猬等

识别规则：
- 橘色条纹、橘色纯色的猫都叫"橘猫"，不要创建"橘白猫""橘黄猫"之类新名称
- 黑白花纹的猫都叫"奶牛猫"，不要叫"黑白猫"
- 虎纹猫无论什么颜色都叫"虎斑猫"
- 不确定的物种选"其他"
- 物种名不要附加颜色或花纹描述（例如不要"虎斑猫，橘色条纹毛"，只写"虎斑猫"）

【生成偶遇档案】
标题：10字以内，简练有趣的小标题
日志：50-60字的观察记录，以「你」为主语，描述遇到这个动物的场景。动物是主角，你只是环境的一部分。白描为主，偶尔一句冷幽默。必须包含照片中真实存在的具体细节。

禁止词汇：可爱、治愈、萌、温暖、拾荒者、打工人
禁止：编造照片中不存在的场景、超过65字

返回JSON（只有一行）：{"title": "...", "species": "...", "journal": "在${locationText}，你..."}`
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
