import { useState, useEffect } from 'react'
import { getRecords, deleteRecord } from '../services/supabaseService'
import { getSpeciesStats } from '../services/collectionService'

function CollectionPage() {
  const [records, setRecords] = useState([])
  const [speciesStats, setSpeciesStats] = useState([])
  const [selectedSpecies, setSelectedSpecies] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)

  useEffect(() => {
    fetchAndAggregateRecords()
  }, [])

  const fetchAndAggregateRecords = async () => {
    try {
      const data = await getRecords()
      setRecords(data.map(normalizeRecord))
      setLoadError(null)
    } catch {
      setLoadError('加载记录失败，请刷新重试')
    }
  }

  useEffect(() => {
    const stats = getSpeciesStats(records)
    setSpeciesStats(stats)
  }, [records])

  const normalizeRecord = (r) => ({
    ...r,
    imageBase64: r.image_base64 ?? r.imageBase64,
    createdAt: r.created_at ?? r.createdAt,
  })

  const handleDelete = async () => {
    await deleteRecord(confirmingId)
    const updated = await getRecords()
    setRecords(updated.map(normalizeRecord))
    setConfirmingId(null)

    const selectedSpeciesData = speciesStats.find(s => s.species === selectedSpecies)
    if (selectedSpeciesData && selectedSpeciesData.count === 1) {
      setSelectedSpecies(null)
    }
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const selectedCategoryData = speciesStats.find(s => s.category === selectedSpecies)
  const selectedRecords = selectedCategoryData?.allRecords || []

  return (
    <div className="min-h-screen px-4 py-6 pb-24" style={{ background: 'var(--bg-primary)' }}>
      {loadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{loadError}</p>
        </div>
      )}

      {selectedSpecies ? (
        // 第二层：物种照片网格
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSelectedSpecies(null)}
              className="text-2xl"
              style={{ color: 'var(--text-primary)' }}
              aria-label="返回"
            >
              ←
            </button>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedSpecies}（遇到{selectedCategoryData.count}次）
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-xl overflow-hidden relative group cursor-pointer"
                style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)' }}
                onClick={() => {
                  // 点击照片查看详情（通过 CollectionPage 展开或导航）
                }}
              >
                <img
                  src={record.imageBase64}
                  alt={record.species}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 space-y-1">
                  <p className="text-sm font-bold text-gray-800">{record.species}</p>
                  <p className="text-xs text-gray-500">{formatDate(record.createdAt)}</p>
                </div>

                {/* 删除按钮 - hover 显示 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setConfirmingId(record.id)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // 第一层：物种卡片网格
        <div>
          {speciesStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
              <div className="text-6xl mb-6">🐾</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                还没有发现任何物种
              </h2>
              <p className="text-base text-center" style={{ color: 'var(--text-secondary)' }}>
                去记录偶遇吧～<br />让你的图鉴丰富起来！
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                已发现{speciesStats.length}种物种
              </h2>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {speciesStats.map((stat) => (
                  <div
                    key={stat.category}
                    onClick={() => setSelectedSpecies(stat.category)}
                    className="rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
                    style={{
                      background: 'rgb(247, 243, 223)',
                      boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)',
                    }}
                  >
                    <img
                      src={stat.latestPhoto}
                      alt={stat.category}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3 space-y-2">
                      <h3 className="font-bold text-gray-800">{stat.category}</h3>
                      <p className="text-sm text-gray-600">
                        遇到{stat.count}次
                      </p>
                      <p className="text-xs text-gray-500">{stat.mostRecentLocation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 删除确认弹窗 */}
      {confirmingId && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setConfirmingId(null)}
        >
          <div
            className="w-full bg-[#fffdf7] rounded-t-2xl px-6 pt-6 pb-10"
            style={{ border: '3px solid #5a4a3a', boxShadow: '0px -4px 0px #5a4a3a' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl text-center mb-3">🐾</div>
            <p className="text-center font-bold text-gray-800 text-base mb-1">确认删除这条偶遇记录？</p>
            <p className="text-center text-gray-500 text-sm mb-6">它会永远离开你的图鉴...</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmingId(null)}
                className="flex-1 py-3 rounded-xl font-bold text-[#5a4a3a]"
                style={{ border: '3px solid #5a4a3a', boxShadow: '3px 3px 0px #5a4a3a', backgroundColor: '#fff8ee' }}
              >
                再想想
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ border: '3px solid #7a1a1a', boxShadow: '3px 3px 0px #7a1a1a', backgroundColor: '#c0392b' }}
              >
                挥手道别
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionPage
