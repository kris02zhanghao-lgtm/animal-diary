const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemini-2.5-flash-lite'
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * 识别动物并生成趣味日志
 * @param {string} imageBase64 - base64 编码的图片（包含 data:image/xxx;base64, 前缀）
 * @param {string} location - 地点描述（可选）
 * @returns {Promise<{success: boolean, species: string|null, journal: string|null, error: string|null}>}
 */
export async function recognizeAnimal(imageBase64, location = '') {
  if (!API_KEY) {
    return {
      success: false,
      species: null,
      journal: null,
      error: '未配置 API Key，请在 .env 文件中设置 VITE_OPENROUTER_API_KEY'
    }
  }

  const locationText = location || '城市某处'

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Animal Diary'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `你是一个城市动物观察站，正在为用户生成偶遇档案。

任务：
1. 识别图片中的动物物种（中文名，生活化称呼，如"奶牛猫"、"橘猫"、"三花猫"、"柯基"、"喜鹊"，黑白花纹的猫称为"奶牛猫"）
2. 以「你」为主语，写一段50-60字的中文偶遇日志，记录「你」今天和这只动物之间发生了什么。动物是主导者，你只是它今天遭遇的环境的一部分，地位对等或略低于它。

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

返回JSON格式（不要有其他内容）：{"species": "...", "journal": "在${locationText}，你..."}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content?.trim()

    // 解析 JSON 响应
    let result
    try {
      // 尝试直接解析
      result = JSON.parse(content)
    } catch {
      // 如果失败，尝试从 markdown 代码块中提取
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1] || jsonMatch[0])
      } else {
        throw new Error('无法解析响应')
      }
    }

    if (!result.species) {
      return {
        success: false,
        species: null,
        journal: null,
        error: '未能识别出动物，请尝试上传更清晰的动物照片'
      }
    }

    return {
      success: true,
      species: result.species,
      journal: result.journal,
      error: null
    }
  } catch (error) {
    console.error('识别失败:', error)
    return {
      success: false,
      species: null,
      journal: null,
      error: error.message || '识别失败，请检查网络连接后重试'
    }
  }
}
