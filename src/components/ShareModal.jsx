import { useEffect, useMemo, useState } from 'react'
import { trackEvent } from '../services/analyticsService'
import {
  buildShareFilename,
  canShareViaSystem,
  copyTextToClipboard,
  copyToClipboard,
  downloadShareCard,
  generateShareCard,
  generateShareText,
  shareViaSystem,
} from '../utils/shareUtils'

function ShareModal({ record, isOpen, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [blob, setBlob] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState(null)
  const [actionMessage, setActionMessage] = useState('')
  const [isSharing, setIsSharing] = useState(false)

  const shareText = useMemo(() => (
    record ? generateShareText(record) : ''
  ), [record])
  const showSystemShare = useMemo(
    () => canShareViaSystem(blob, record),
    [blob, record]
  )

  useEffect(() => {
    if (!isOpen || !record) {
      return undefined
    }

    let cancelled = false
    let nextPreviewUrl = null

    async function prepareCard() {
      setIsGenerating(true)
      setError(null)
      setActionMessage('')
      setBlob(null)
      setPreviewUrl(null)

      try {
        const imageBlob = await generateShareCard(record)
        if (cancelled) return
        nextPreviewUrl = URL.createObjectURL(imageBlob)
        setBlob(imageBlob)
        setPreviewUrl(nextPreviewUrl)
      } catch {
        if (!cancelled) {
          setError('分享卡片生成失败，已切换为文案分享。')
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false)
        }
      }
    }

    prepareCard()

    return () => {
      cancelled = true
      if (nextPreviewUrl) {
        URL.revokeObjectURL(nextPreviewUrl)
      }
    }
  }, [isOpen, record])

  useEffect(() => {
    if (!actionMessage) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      onClose()
    }, 1600)

    return () => window.clearTimeout(timer)
  }, [actionMessage, onClose])

  if (!isOpen || !record) return null

  const handleDownload = () => {
    if (!blob) return
    downloadShareCard(blob, buildShareFilename(record))
    setActionMessage('图片已下载')
    trackEvent('share_single', { action: 'download' })
  }

  const handleCopy = async () => {
    try {
      if (!blob) {
        throw new Error('分享卡片尚未生成')
      }

      await copyToClipboard(blob)
      setActionMessage('已复制到剪贴板')
    } catch {
      try {
        await copyTextToClipboard(shareText)
        setError('当前浏览器不支持图片复制，已改为复制文案。')
        setActionMessage('文案已复制')
      } catch {
        setError('复制失败，请先下载图片。')
      }
    }
  }

  const handleCopyText = async () => {
    try {
      await copyTextToClipboard(shareText)
      setActionMessage('文案已复制')
    } catch {
      setError('当前浏览器不支持文案复制，请手动复制下方内容。')
    }
  }

  const handleSystemShare = async () => {
    if (!blob) {
      setError('分享卡片尚未生成，请稍后再试。')
      return
    }

    try {
      setIsSharing(true)
      await shareViaSystem(blob, record)
      trackEvent('share_single', { action: 'system' })
      setActionMessage('已打开系统分享')
    } catch (shareError) {
      if (shareError?.name !== 'AbortError') {
        setError('当前环境暂不支持系统分享，请改用下载图片或复制。')
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(0, 0, 0, 0.35)', animation: 'fade-in 0.25s ease' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[28px] overflow-hidden"
        style={{
          background: '#fffdf7',
          boxShadow: '0 12px 32px rgba(61, 52, 40, 0.18)',
          animation: 'zoom-in 0.3s ease',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="text-sm text-[#9f927d]">📤 分享这次偶遇</p>
            <h2 className="text-lg font-bold text-[#5a4a3a] m-0">带走一张暖乎乎的小卡片</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full text-xl text-[#7a5c3a] bg-[#f4ebdc]"
            aria-label="关闭分享弹窗"
          >
            ×
          </button>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {isGenerating ? (
            <div className="rounded-[24px] bg-[#f7f0e4] px-4 py-10 text-center">
              <div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-[#e8d8c0] border-t-[#6fba2c] animate-spin" />
              <p className="text-sm text-[#9f927d]">正在绘制分享卡片...</p>
            </div>
          ) : previewUrl ? (
            <div className="rounded-[24px] bg-[#f7f0e4] p-3">
              <img
                src={previewUrl}
                alt="分享卡片预览"
                className="w-full rounded-[20px] shadow-sm"
              />
            </div>
          ) : (
            <div className="rounded-[24px] bg-[#f7f0e4] px-4 py-4">
              <p className="text-sm font-semibold text-[#7a5c3a] mb-2">文案分享</p>
              <pre className="whitespace-pre-wrap text-sm leading-6 text-[#5a4a3a] font-sans">
                {shareText}
              </pre>
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

          <div className={`grid gap-3 ${showSystemShare ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {showSystemShare && (
              <button
                onClick={previewUrl ? handleSystemShare : handleCopyText}
                disabled={isSharing}
                className="btn btn-md btn-default"
              >
                {previewUrl ? (isSharing ? '分享中...' : '分享到...') : '复制文案'}
              </button>
            )}
            <button
              onClick={previewUrl ? handleDownload : handleCopyText}
              className="btn btn-md btn-default"
            >
              {previewUrl ? '下载图片' : '复制文案'}
            </button>
          </div>

          <button
            onClick={previewUrl ? handleCopy : handleCopyText}
            className="w-full btn btn-md btn-primary"
          >
            {previewUrl ? '复制到剪贴板' : '复制文案'}
          </button>

          {!previewUrl && (
            <textarea
              value={shareText}
              readOnly
              className="w-full rounded-[20px] border border-[#e0d0b8] bg-[#fffaf1] px-4 py-3 text-sm leading-6 text-[#5a4a3a] focus:outline-none"
              rows={5}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareModal
