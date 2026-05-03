import { logError } from './http.js'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'openai/gpt-4o-mini'
const MIN_RECORDS_REQUIRED = 5

function getDateRange(timeWindow, now = new Date()) {
  if (timeWindow === 'year') {
    return {
      startDate: new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0),
      endDate: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      label: `${now.getFullYear()}年`,
    }
  }

  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - 90)
  startDate.setHours(0, 0, 0, 0)

  return {
    startDate,
    endDate: now,
    label: '最近90天',
  }
}

function normalizeRecord(record) {
  return {
    speciesTag: record.species_tag?.trim() || record.species?.trim() || '未命名动物',
    location: record.location?.trim() || '未填写地点',
    createdAt: record.created_at,
  }
}

function getTimeBucket(createdAt) {
  const hour = new Date(createdAt).getHours()
  if (hour >= 5 && hour <= 8) return '早晨'
  if (hour >= 9 && hour <= 15) return '上午'
  if (hour >= 16 && hour <= 19) return '傍晚'
  return '夜晚'
}

function sortCountsDesc(entries) {
  return entries.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-Hans-CN'))
}

function buildSummary(records, timeWindowLabel) {
  const speciesMap = new Map()
  const locationMap = new Map()
  const timeMap = new Map()

  records.forEach((record) => {
    const timeBucket = getTimeBucket(record.createdAt)
    const speciesEntry = speciesMap.get(record.speciesTag) || {
      name: record.speciesTag,
      count: 0,
      locations: new Map(),
      timeBuckets: new Map(),
    }

    speciesEntry.count += 1
    speciesEntry.locations.set(record.location, (speciesEntry.locations.get(record.location) || 0) + 1)
    speciesEntry.timeBuckets.set(timeBucket, (speciesEntry.timeBuckets.get(timeBucket) || 0) + 1)
    speciesMap.set(record.speciesTag, speciesEntry)

    locationMap.set(record.location, (locationMap.get(record.location) || 0) + 1)
    timeMap.set(timeBucket, (timeMap.get(timeBucket) || 0) + 1)
  })

  const speciesStats = Array.from(speciesMap.values())
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-Hans-CN'))
    .map((entry) => ({
      speciesTag: entry.name,
      count: entry.count,
      topLocations: sortCountsDesc(
        Array.from(entry.locations.entries()).map(([name, count]) => ({ name, count }))
      ).slice(0, 3),
      topTimes: sortCountsDesc(
        Array.from(entry.timeBuckets.entries()).map(([name, count]) => ({ name, count }))
      ).slice(0, 3),
    }))

  const locationStats = sortCountsDesc(
    Array.from(locationMap.entries()).map(([name, count]) => ({ name, count }))
  ).slice(0, 5)

  const timeStats = sortCountsDesc(
    Array.from(timeMap.entries()).map(([name, count]) => ({ name, count }))
  )

  return {
    timeWindowLabel,
    totalRecords: records.length,
    speciesStats,
    locationStats,
    timeStats,
  }
}

function describeStats(items) {
  if (!items.length) return '暂无'
  return items.map((item) => `${item.name}${item.count}次`).join('，')
}

// Prompt keeps the model grounded in aggregated stats so it only summarizes observable patterns.
function buildPrompt(summary) {
  const speciesLines = summary.speciesStats
    .map((item) => {
      return `- ${item.speciesTag}：共${item.count}次；地点：${describeStats(item.topLocations)}；时间：${describeStats(item.topTimes)}`
    })
    .join('\n')

  return `你是一个擅长总结个人动物观察模式的中文编辑。

请根据以下真实统计，生成 3 到 5 条中文洞察。

要求：
1. 每条必须是单独一行，且不超过20个汉字。
2. 语气要像观察总结，不要夸张，不要鸡汤。
3. 必须使用谨慎措辞，例如“往往”“可能”“更容易”。
4. 只描述统计里能支持的模式，不要编造新地点、新物种、新时间。
5. 不要编号，不要加引号，不要输出解释文字。

观察时间范围：${summary.timeWindowLabel}
总记录数：${summary.totalRecords}
整体时间分布：${describeStats(summary.timeStats)}
整体地点分布：${describeStats(summary.locationStats)}
物种分布：
${speciesLines}

请直接输出 3 到 5 行洞察。`
}

function extractArrayFromContent(content) {
  const jsonFenceMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonFenceMatch) {
    const parsed = JSON.parse(jsonFenceMatch[1])
    return Array.isArray(parsed) ? parsed : parsed.insights
  }

  const jsonArrayMatch = content.match(/\[[\s\S]*\]/)
  if (jsonArrayMatch) {
    return JSON.parse(jsonArrayMatch[0])
  }

  return null
}

function normalizeInsight(text) {
  return String(text || '')
    .replace(/^[-\d.\s"“”]+/, '')
    .replace(/[。；;]+$/g, '')
    .trim()
}

function isLowQualityInsight(text) {
  if (!text) return true
  if (text.length > 20) return true
  if (!/(往往|可能|更容易|常会|多半)/.test(text)) return true
  if (/洞察|总结|观察记录|根据数据|显示你/.test(text)) return true
  return false
}

function dedupeInsights(insights) {
  const seen = new Set()
  const result = []

  insights.forEach((item) => {
    const text = normalizeInsight(item)
    const key = text.replace(/[，,。.！!？?\s]/g, '')
    if (!key || seen.has(key) || isLowQualityInsight(text)) {
      return
    }
    seen.add(key)
    result.push(text)
  })

  return result
}

function buildFallbackInsights(summary) {
  const fallback = []
  const topSpecies = summary.speciesStats[0]
  const topLocation = summary.locationStats[0]
  const topTime = summary.timeStats[0]
  const secondSpecies = summary.speciesStats[1]
  const secondLocation = summary.locationStats[1]

  if (topSpecies && topSpecies.topTimes[0]?.count >= 2) {
    fallback.push(`你往往在${topSpecies.topTimes[0].name}遇见${topSpecies.speciesTag}`)
  }

  if (topSpecies && topSpecies.topLocations[0]?.count >= 2) {
    fallback.push(`你可能最常在${topSpecies.topLocations[0].name}遇见${topSpecies.speciesTag}`)
  }

  if (topLocation && topLocation.count >= 2) {
    fallback.push(`${topLocation.name}往往是你的高频偶遇点`)
  }

  if (topTime && topTime.count >= 2) {
    fallback.push(`你更容易在${topTime.name}碰到小动物`)
  }

  if (topSpecies && topSpecies.count >= 2) {
    fallback.push(`${topSpecies.speciesTag}往往是你的高频主角`)
  }

  if (secondSpecies && secondSpecies.count >= 2) {
    fallback.push(`你可能也常和${secondSpecies.speciesTag}打照面`)
  }

  if (secondLocation && secondLocation.count >= 2) {
    fallback.push(`你在${secondLocation.name}也可能常有发现`)
  }

  return dedupeInsights(fallback).slice(0, 5)
}

async function callInsightsModel(apiKey, model, prompt, signal) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://animal-diary.vercel.app',
      'X-Title': 'Animal Diary',
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 180,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || `OpenRouter request failed: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

function parseInsights(content, summary) {
  const extractedArray = extractArrayFromContent(content)
  const candidates = Array.isArray(extractedArray)
    ? extractedArray
    : content
        .split('\n')
        .map((line) => normalizeInsight(line))
        .filter(Boolean)

  const merged = dedupeInsights(candidates)
  const fallback = buildFallbackInsights(summary)

  for (const item of fallback) {
    if (merged.length >= 5) break
    if (!merged.includes(item)) {
      merged.push(item)
    }
  }

  return merged.slice(0, 5)
}

export async function generateInsights(context, supabaseUser, options) {
  const { userId, timeWindow, apiKey, model = DEFAULT_MODEL, signal } = options
  const { startDate, endDate, label } = getDateRange(timeWindow)

  const { data, error } = await supabaseUser
    .from('records')
    .select('id, species, species_tag, location, created_at')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  const records = (data || []).map(normalizeRecord)
  const recordCount = records.length

  if (recordCount < MIN_RECORDS_REQUIRED) {
    return { insights: [], recordCount }
  }

  const summary = buildSummary(records, label)
  const prompt = buildPrompt(summary)

  try {
    const content = await callInsightsModel(apiKey, model, prompt, signal)
    const insights = parseInsights(content, summary)

    if (insights.length < 3) {
      throw new Error('No valid insights generated')
    }

    return { insights, recordCount }
  } catch (error) {
    error.recordCount = recordCount
    logError(context, 'generate_insights_failed', error, {
      userId,
      timeWindow,
      recordCount,
    })
    throw error
  }
}
