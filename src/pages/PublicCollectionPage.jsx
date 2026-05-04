import { useEffect, useState } from 'react'
import { getPublicCollection } from '../services/shareCollectionService'
import { getSpeciesStats } from '../services/collectionService'

function PublicCollectionPage({ token }) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSpecies, setSelectedSpecies] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchCollection() {
      try {
        const result = await getPublicCollection(token)
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) {
          setError(err.status === 404 ? 'not_found' : 'error')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchCollection()
    return () => { cancelled = true }
  }, [token])

  function normalizeRecord(r) {
    return {
      ...r,
      imageBase64: r.imageBase64 || r.image_base64,
      createdAt: r.createdAt || r.created_at,
    }
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fffdf7' }}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#e8d8c0] border-t-[#6fba2c] animate-spin" />
          <p className="text-sm text-[#9f927d]">加载图鉴中...</p>
        </div>
      </div>
    )
  }

  if (error === 'not_found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#fffdf7' }}>
        <div className="text-6xl mb-6">🍃</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#5a4a3a' }}>这个图鉴已不再分享</h2>
        <p className="text-sm text-center" style={{ color: '#9f927d' }}>
          链接已失效，或者主人把图鉴收回去了
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#fffdf7' }}>
        <div className="text-6xl mb-6">😿</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#5a4a3a' }}>加载失败</h2>
        <p className="text-sm" style={{ color: '#9f927d' }}>请稍后刷新重试</p>
      </div>
    )
  }

  const { records = [], stats = {} } = data || {}
  const normalizedRecords = records.map(normalizeRecord)
  const speciesStats = getSpeciesStats(normalizedRecords)
  const selectedCategoryData = speciesStats.find(s => s.category === selectedSpecies)
  const selectedRecords = selectedCategoryData?.allRecords || []

  return (
    <div className="min-h-screen pb-12" style={{ background: 'var(--bg-primary)' }}>
      {/* 顶部 header */}
      <div
        className="px-5 pt-8 pb-5"
        style={{
          background: 'linear-gradient(135deg, #f7f0e4 0%, #fffdf7 100%)',
          borderBottom: '2px solid #e8d8c0',
        }}
      >
        <p className="text-xs text-[#9f927d] mb-1">🌿 动物偶遇图鉴</p>
        <h1 className="text-xl font-bold text-[#5a4a3a] mb-4">TA 的动物发现</h1>

        {stats.total > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div
              className="rounded-2xl px-3 py-3 text-center"
              style={{ background: '#fff8ee', border: '2px solid #e8d8c0', boxShadow: '2px 2px 0 #d4c9b8' }}
            >
              <p className="text-2xl font-bold text-[#5a4a3a]">{stats.total}</p>
              <p className="text-xs text-[#9f927d] mt-1">次偶遇</p>
            </div>
            <div
              className="rounded-2xl px-3 py-3 text-center"
              style={{ background: '#fff8ee', border: '2px solid #e8d8c0', boxShadow: '2px 2px 0 #d4c9b8' }}
            >
              <p className="text-2xl font-bold text-[#5a4a3a]">{speciesStats.length}</p>
              <p className="text-xs text-[#9f927d] mt-1">种物种</p>
            </div>
            <div
              className="rounded-2xl px-2 py-3 text-center"
              style={{ background: '#fff8ee', border: '2px solid #e8d8c0', boxShadow: '2px 2px 0 #d4c9b8' }}
            >
              <p
                className="text-sm font-bold text-[#5a4a3a] leading-tight overflow-hidden"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {stats.topSpecies?.[0]?.name || '—'}
              </p>
              <p className="text-xs text-[#9f927d] mt-1">最常遇到</p>
            </div>
          </div>
        )}
      </div>

      {/* 图鉴内容 */}
      <div className="px-4 pt-6">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-6xl mb-6">🐾</div>
            <p className="text-base font-bold text-[#5a4a3a]">还没有任何发现</p>
            <p className="text-sm text-[#9f927d] mt-2">这个图鉴还是空的</p>
          </div>
        ) : selectedSpecies ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setSelectedSpecies(null)}
                className="text-2xl"
                style={{ color: 'var(--text-primary)' }}
              >
                ←
              </button>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedSpecies}（{selectedCategoryData?.count}次）
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedRecords.map(record => (
                <div
                  key={record.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)' }}
                >
                  <img
                    src={record.imageBase64}
                    alt={record.species}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 space-y-1">
                    <p className="text-sm font-bold text-gray-800">{record.species}</p>
                    <p className="text-xs text-gray-500">{formatDate(record.createdAt)}</p>
                    {record.location && (
                      <p className="text-xs text-gray-400">📍 {record.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-[#9f927d] mb-4">点击分类查看详细照片</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {speciesStats.map(stat => (
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
                  <div className="p-3 space-y-1">
                    <h3 className="font-bold text-gray-800">{stat.category}</h3>
                    <p className="text-sm text-gray-600">遇到{stat.count}次</p>
                    <p className="text-xs text-gray-500">{stat.mostRecentLocation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-[#b8a898]">🐾 动物偶遇图鉴</p>
      </div>
    </div>
  )
}

export default PublicCollectionPage
