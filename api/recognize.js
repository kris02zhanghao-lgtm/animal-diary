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

任务：
1. 识别图片中的动物物种（中文名，生活化称呼，如"奶牛猫"、"橘猫"、"三花猫"、"柯基"、"喜鹊"）
2. 生成一个10字以内的偶遇小标题，语气简练有趣，像一篇微型档案的标题，例如"领地巡查官驾到"、"橘猫的午后判决"
3. 以「你」为主语，写一段50-60字的中文偶遇日志，记录「你」今天和这只动物之间发生了什么。动物是主导者，你只是它今天遭遇的环境的一部分，地位对等或略低于它。

风格：
- 语气像App在为你出具一份正式的偶遇档案
- 动物有自己的目的和逻辑，你只是它今天遭遇的环境的一部分，地位对等或略低于它
- 白描为主，偶尔一句冷幽默，体现物种之间的地位落差
- 必须包含一个照片中真实存在的具体视觉细节
- 语言自然流畅，符合中文母语者的表达习惯

禁止：
- 禁止出现"可爱"、"治愈"、"萌"、"温暖"
- 禁止把你比作有社会含义的角色（拾荒者、打工人等）
- 禁止编造照片中不存在的场景或细节
- 禁止超过65字
- 必须用中文返回

参考例句：'在武汉，你的膝盖被一只奶牛猫征用为限时靠垫。它刚完成领地例行巡视，此刻眯着眼，对你是否舒适这件事毫无兴趣。'

返回JSON格式（不要有其他内容）：{"title": "...", "species": "...", "journal": "在${locationText}，你..."}`
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
