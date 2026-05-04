function formatUnlockDate(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  }).format(date)
}

function AchievementModal({
  achievement,
  isOpen,
  onClose,
  progress,
  mode = 'detail',
  onViewDetails,
}) {
  if (!isOpen || !achievement) return null

  const isUnlockMode = mode === 'unlock'
  const isUnlocked = progress?.unlocked
  const unlockDate = formatUnlockDate(progress?.unlockedAt)

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(0, 0, 0, 0.35)', animation: 'fade-in 0.25s ease' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-[28px]"
        style={{
          background: '#fffdf7',
          boxShadow: '0 12px 32px rgba(61, 52, 40, 0.18)',
          animation: `${isUnlockMode ? 'bounce-in' : 'zoom-in'} 0.3s ease`,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="text-sm text-[#9f927d]">
              {isUnlockMode ? '🎉 新成就解锁' : '🏅 成就详情'}
            </p>
            <h2 className="m-0 text-lg font-bold text-[#5a4a3a]">{achievement.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-[#f4ebdc] text-xl text-[#7a5c3a]"
            aria-label="关闭成就弹窗"
          >
            ×
          </button>
        </div>

        <div className="px-5 pb-5">
          <div className="rounded-[24px] bg-[#f7f0e4] px-5 py-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#fffaf1] text-4xl">
              {achievement.icon}
            </div>
            <p className="text-base font-semibold leading-7 text-[#4f3826]">
              {isUnlockMode
                ? `你刚刚解锁了「${achievement.name}」`
                : achievement.description}
            </p>
            {isUnlockMode && (
              <p className="mt-2 text-sm leading-6 text-[#7a5c3a]">{achievement.description}</p>
            )}
          </div>

          <div className="mt-4 space-y-3 rounded-[24px] border border-[#ead8bc] bg-[#fffaf1] px-4 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#b39b7c]">
                解锁条件
              </p>
              <p className="mt-1 text-sm leading-6 text-[#5a4a3a]">{achievement.condition}</p>
            </div>

            {isUnlocked ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#b39b7c]">
                  解锁状态
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5a4a3a]">
                  已满足条件{unlockDate ? ` · 解锁于 ${unlockDate}` : ''}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#b39b7c]">
                  当前进度
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5a4a3a]">
                  {progress?.progressLabel || '0/0'}
                </p>
              </div>
            )}
          </div>

          {isUnlockMode && (
            <button
              type="button"
              onClick={onViewDetails}
              className="mt-4 w-full btn btn-md btn-primary"
            >
              查看详情
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementModal
