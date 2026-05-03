import { logError, logInfo } from './http.js'

export async function performDetectReturning(
  context,
  recordId,
  supabaseUser,
  supabaseAdmin,
  apiKey,
  model
) {
  try {
    const { data: newRecord, error: readError } = await supabaseUser
      .from('records')
      .select('id, user_id, species_tag, image_base64, species')
      .eq('id', recordId)
      .single()

    if (readError || !newRecord) {
      logError(context, 'detect_returning_read_failed', readError)
      return { detected: false, reason: 'Record not found' }
    }

    const { user_id, species_tag, image_base64 } = newRecord

    const { data: similarRecords, error: queryError } = await supabaseUser
      .from('records')
      .select('id, image_base64, species, created_at')
      .eq('user_id', user_id)
      .eq('species_tag', species_tag)
      .neq('id', recordId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (queryError) {
      logError(context, 'detect_returning_query_failed', queryError)
      return { detected: false, reason: 'Query failed' }
    }

    if (!similarRecords || similarRecords.length === 0) {
      logInfo(context, 'detect_returning_no_history', { species_tag })
      return { detected: false, reason: 'No history records' }
    }

    const imageContents = [
      {
        type: 'text',
        text: `你是一个动物识别专家。请比较以下图片中的动物，判断它们是否是同一只个体。

【对比规则】
- 第一张是新上传的照片
- 后续图片是历史记录
- 判断是否是同一只动物（不只是同物种，而是同一个个体）
- 考虑外观特征（毛色、花纹、体型、独特标记等）
- 地点和时间差异可能表明是流动的动物，但要基于外观判断

返回JSON（只有一行）：{"score": <0-100分数，同一只概率越高分数越高>, "similar_record_index": <最相似的图片索引，0表示第一张历史记录>, "reason": "简短理由"}
例如：{"score": 87, "similar_record_index": 0, "reason": "毛色、花纹、耳朵形状都很相似"}`,
      },
      {
        type: 'image_url',
        image_url: { url: image_base64 },
      },
    ]

    for (const record of similarRecords) {
      imageContents.push({
        type: 'image_url',
        image_url: { url: record.image_base64 },
      })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 25000)

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
            content: imageContents,
          },
        ],
      }),
    })

    clearTimeout(timeoutId)

    if (!aiResponse.ok) {
      logError(context, 'detect_returning_ai_failed', { status: aiResponse.status })
      return { detected: false, reason: 'AI request failed' }
    }

    const aiData = await aiResponse.json()
    const aiContent = aiData.choices?.[0]?.message?.content?.trim()

    if (!aiContent) {
      logError(context, 'detect_returning_ai_empty')
      return { detected: false, reason: 'Empty AI response' }
    }

    let aiResult
    try {
      const jsonMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || aiContent.match(/\{[\s\S]*\}/)
      aiResult = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : aiContent)
    } catch {
      logError(context, 'detect_returning_ai_parse_failed')
      return { detected: false, reason: 'Failed to parse AI response' }
    }

    const score = aiResult.score || 0
    const mostSimilarIndex = aiResult.similar_record_index ?? 0

    if (score < 40 || mostSimilarIndex < 0 || mostSimilarIndex >= similarRecords.length) {
      logInfo(context, 'detect_returning_low_score', { score })
      return { detected: false, reason: 'Low similarity score' }
    }

    const mostSimilarRecord = similarRecords[mostSimilarIndex]

    const { error: updateError } = await supabaseAdmin
      .from('records')
      .update({
        similar_record_id: mostSimilarRecord.id,
        similarity_score: Math.min(100, Math.max(0, score)),
      })
      .eq('id', recordId)

    if (updateError) {
      logError(context, 'detect_returning_update_failed', updateError)
      return {
        detected: true,
        similarRecordId: mostSimilarRecord.id,
        similarRecord: mostSimilarRecord,
        score: Math.min(100, Math.max(0, score)),
        reason: '检测成功，但保存失败',
      }
    }

    logInfo(context, 'detect_returning_succeeded', {
      recordId,
      similarRecordId: mostSimilarRecord.id,
      score,
    })

    return {
      detected: true,
      similarRecordId: mostSimilarRecord.id,
      similarRecord: mostSimilarRecord,
      score: Math.min(100, Math.max(0, score)),
      reason: aiResult.reason || '',
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      logError(context, 'detect_returning_timeout', error)
      return { detected: false, reason: 'Timeout' }
    }
    logError(context, 'detect_returning_crashed', error)
    return { detected: false, reason: 'Internal error' }
  }
}
