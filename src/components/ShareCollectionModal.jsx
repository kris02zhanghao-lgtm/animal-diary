import { useEffect, useState } from 'react'
import {
  generateCollectionShareCard,
  downloadShareCard,
  copyToClipboard,
  shareViaSystem,
  canShareViaSystem,
  copyTextToClipboard,
} from '../utils/shareUtils'

function ShareCollectionModal({ isOpen, onClose, speciesStats, totalCount }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [blob, setBlob] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const [actionMessage, setActionMessage] = useState('')
  const [isSharing, setIsSharing] = useState(false)

  const showSystemShare = canShareViaSystem(blob, { species: '图鉴', createdAt: new Date().toISOString() })

  useEffect(() => {
    if (!isOpen || !speciesStats?.length) return

    let cancelled = false
    let nextPreviewUrl = null

    async function generate() {
      setIsGenerating(true)
      setError(null)
      setBlob(null)
      setPreviewUrl(null)
      setActionMessage('')

      try {
        const imageBlob = await generateCollectionShareCard(speciesStats, totalCount)
        if (cancelled) return
        nextPreviewUrl = URL.createObjectURL(imageBlob)
        setBlob(imageBlob)
        setPreviewUrl(nextPreviewUrl)
      } catch {
        if (!cancelled) setError('卡片生成失败，请重试')
      } finally {
        if (!cancelled) setIsGenerating(false)
      }
    }

    generate()

    return () => {
      cancelled = true
      if (nextPreviewUrl) URL.revokeObjectURL(nextPreviewUrl)
    }
  }, [isOpen, speciesStats, totalCount])

  useEffect(() => {
    if (!actionMessage) return undefined
    const timer = window.setTimeout(onClose, 1600)
    return () => window.clearTimeout(timer)
  }, [actionMessage, onClose])

  if (!isOpen) return null

  const handleDownload = () => {
    if (!blob) return
    downloadShareCard(blob, `动物图鉴-${new Date().toISOString().slice(0, 10)}.png`)
    setActionMessage('图片已下载')
  }

  const handleCopy = async () => {
    try {
      if (!blob) throw new Error('卡片尚未生成')
      await copyToClipboard(blob)
      setActionMessage('已复制到剪贴板')
    } catch {
      try {
        await copyTextToClipboard(`我已在动物偶遇图鉴中发现了 ${speciesStats.length} 种动物，共记录 ${totalCount} 次偶遇 🐾`)
        setError('当前浏览器不支持图片复制，已改为复制文案')
        setActionMessage('文案已复制')
      } catch {
        setError('复制失败，请长按图片保存')
      }
    }
  }

  const handleSystemShare = async () => {
    if (!blob) return
    try {
      setIsSharing(true)
      await shareViaSystem(blob, { species: '我的动物图鉴', createdAt: new Date().toISOString(), title: `已发现 ${speciesStats.length} 种动物` })
      setActionMessage('已打开系统分享')
    } catch (err) {
      if (err?.name !== 'AbortError') setError('当前环境暂不支持系统分享，请改用下载')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(0,0,0,0.35)', animation: 'fade-in 0.25s ease' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[28px] overflow-hidden"
        style={{
          background: '#fffdf7',
          boxShadow: '0 12px 32px rgba(61,52,40,0.18)',
          animation: 'zoom-in 0.3s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="text-sm text-[#9f927d]">🌿 分享图鉴</p>
            <h2 className="text-lg font-bold text-[#5a4a3a] m-0">你的动物发现卡片</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full text-xl text-[#7a5c3a] bg-[#f4ebdc]"
          >
            ×
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {isGenerating ? (
            <div className="rounded-[24px] bg-[#f7f0e4] px-4 py-10 text-center">
              <div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-[#e8d8c0] border-t-[#6fba2c] animate-spin" />
              <p className="text-sm text-[#9f927d]">正在绘制图鉴卡片...</p>
            </div>
          ) : previewUrl ? (
            <div className="rounded-[24px] bg-[#f7f0e4] p-3">
              <img src={previewUrl} alt="图鉴分享卡片" className="w-full rounded-[20px] shadow-sm" />
            </div>
          ) : (
            <div className="rounded-[24px] bg-[#f7f0e4] px-4 py-8 text-center">
              <div className="text-4xl mb-3">🐾</div>
              <p className="text-sm text-[#9f927d]">
                {speciesStats?.length ? '卡片生成失败，请重试' : '还没有任何发现，先去记录吧'}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
              <p className="text-sm text-orange-700">{error}</p>
            </div>
          )}

          {actionMessage && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-700">{actionMessage}</p>
            </div>
          )}

          {previewUrl && (
            <>
              <div className={`grid gap-3 ${showSystemShare ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {showSystemShare && (
                  <button onClick={handleSystemShare} disabled={isSharing} className="btn btn-md btn-default">
                    {isSharing ? '分享中...' : '分享到...'}
                  </button>
                )}
                <button onClick={handleDownload} className="btn btn-md btn-default">
                  下载图片
                </button>
              </div>
              <button onClick={handleCopy} className="w-full btn btn-md btn-primary">
                复制到剪贴板
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareCollectionModal
