import { useState, useEffect, useRef } from 'react'
import { getRecords, deleteRecord } from '../services/supabaseService'
import { getSpeciesStats } from '../services/collectionService'
import ShareCollectionModal from '../components/ShareCollectionModal'

function PhotoCard({ record, isSelected, isSelectMode, onLongPress, onToggleSelect, onExpand, formatDate }) {
  const longPressTimer = useRef(null)
  const isLongPressed = useRef(false)

  const startLongPress = () => {
    isLongPressed.current = false
    longPressTimer.current = setTimeout(() => {
      isLongPressed.current = true
      onLongPress(record.id)
    }, 500)
  }

  const cancelLongPress = () => {
    clearTimeout(longPressTimer.current)
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    isLongPressed.current = true
    onLongPress(record.id)
  }

  const handleClick = () => {
    if (isLongPressed.current) {
      isLongPressed.current = false
      return
    }
    if (isSelectMode) {
      onToggleSelect(record.id)
    } else {
      onExpand?.(record.id)
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden relative group cursor-pointer"
      style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)' }}
      onMouseDown={startLongPress}
      onMouseUp={cancelLongPress}
      onMouseLeave={cancelLongPress}
      onContextMenu={handleContextMenu}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchMove={cancelLongPress}
      onClick={handleClick}
    >
      <img
        src={record.imageBase64}
        alt={record.species}
        className="w-full h-40 object-cover"
      />
      {isSelectMode && (
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: isSelected ? '#7cb342' : '#ccc' }}>
          {isSelected && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
        </div>
      )}
      <div className="p-2 space-y-1">
        <p className="text-sm font-bold text-gray-800">{record.species}</p>
        <p className="text-xs text-gray-500">{formatDate(record.createdAt)}</p>
      </div>
    </div>
  )
}

function CollectionPage({ onExpandRecord }) {
  const [records, setRecords] = useState([])
  const [selectedSpecies, setSelectedSpecies] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [confirmingBatch, setConfirmingBatch] = useState(false)
  const [isDeletingBatch, setIsDeletingBatch] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [showShareModal, setShowShareModal] = useState(false)

  function normalizeRecord(record) {
    return {
      ...record,
      imageBase64: record.image_base64 ?? record.imageBase64,
      createdAt: record.created_at ?? record.createdAt,
    }
  }

  useEffect(() => {
    let isActive = true

    async function fetchAndAggregateRecords() {
      try {
        const data = await getRecords()
        if (!isActive) {
          return
        }
        setRecords(data.map(normalizeRecord))
        setLoadError(null)
      } catch {
        if (!isActive) {
          return
        }
        setLoadError('加载记录失败，请刷新重试')
      }
    }

    fetchAndAggregateRecords()

    return () => {
      isActive = false
    }
  }, [])

  const speciesStats = getSpeciesStats(records)

  const handleLongPress = (recordId) => {
    setIsSelectMode(true)
    setDeleteError(null)
    const newSelected = new Set([recordId])
    setSelectedIds(newSelected)
  }

  const toggleSelect = (recordId) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId)
    } else {
      newSelected.add(recordId)
    }
    setSelectedIds(newSelected)
  }

  const handleBatchDelete = async () => {
    setIsDeletingBatch(true)
    setDeleteError(null)

    try {
      for (const id of selectedIds) {
        await deleteRecord(id)
      }

      const updated = await getRecords()
      setRecords(updated.map(normalizeRecord))
      setIsSelectMode(false)
      setSelectedIds(new Set())
      setConfirmingBatch(false)

      const selectedCategoryData = speciesStats.find(s => s.category === selectedSpecies)
      if (selectedCategoryData && selectedCategoryData.count <= selectedIds.size) {
        setSelectedSpecies(null)
      }
    } catch (error) {
      setDeleteError(error.message || '删除失败，请重试')
    } finally {
      setIsDeletingBatch(false)
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
            {isSelectMode ? (
              <>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    已选{selectedIds.size}张
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsSelectMode(false)
                    setSelectedIds(new Set())
                  }}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ color: '#5a4a3a', border: '1px solid #5a4a3a' }}
                >
                  取消
                </button>
              <button
                onClick={() => {
                  setDeleteError(null)
                  setConfirmingBatch(true)
                }}
                className="px-3 py-2 rounded-lg text-sm font-bold text-white"
                style={{ background: '#c0392b', border: '1px solid #c0392b' }}
              >
                删除
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedRecords.map((record) => (
              <PhotoCard
                key={record.id}
                record={record}
                isSelected={selectedIds.has(record.id)}
                isSelectMode={isSelectMode}
                onLongPress={handleLongPress}
                onToggleSelect={toggleSelect}
                onExpand={onExpandRecord}
                formatDate={formatDate}
              />
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  已发现{speciesStats.length}种物种
                </h2>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="text-xs"
                  style={{ color: '#b8a898' }}
                >
                  分享图鉴
                </button>
              </div>

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

      <ShareCollectionModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        speciesStats={speciesStats}
        totalCount={records.length}
      />

      {/* 批量删除确认弹窗 */}
      {confirmingBatch && (
        <div
          className="fixed inset-0 z-[140] flex items-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setConfirmingBatch(false)}
        >
          <div
            className="w-full bg-[#fffdf7] rounded-t-2xl px-6 pt-6"
            style={{
              border: '3px solid #5a4a3a',
              boxShadow: '0px -4px 0px #5a4a3a',
              paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 0px))',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl text-center mb-3">🐾</div>
            <p className="text-center font-bold text-gray-800 text-base mb-1">确认删除这{selectedIds.size}条偶遇记录？</p>
            <p className="text-center text-gray-500 text-sm mb-6">它们会永远离开你的图鉴...</p>
            {deleteError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600 text-center">{deleteError}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (isDeletingBatch) return
                  setConfirmingBatch(false)
                }}
                disabled={isDeletingBatch}
                className="flex-1 py-3 rounded-xl font-bold text-[#5a4a3a]"
                style={{ border: '3px solid #5a4a3a', boxShadow: '3px 3px 0px #5a4a3a', backgroundColor: '#fff8ee' }}
              >
                再想想
              </button>
              <button
                onClick={handleBatchDelete}
                disabled={isDeletingBatch}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ border: '3px solid #7a1a1a', boxShadow: '3px 3px 0px #7a1a1a', backgroundColor: '#c0392b', opacity: isDeletingBatch ? 0.75 : 1 }}
              >
                {isDeletingBatch ? '删除中...' : '挥手道别'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionPage
