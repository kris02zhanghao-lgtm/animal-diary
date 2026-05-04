import AchievementBadge from './AchievementBadge'

function AchievementSection({ achievements, unlockedIds, onBadgeClick, progressById }) {
  const unlockedSet = new Set(unlockedIds)
  const hasUnlockedAchievements = unlockedIds.length > 0

  if (!hasUnlockedAchievements) {
    return (
      <section
        className="rounded-[20px] p-4 sm:p-5"
        style={{
          background: 'rgb(247, 243, 223)',
          boxShadow: '0 4px 10px rgba(107, 92, 67, 0.18)',
          border: '2px solid rgba(121, 79, 39, 0.08)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🏅</span>
          <h2 className="text-base font-bold text-[#794f27] m-0">你的成就</h2>
        </div>
        <div className="rounded-[18px] bg-[#fffaf0] px-4 py-5 text-center">
          <p className="text-base font-semibold text-[#7a5c3a]">还没有解锁成就呢</p>
          <p className="mt-2 text-sm leading-6 text-[#9f927d]">
            再多记录几次偶遇，这里会慢慢挂上你的徽章。
          </p>
        </div>
      </section>
    )
  }

  const sortedAchievements = [...achievements].sort((left, right) => {
    const leftScore = unlockedSet.has(left.id) ? 0 : 1
    const rightScore = unlockedSet.has(right.id) ? 0 : 1
    return leftScore - rightScore
  })

  return (
    <section
      className="rounded-[20px] p-4 sm:p-5"
      style={{
        background: 'rgb(247, 243, 223)',
        boxShadow: '0 4px 10px rgba(107, 92, 67, 0.18)',
        border: '2px solid rgba(121, 79, 39, 0.08)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🏅</span>
        <h2 className="text-base font-bold text-[#794f27] m-0">你的成就</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {sortedAchievements.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            isUnlocked={unlockedSet.has(achievement.id)}
            progress={progressById[achievement.id]}
            onClick={() => onBadgeClick(achievement.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default AchievementSection
