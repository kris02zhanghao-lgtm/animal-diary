function AchievementBadge({ achievement, isUnlocked, onClick, progress }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[22px] border px-4 py-4 text-left transition-all duration-200"
      style={{
        background: isUnlocked ? '#fffdf7' : '#f3eee4',
        borderColor: isUnlocked ? 'rgba(121, 79, 39, 0.12)' : 'rgba(159, 146, 125, 0.18)',
        boxShadow: isUnlocked
          ? '0 4px 12px rgba(107, 92, 67, 0.1)'
          : '0 2px 8px rgba(107, 92, 67, 0.06)',
        color: isUnlocked ? '#4f3826' : '#8c7f69',
        opacity: isUnlocked ? 1 : 0.92,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl"
          style={{
            background: isUnlocked ? '#f7f0de' : '#e7e0d3',
            filter: isUnlocked ? 'none' : 'grayscale(1)',
          }}
        >
          {achievement.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="m-0 text-base font-bold">{achievement.name}</h3>
            <span className="shrink-0 text-xs font-semibold">
              {isUnlocked ? '已解锁' : '未解锁'}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6">
            {isUnlocked ? achievement.description : achievement.condition}
          </p>
          {!isUnlocked && progress?.progressLabel && (
            <p className="mt-2 text-xs font-semibold text-[#9f927d]">
              当前进度 {progress.progressLabel}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

export default AchievementBadge
