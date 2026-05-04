function formatDate(dateString) {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`
}

function truncateText(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片加载失败'))
    image.src = source
  })
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const characters = Array.from(text || '')
  const lines = []
  let currentLine = ''

  characters.forEach((character) => {
    const candidate = currentLine + character
    if (ctx.measureText(candidate).width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = character
    } else {
      currentLine = candidate
    }
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  const visibleLines = lines.slice(0, maxLines)
  if (lines.length > maxLines && visibleLines.length > 0) {
    const lastLine = visibleLines[visibleLines.length - 1]
    visibleLines[visibleLines.length - 1] = truncateText(lastLine, Math.max(0, lastLine.length - 1))
  }

  visibleLines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight)
  })
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('图片导出失败'))
      }
    }, 'image/png')
  })
}

export async function generateCollectionShareCard(speciesStats, totalCount) {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 900
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('无法初始化画布')

  // 背景
  ctx.fillStyle = '#f9f0e6'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const gradient = ctx.createLinearGradient(0, 0, 600, 900)
  gradient.addColorStop(0, '#fff8ef')
  gradient.addColorStop(0.5, '#f6ead4')
  gradient.addColorStop(1, '#ebf4ea')
  ctx.fillStyle = gradient
  roundedRect(ctx, 22, 22, 556, 856, 34)
  ctx.fill()

  // 2x2 照片拼贴（最多4种）
  const photos = speciesStats.slice(0, 4).map(s => s.latestPhoto).filter(Boolean)
  const gridTop = 44
  const gridLeft = 40
  const cellW = 256
  const cellH = 200
  const gap = 8

  if (photos.length > 0) {
    const positions = [
      [gridLeft, gridTop],
      [gridLeft + cellW + gap, gridTop],
      [gridLeft, gridTop + cellH + gap],
      [gridLeft + cellW + gap, gridTop + cellH + gap],
    ]
    await Promise.all(
      photos.map(async (src, i) => {
        const [px, py] = positions[i]
        const radius = i === 0 ? 24 : i === 1 ? 24 : i === 2 ? 24 : 24
        ctx.save()
        roundedRect(ctx, px, py, cellW, cellH, radius)
        ctx.clip()
        try {
          const img = await loadImage(src)
          const scale = Math.max(cellW / img.width, cellH / img.height)
          const dw = img.width * scale
          const dh = img.height * scale
          ctx.drawImage(img, px + (cellW - dw) / 2, py + (cellH - dh) / 2, dw, dh)
        } catch {
          ctx.fillStyle = '#e8d8c0'
          ctx.fillRect(px, py, cellW, cellH)
        }
        ctx.restore()
      })
    )
  }

  // 内容卡片区域
  const cardTop = gridTop + (cellH * 2) + gap + 16
  ctx.fillStyle = 'rgba(255, 250, 242, 0.88)'
  roundedRect(ctx, 38, cardTop, 524, 900 - cardTop - 44, 28)
  ctx.fill()

  // 副标题
  ctx.fillStyle = '#92785d'
  ctx.font = '600 18px Nunito, "PingFang SC", sans-serif'
  ctx.fillText('动物偶遇图鉴', 68, cardTop + 46)

  // 主标题：已发现 X 种
  const speciesCount = speciesStats.length
  ctx.fillStyle = '#3d2b1a'
  ctx.font = '700 44px Nunito, "PingFang SC", sans-serif'
  ctx.fillText(`已发现 ${speciesCount} 种动物`, 68, cardTop + 106)

  // 总次数
  ctx.fillStyle = '#6f5a46'
  ctx.font = '500 22px Nunito, "PingFang SC", sans-serif'
  ctx.fillText(`共记录了 ${totalCount} 次偶遇`, 68, cardTop + 148)

  // Top 3 物种标签
  const topSpecies = speciesStats.slice(0, 3)
  let tagX = 68
  const tagY = cardTop + 196
  topSpecies.forEach(s => {
    const label = `${s.category} ×${s.count}`
    ctx.font = '500 17px Nunito, "PingFang SC", sans-serif'
    const tw = ctx.measureText(label).width
    const padX = 14
    const padY = 8
    const tagW = tw + padX * 2
    const tagH = 34

    ctx.fillStyle = '#f0e4d0'
    roundedRect(ctx, tagX, tagY - tagH + padY, tagW, tagH, 10)
    ctx.fill()

    ctx.fillStyle = '#7a5c3a'
    ctx.fillText(label, tagX + padX, tagY + padY - 2)

    tagX += tagW + 10
  })

  // 底部署名
  ctx.fillStyle = '#9f927d'
  ctx.font = '600 17px Nunito, "PingFang SC", sans-serif'
  ctx.fillText('Animal Diary · 记录城市里每一次轻轻经过的生命', 68, 856)

  return await canvasToBlob(canvas)
}

export async function generateShareCard(record) {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 900
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('无法初始化画布')
    }

    ctx.fillStyle = '#f9f0e6'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createLinearGradient(0, 0, 600, 900)
    gradient.addColorStop(0, '#fff8ef')
    gradient.addColorStop(0.48, '#f6ead4')
    gradient.addColorStop(1, '#ebf4ea')
    ctx.fillStyle = gradient
    roundedRect(ctx, 22, 22, 556, 856, 34)
    ctx.fill()

    ctx.save()
    roundedRect(ctx, 38, 38, 524, 306, 28)
    ctx.clip()

    const image = await loadImage(record.imageBase64)
    const targetWidth = 524
    const targetHeight = 306
    const scale = Math.max(targetWidth / image.width, targetHeight / image.height)
    const drawWidth = image.width * scale
    const drawHeight = image.height * scale
    const drawX = 40 + (targetWidth - drawWidth) / 2
    const drawY = 40 + (targetHeight - drawHeight) / 2
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
    ctx.restore()

    ctx.fillStyle = 'rgba(255, 250, 242, 0.86)'
    roundedRect(ctx, 38, 366, 524, 470, 30)
    ctx.fill()

    ctx.fillStyle = '#92785d'
    ctx.font = '600 18px Nunito, "PingFang SC", sans-serif'
    ctx.fillText('动物偶遇图鉴', 68, 412)

    ctx.fillStyle = '#3d2b1a'
    ctx.font = '700 38px Nunito, "PingFang SC", sans-serif'
    ctx.fillText(record.title?.trim() || record.species || '新的偶遇', 68, 464)

    ctx.fillStyle = '#6f5a46'
    ctx.font = '600 22px Nunito, "PingFang SC", sans-serif'
    drawWrappedText(
      ctx,
      `${record.species || '未命名动物'} · ${truncateText(record.location || '城市某处', 18)} · ${formatDate(record.createdAt)}`,
      68,
      510,
      464,
      32,
      2
    )

    ctx.fillStyle = '#5c4835'
    ctx.font = '500 23px Nunito, "PingFang SC", sans-serif'
    drawWrappedText(
      ctx,
      truncateText(record.journal || '今天也遇见了新的动物朋友。', 120),
      68,
      592,
      468,
      36,
      5
    )

    ctx.fillStyle = '#9f927d'
    ctx.font = '600 17px Nunito, "PingFang SC", sans-serif'
    ctx.fillText('Animal Diary', 68, 806)
    ctx.fillText('记录城市里每一次轻轻经过的生命', 184, 806)

    return await canvasToBlob(canvas)
  } catch (error) {
    throw new Error(error.message || '生成分享卡片失败')
  }
}

export function downloadShareCard(blob, filename) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

export async function copyToClipboard(blob) {
  if (navigator.clipboard?.write && window.ClipboardItem) {
    await navigator.clipboard.write([
      new window.ClipboardItem({
        'image/png': blob,
      }),
    ])
    return { mode: 'image' }
  }

  throw new Error('当前浏览器暂不支持图片复制')
}

export async function shareViaSystem(blob, record) {
  if (!navigator.share) {
    throw new Error('当前浏览器不支持系统分享')
  }

  const filename = buildShareFilename(record)
  const file = new File([blob], filename, { type: 'image/png' })
  const shareText = generateShareText(record)
  const shareData = {
    title: record.title || record.species || '偶遇记录',
    text: shareText,
  }

  if (navigator.canShare?.({ files: [file] })) {
    shareData.files = [file]
  }

  await navigator.share(shareData)
}

export function canShareViaSystem(blob, record) {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false
  }

  const userAgent = navigator.userAgent || ''
  const isQuarkBrowser = /Quark/i.test(userAgent)
  if (isQuarkBrowser) {
    return false
  }

  if (!blob || !record) {
    return true
  }

  if (!navigator.canShare) {
    return true
  }

  const filename = buildShareFilename(record)
  const file = new File([blob], filename, { type: 'image/png' })

  return navigator.canShare({ files: [file] })
}

export function generateShareText(record) {
  return [
    '【偶遇记录】',
    `🐾 ${record.species || '未命名动物'}`,
    `📍 ${record.location || '城市某处'}`,
    `📅 ${formatDate(record.createdAt)}`,
    `日志：${truncateText(record.journal || '今天也遇见了新的动物朋友。', 80)}`,
  ].join('\n')
}

export async function copyTextToClipboard(text) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('当前浏览器暂不支持剪贴板写入')
  }

  await navigator.clipboard.writeText(text)
}

export function buildShareFilename(record) {
  const safeSpecies = (record.species || 'animal').replace(/[\\/:*?"<>|]/g, '-')
  return `${safeSpecies}-${new Date(record.createdAt).toISOString().slice(0, 10)}.png`
}
