import { useState } from 'react'

function ReturningSuggestionModal({ similarRecord, score, onConfirm, onDismiss }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
    } finally {
      setIsLoading(false)
    }
  }

  if (!similarRecord) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div
        className="rounded-2xl max-w-sm w-full shadow-xl overflow-hidden"
        style={{
          border: '3px solid #5a4a3a',
          background: '#fef9f3',
        }}
      >
        {similarRecord.image_base64 && (
          <div
            className="w-full flex items-center justify-center"
            style={{
              height: '260px',
              overflow: 'hidden',
              padding: '12px',
            }}
          >
            <img
              src={similarRecord.image_base64}
              alt="相似动物"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        <div className="px-6 pb-6 space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-2">🐾</div>
            <h2 className="text-lg font-bold text-[#3d2b1a] mb-1">是老朋友吗？</h2>
            <p className="text-sm text-[#7a5c3a]">
              与 <span className="font-semibold">{formatDate(similarRecord.created_at)}</span> 那只<span className="font-semibold">{similarRecord.species}</span> 相似度{' '}
              <span className="font-bold text-[#d4874b]">{score}%</span>
            </p>
          </div>

          <p className="text-xs text-[#7a5c3a] leading-relaxed text-center px-1">
            {similarRecord.title}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onDismiss}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                background: '#f5ede0',
                color: '#7a5c3a',
              }}
            >
              忽略
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors"
              style={{
                background: isLoading ? '#d4874b' : 'linear-gradient(135deg, #d4874b 0%, #c97a3f 100%)',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? '确认中...' : '确认关联'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturningSuggestionModal
