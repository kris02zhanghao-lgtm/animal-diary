import {
  createRequestContext,
  ensureMethod,
  logError,
  logInfo,
  sendError,
} from './_lib/http.js'
import { ALL_SPECIES_TAGS, normalizeAnimalClassification } from './_lib/animalClassification.js'

export default async function handler(req, res) {
  const context = createRequestContext(req)
  if (!ensureMethod(req, res, 'POST')) {
    return
  }

  const { imageBase64, location } = req.body

  if (!imageBase64) {
    logInfo(context, 'recognize_missing_image')
    return sendError(res, 400, 'Missing imageBase64', 'MISSING_IMAGE')
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL || process.env.VITE_OPENROUTER_MODEL || 'openai/gpt-4o-mini'
  if (!apiKey) {
    logInfo(context, 'missing_openrouter_key', { model })
    return sendError(res, 500, 'API key not configured', 'SERVER_MISCONFIGURED')
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
        model,
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
      logInfo(context, 'recognize_upstream_failed', {
        model,
        status: response.status,
      })
      return sendError(
        res,
        response.status,
        errorData.error?.message || `API 请求失败: ${response.status}`,
        'OPENROUTER_REQUEST_FAILED'
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()

    if (!content) {
      logInfo(context, 'recognize_empty_response', { model })
      return sendError(res, 500, '没有收到 AI 响应', 'EMPTY_AI_RESPONSE')
    }

    let result
    try {
      result = JSON.parse(content)
    } catch {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        logInfo(context, 'recognize_unparseable_response', { model })
        return sendError(res, 500, '无法解析 AI 响应', 'UNPARSEABLE_AI_RESPONSE')
      }
    }

    if (!result.species) {
      logInfo(context, 'recognize_species_missing', { model })
      return sendError(res, 200, '未能识别出动物，请尝试上传更清晰的动物照片', 'SPECIES_NOT_FOUND')
    }

    // 分类：根据 species 同时返回 category（大类）和 species_tag（中类）
    let category = '其他'
    let speciesTag = 'other-animal'
    let classifyTimeoutId = null
    try {
      const classifyController = new AbortController()
      classifyTimeoutId = setTimeout(() => classifyController.abort(), 15000)

      const classifyResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: classifyController.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://animal-diary.vercel.app',
          'X-Title': 'Animal Diary',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: `物种识别结果：${result.species}

请根据这个物种，返回标准化分类。

分类规则：
- 猫类：优先用毛色标签（橘猫/黑猫/三花猫...），仅当品种特征极其突出时用品种（英短/布偶/暹罗/折耳）。例如"橘色英短猫"应标记为"橘猫"，"暹罗猫"因特征明显应标记为"暹罗猫"
- 犬类：优先用品种标签，品种不确定时选"中华田园犬"
- 其他：按预定义列表直接映射

大类选择：猫、狗、鸟、哺乳动物、大型野生、灵长类、爬行水生、其他
中类预定义列表（必须从以下选择，不要创造新标签）：
${ALL_SPECIES_TAGS}

返回JSON（只有一行，不要有其他文字）：{"category": "...", "species_tag": "..."}
例如：{"category": "猫", "species_tag": "橘猫"}`,
            },
          ],
        }),
      })

      clearTimeout(classifyTimeoutId)

      if (classifyResponse.ok) {
        const classifyData = await classifyResponse.json()
        const classifyContent = classifyData.choices?.[0]?.message?.content?.trim()
        if (classifyContent) {
          try {
            const parsed = JSON.parse(classifyContent)
            if (parsed.category) category = parsed.category
            if (parsed.species_tag) speciesTag = parsed.species_tag
          } catch {
            // fallback to defaults
          }
        }
      }
    } catch (err) {
      clearTimeout(classifyTimeoutId)
      if (err.name === 'AbortError') {
        logError(context, 'recognize_classify_timeout', err, { model })
        // fallback to defaults, don't fail the entire request
      } else {
        logError(context, 'recognize_classify_fallback', err, { model })
      }
      // fallback to defaults
    }

    const normalizedClassification = normalizeAnimalClassification(result.species, category, speciesTag)
    category = normalizedClassification.category
    speciesTag = normalizedClassification.speciesTag

    const rawTitle = result.title || result.species
    const title = rawTitle.length > 15 ? rawTitle.slice(0, 15) : rawTitle

    logInfo(context, 'recognize_succeeded', {
      model,
      species: result.species,
      category,
      speciesTag,
    })
    return res.status(200).json({
      success: true,
      title,
      species: result.species,
      category,
      speciesTag,
      journal: result.journal,
    })
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      logError(context, 'recognize_timeout', error, { model })
      return sendError(res, 504, '识别超时（25秒），请重试', 'RECOGNIZE_TIMEOUT')
    }
    logError(context, 'recognize_crashed', error, { model })
    return sendError(res, 500, error.message || '识别失败，请检查网络连接后重试', 'RECOGNIZE_CRASHED')
  }
}
