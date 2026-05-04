import { useEffect, useState } from 'react'
import { getCollectionShare, createCollectionShare, deleteCollectionShare } from '../services/shareCollectionService'

function ShareCollectionModal({ isOpen, onClose }) {
  const [share, setShare] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false
    setError(null)
    setConfirmDelete(false)
    setCopied(false)

    async function fetchShare() {
      setIsLoading(true)
      try {
        const result = await getCollectionShare()
        if (!cancelled) setShare(result)
      } catch {
        if (!cancelled) setError('加载失败，请重试')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchShare()
    return () => { cancelled = true }
  }, [isOpen])

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await createCollectionShare()
      setShare(result)
    } catch {
      setError('生成链接失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteCollectionShare()
      setShare(null)
      setConfirmDelete(false)
    } catch {
      setError('删除失败，请重试')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCopy = async () => {
    if (!share?.url) return
    try {
      await navigator.clipboard.writeText(share.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('复制失败，请手动复制链接')
    }
  }

  if (!isOpen) return null

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
            <p className="text-sm text-[#9f927d]">🌿 分享我的图鉴</p>
            <h2 className="text-lg font-bold text-[#5a4a3a] m-0">让朋友看看你的发现</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full text-xl text-[#7a5c3a] bg-[#f4ebdc]"
          >
            ×
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {isLoading ? (
            <div className="rounded-[24px] bg-[#f7f0e4] px-4 py-10 text-center">
              <div className="w-10 h-10 mx-auto mb-4 rounded-full border-4 border-[#e8d8c0] border-t-[#6fba2c] animate-spin" />
              <p className="text-sm text-[#9f927d]">加载中...</p>
            </div>
          ) : share ? (
            <div className="space-y-3">
              <div className="rounded-[20px] bg-[#f7f0e4] px-4 py-4">
                <p className="text-xs text-[#9f927d] mb-2">你的图鉴公开链接</p>
                <p
                  className="text-sm text-[#5a4a3a] break-all leading-6 font-mono"
                  style={{ wordBreak: 'break-all' }}
                >
                  {share.url}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full py-3 rounded-xl font-bold text-white text-sm"
                style={{
                  background: copied ? '#5a8a3a' : '#7cb342',
                  border: `3px solid ${copied ? '#4a7a2a' : '#6fba2c'}`,
                  boxShadow: `3px 3px 0px ${copied ? '#4a7a2a' : '#5a8a3a'}`,
                }}
              >
                {copied ? '✓ 已复制！' : '复制链接'}
              </button>

              {confirmDelete ? (
                <div className="space-y-2">
                  <p className="text-sm text-center text-[#7a5c3a]">确认停止分享？链接将立即失效</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                      className="flex-1 py-2 rounded-xl text-sm text-[#5a4a3a]"
                      style={{ border: '2px solid #5a4a3a', background: '#fff8ee' }}
                    >
                      取消
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 py-2 rounded-xl text-sm font-bold text-white"
                      style={{ background: '#c0392b', border: '2px solid #7a1a1a', opacity: isDeleting ? 0.7 : 1 }}
                    >
                      {isDeleting ? '删除中...' : '确认停止'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-2 rounded-xl text-sm text-[#9f927d]"
                  style={{ border: '1px solid #d4c9b8' }}
                >
                  停止分享
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-[20px] bg-[#f7f0e4] px-4 py-5 text-center">
                <div className="text-4xl mb-3">🐾</div>
                <p className="text-sm text-[#7a5c3a] font-bold mb-1">生成专属图鉴链接</p>
                <p className="text-xs text-[#9f927d] leading-5">
                  任何人都可以通过链接<br />浏览你发现的所有动物
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-white text-sm"
                style={{
                  background: '#7cb342',
                  border: '3px solid #6fba2c',
                  boxShadow: '3px 3px 0px #5a8a3a',
                }}
              >
                生成分享链接
              </button>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
              <p className="text-sm text-orange-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareCollectionModal
