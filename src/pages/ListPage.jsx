import { useState, useMemo, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import { getRecords, deleteRecord, updateRecord, detectReturning, confirmReturning } from '../services/supabaseService'
import LocationPicker from '../components/LocationPicker'
import ShareModal from '../components/ShareModal'
import ReturningSuggestionModal from '../components/ReturningSuggestionModal'
import SpeciesCorrectionSheet from '../components/SpeciesCorrectionSheet'

function TimelineSkeleton() {
  return (
    <div className="space-y-12 pb-24 animate-pulse">
      {[0, 1].map((groupIndex) => (
        <div key={groupIndex} className="pb-16">
          <div className="h-6 w-28 rounded-full mb-4 bg-[#eadfcb]" />
          <div className="flex gap-4 overflow-hidden">
            {[0, 1].map((cardIndex) => (
              <div
                key={cardIndex}
                className="w-64 shrink-0 rounded-2xl overflow-hidden"
                style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.18)' }}
              >
                <div className="h-64 bg-[#eadfcb]" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-24 rounded-full bg-[#eadfcb]" />
                  <div className="h-3 w-20 rounded-full bg-[#f0e8d8]" />
                  <div className="h-3 w-16 rounded-full bg-[#f0e8d8]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ListPage({ initialExpandedId = null, isActive = false }) {
  const [records, setRecords] = useState([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [hasLoadedRecordsOnce, setHasLoadedRecordsOnce] = useState(false)
  const [confirmingId, setConfirmingId] = useState(null)
  const [expandedId, setExpandedId] = useState(initialExpandedId)
  const [expandingMenuId, setExpandingMenuId] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingJournal, setEditingJournal] = useState('')
  const [editingSpecies, setEditingSpecies] = useState('')
  const [editingLocation, setEditingLocation] = useState('')
  const [editingLatitude, setEditingLatitude] = useState(null)
  const [editingLongitude, setEditingLongitude] = useState(null)
  const [editingCategory, setEditingCategory] = useState('')
  const [editingSpeciesTag, setEditingSpeciesTag] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [detailSaveError, setDetailSaveError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [shareRecord, setShareRecord] = useState(null)
  const [detectingId, setDetectingId] = useState(null)
  const [detectingError, setDetectingError] = useState(null)
  const [detectionMessage, setDetectionMessage] = useState(null)
  const [suggestedRecord, setSuggestedRecord] = useState(null)
  const [suggestedScore, setSuggestedScore] = useState(null)
  const [suggestedNewRecordId, setSuggestedNewRecordId] = useState(null)
  const [prevRecord, setPrevRecord] = useState(null)
  const [navigatingToLinked, setNavigatingToLinked] = useState(false)
  const [isDeletingRecord, setIsDeletingRecord] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [showSpeciesCorrection, setShowSpeciesCorrection] = useState(false)
  const menuRef = useRef(null)
  const prevIsActiveRef = useRef(isActive)

  const expandedRecord = expandedId ? records.find(r => r.id === expandedId) : null

  useEffect(() => {
    let ignore = false

    const loadRecords = async ({ showSkeleton }) => {
      if (showSkeleton) {
        setIsLoadingRecords(true)
      }

      try {
        const data = await getRecords()
        if (ignore) return
        setRecords(data.map(normalizeRecord))
        setLoadError(null)
      } catch {
        if (ignore) return
        setLoadError('加载记录失败，请刷新重试')
      } finally {
        if (!ignore) {
          setIsLoadingRecords(false)
          setHasLoadedRecordsOnce(true)
        }
      }
    }

    if (!hasLoadedRecordsOnce) {
      loadRecords({ showSkeleton: true })
    } else if (isActive && !prevIsActiveRef.current) {
      loadRecords({ showSkeleton: false })
    }

    prevIsActiveRef.current = isActive

    return () => {
      ignore = true
    }
  }, [hasLoadedRecordsOnce, isActive])

  useEffect(() => {
    if (initialExpandedId) {
      setExpandedId(initialExpandedId)
    }
  }, [initialExpandedId])

  useEffect(() => {
    if (expandedRecord) {
      setEditingTitle(expandedRecord.title || '')
      setEditingJournal(expandedRecord.journal || '')
      setEditingSpecies(expandedRecord.species || '')
      setEditingLocation(expandedRecord.location || '')
      setEditingLatitude(expandedRecord.latitude || null)
      setEditingLongitude(expandedRecord.longitude || null)
      setEditingCategory(expandedRecord.category || '')
      setEditingSpeciesTag(expandedRecord.species_tag || '')
      setDetailSaveError(null)
      setIsEditing(false)
    }
  }, [expandedRecord])

  const normalizeRecord = (r) => ({
    ...r,
    imageBase64: r.image_base64 ?? r.imageBase64,
    createdAt: r.created_at ?? r.createdAt,
  })

  const getSeasonLabel = (dateString) => {
    const d = new Date(dateString)
    const year = d.getFullYear()
    const month = d.getMonth() + 1

    let season
    if (month >= 3 && month <= 5) season = '春'
    else if (month >= 6 && month <= 8) season = '夏'
    else if (month >= 9 && month <= 11) season = '秋'
    else season = '冬'

    return `${year}年${season}`
  }

  const groupedRecords = useMemo(() => {
    const groups = {}
    records.forEach((record) => {
      const label = getSeasonLabel(record.createdAt)
      if (!groups[label]) {
        groups[label] = { label, items: [] }
      }
      groups[label].items.push(record)
    })

    return Object.entries(groups)
      .map(([seasonKey, group]) => ({ seasonKey, ...group }))
      .sort((a, b) => b.seasonKey.localeCompare(a.seasonKey))
  }, [records])

  const handleLocationConfirm = async ({ location, latitude, longitude }) => {
    if (!expandedRecord) return
    setEditingLocation(location)
    setEditingLatitude(latitude)
    setEditingLongitude(longitude)
    setShowLocationPicker(false)
  }

  const handleNavigateToLinked = (targetId) => {
    setPrevRecord(expandedRecord)
    setNavigatingToLinked(true)
    setTimeout(() => {
      setExpandedId(targetId)
      setNavigatingToLinked(false)
    }, 400)
  }

  const handleDetectReturning = async () => {
    if (!expandedRecord) return
    setDetectingId(expandedRecord.id)
    setDetectingError(null)
    setDetectionMessage(null)

    try {
      const result = await detectReturning(expandedRecord.id)

      if (result.detected && result.score >= 60) {
        setSuggestedRecord(result.similarRecord)
        setSuggestedScore(result.score)
        setSuggestedNewRecordId(expandedRecord.id)
        const updatedRecords = records.map(r =>
          r.id === expandedRecord.id
            ? { ...r, similarity_score: result.score, similar_record_id: result.similarRecordId }
            : r
        )
        setRecords(updatedRecords)
      } else {
        const msg = '未找到相似记录，可能是新朋友呢'
        setDetectionMessage(msg)
        setTimeout(() => setDetectionMessage(null), 5000)
      }
    } catch {
      setDetectingError('检测失败，请重试')
    } finally {
      setDetectingId(null)
      setExpandingMenuId(null)
    }
  }

  const handleConfirmReturningFromDetail = async () => {
    if (!suggestedNewRecordId) return
    try {
      await confirmReturning(suggestedNewRecordId)
      const updated = await getRecords()
      setRecords(updated.map(normalizeRecord))
    } catch {
      // 失败时静默，关闭弹窗
    } finally {
      setSuggestedRecord(null)
      setSuggestedScore(null)
      setSuggestedNewRecordId(null)
    }
  }

  const handleSaveDetail = async () => {
    if (!expandedRecord || !editingSpecies.trim()) return
    setIsSaving(true)
    setDetailSaveError(null)
    try {
      await updateRecord(expandedRecord.id, {
        title: editingTitle,
        species: editingSpecies,
        category: editingCategory,
        species_tag: editingSpeciesTag,
        journal: editingJournal,
        location: editingLocation,
        latitude: editingLatitude,
        longitude: editingLongitude,
      })
      const updated = await getRecords()
      const normalized = updated.map(normalizeRecord)
      setRecords(normalized)
      setIsEditing(false)
    } catch {
      setDetailSaveError('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeletingRecord(true)
    setDeleteError(null)

    try {
      await deleteRecord(confirmingId)
      const updated = await getRecords()
      setRecords(updated.map(normalizeRecord))
      setLoadError(null)
      setConfirmingId(null)
      setExpandedId(null)
      setExpandingMenuId(null)
    } catch (error) {
      setDeleteError(error.message || '删除记录失败')
    } finally {
      setIsDeletingRecord(false)
    }
  }

  const handleOpenShare = (record) => {
    setShareRecord(record)
    setExpandingMenuId(null)
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // 点击菜单外关闭菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setExpandingMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  return (
    <div className="min-h-screen px-4 py-6" style={{ background: 'var(--bg-primary)' }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      {/* 页面标题 */}
      <h1
        className="text-center text-xl mt-4 mb-6"
        style={{ fontFamily: "'Press Start 2P', cursive", color: 'var(--text-primary)' }}
      >
        我的动物图鉴
      </h1>

      {loadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{loadError}</p>
        </div>
      )}

      {/* 展开态详情视图 - 全屏显示，列表隐藏 */}
      {expandedRecord ? (
        <div className="mb-24 max-w-2xl mx-auto">
          {/* 详情视图顶部 */}
          <div className="flex justify-between items-center mb-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditingTitle(expandedRecord.title || '')
                    setEditingJournal(expandedRecord.journal || '')
                    setEditingSpecies(expandedRecord.species || '')
                    setEditingLocation(expandedRecord.location || '')
                    setEditingLatitude(expandedRecord.latitude || null)
                    setEditingLongitude(expandedRecord.longitude || null)
                    setEditingCategory(expandedRecord.category || '')
                    setEditingSpeciesTag(expandedRecord.species_tag || '')
                    setDetailSaveError(null)
                  }}
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ background: '#f0e8d8', color: '#7a5c3a' }}
                >
                  取消
                </button>
                <button
                  onClick={handleSaveDetail}
                  disabled={!editingSpecies.trim() || isSaving}
                  className="text-sm px-4 py-1 rounded-full font-bold"
                  style={{
                    background: editingSpecies.trim() && !isSaving ? '#d4a574' : '#ccc',
                    color: 'white',
                    cursor: editingSpecies.trim() && !isSaving ? 'pointer' : 'not-allowed',
                  }}
                >
                  {isSaving ? '保存中...' : '保存'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setExpandedId(null); setPrevRecord(null) }}
                  className="text-2xl"
                  style={{ color: 'var(--text-primary)' }}
                  aria-label="返回"
                >
                  ←
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm px-3 py-1 rounded-full"
                    style={{ background: '#f0e8d8', color: '#7a5c3a' }}
                  >
                    ✏️ 编辑
                  </button>
                  <button
                    onClick={() => {
                      if (expandedRecord.similar_record_id) {
                        handleNavigateToLinked(expandedRecord.similar_record_id)
                      } else {
                        handleDetectReturning()
                      }
                    }}
                    disabled={detectingId === expandedId || navigatingToLinked}
                    className="text-sm px-3 py-1 rounded-full"
                    style={{
                      background: (detectingId === expandedId || navigatingToLinked) ? '#ccc' : '#f0e8d8',
                      color: '#7a5c3a',
                      cursor: (detectingId === expandedId || navigatingToLinked) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {navigatingToLinked ? '跳转中...' : detectingId === expandedId ? '检测中...' : expandedRecord.similar_record_id ? '🔍 查看关联' : '🔍 回头客'}
                  </button>
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setExpandingMenuId(expandingMenuId === expandedId ? null : expandedId)}
                      className="text-xl text-gray-600 hover:text-gray-800 font-bold"
                      aria-label="菜单"
                    >
                      ⋮
                    </button>
                    {expandingMenuId === expandedId && (
                      <div
                        className="absolute right-0 top-8 z-20 rounded-xl overflow-hidden"
                        style={{
                          background: 'rgb(247, 243, 223)',
                          boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)',
                          minWidth: '140px'
                        }}
                      >
                        <button
                          onClick={handleDetectReturning}
                          disabled={detectingId === expandedId}
                          className="block w-full text-left px-4 py-2 text-sm"
                          style={{ color: '#794f27' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f0e8d8'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {detectingId === expandedId ? '检测中...' : '查找回头客'}
                        </button>
                        <button
                          onClick={() => {
                            handleOpenShare(expandedRecord)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm"
                          style={{ color: '#794f27' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f0e8d8'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          分享
                        </button>
                        <button
                          onClick={() => {
                            setConfirmingId(expandedRecord.id)
                            setExpandingMenuId(null)
                          }}
                          className="block w-full text-left px-4 py-2 text-sm last:rounded-b-md"
                          style={{ color: '#e05a5a' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f0e8d8'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          删除
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 面包屑：来自关联跳转时显示 */}
          {prevRecord && (
            <div className="flex items-center gap-2 text-xs mb-2 px-1" style={{ color: '#7a5c3a' }}>
              <button
                onClick={() => handleNavigateToLinked(prevRecord.id)}
                className="flex items-center gap-1 hover:underline"
              >
                ← {prevRecord.species || '上一条记录'}
              </button>
              <span style={{ color: '#c9a97a' }}>/ 关联记录</span>
            </div>
          )}

          {/* 详情卡片 */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)' }}
          >
            {/* 大图 */}
            <img
              src={expandedRecord.imageBase64}
              alt={expandedRecord.species}
              className="w-full max-h-96 object-contain"
              style={{ background: 'rgb(247, 243, 223)' }}
            />

            {/* 内容区域 */}
            <div className="p-5 space-y-4">
              {/* 标题 */}
              {isEditing ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full text-lg font-bold px-3 py-2 rounded-lg focus:outline-none"
                  style={{ background: '#f0e8d8', border: '1px solid #c9a97a', color: '#3d2b1a' }}
                  placeholder="偶遇小标题"
                />
              ) : (
                <p className="text-lg font-bold" style={{ color: '#3d2b1a' }}>
                  {expandedRecord.title || ''}
                </p>
              )}

              {/* 日志 */}
              <div>
                <p className="text-sm text-gray-500 mb-2">偶遇日志</p>
                {isEditing ? (
                  <textarea
                    value={editingJournal}
                    onChange={(e) => setEditingJournal(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg focus:outline-none min-h-28 resize-none leading-relaxed"
                    style={{ background: '#f0e8d8', border: '1px solid #c9a97a', color: '#3d2b1a' }}
                    placeholder="记录你的发现..."
                  />
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {expandedRecord.journal}
                  </p>
                )}
              </div>

              {/* 物种、地点、日期 */}
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span>🐾</span>
                  {isEditing ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editingSpecies}
                        onChange={(e) => {
                          setEditingSpecies(e.target.value)
                          setEditingCategory('')
                          setEditingSpeciesTag('')
                        }}
                        className="flex-1 font-bold px-3 py-1.5 rounded-lg focus:outline-none"
                        style={{ background: '#f0e8d8', border: '1px solid #c9a97a', color: '#3d2b1a' }}
                        placeholder="动物种类"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSpeciesCorrection(true)}
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ background: '#ebe1cf', color: '#7a5c3a' }}
                      >
                        修正
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold text-gray-800">{expandedRecord.species}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span>📍</span>
                    <span className="text-gray-600 text-sm">
                      {isEditing ? (editingLocation || '暂无地点') : (expandedRecord.location || '暂无地点')}
                    </span>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => setShowLocationPicker(true)}
                      className="text-xs px-2 py-1 rounded-full ml-2"
                      style={{ background: '#e8d8c0', color: '#7a5c3a' }}
                    >
                      修改
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-400">{formatDate(expandedRecord.createdAt)}</div>

                {detailSaveError && (
                  <p className="text-xs text-red-500">{detailSaveError}</p>
                )}
              </div>

              {/* 我指向的关联 */}
              {expandedRecord.similarity_score >= 40 && expandedRecord.similar_record_id && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">关联记录</p>
                  <div className="flex items-center justify-between">
                    <div>
                      {expandedRecord.confirmed_returning && (
                        <p className="text-sm font-medium text-[#d4874b] mb-1">🐾 老朋友</p>
                      )}
                      <p className="text-sm text-gray-700">
                        相似度 <span className="font-bold text-[#d4874b]">{expandedRecord.similarity_score}%</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleNavigateToLinked(expandedRecord.similar_record_id)}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{ background: '#e8d9c0', color: '#7a5c3a' }}
                    >
                      查看关联
                    </button>
                  </div>
                </div>
              )}

              {/* 指向我的关联（反向） */}
              {expandedRecord.linked_from && expandedRecord.linked_from.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">被以下记录关联</p>
                  <div className="space-y-2">
                    {expandedRecord.linked_from.map(linked => (
                      <div key={linked.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-700">{linked.species}</p>
                          <p className="text-xs text-gray-400">{formatDate(linked.created_at)} · 相似度 {linked.similarity_score}%</p>
                        </div>
                        <button
                          onClick={() => handleNavigateToLinked(linked.id)}
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ background: '#e8d9c0', color: '#7a5c3a' }}
                        >
                          查看
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 检测反馈提示 */}
              {detectionMessage && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-[#7a5c3a] text-center">{detectionMessage}</p>
                </div>
              )}
              {detectingError && detectingId === expandedRecord.id && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-orange-600 text-center">{detectingError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : !hasLoadedRecordsOnce && isLoadingRecords ? (
        <TimelineSkeleton />
      ) : records.length === 0 ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-6xl mb-6">🐿️</div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>还没有偶遇记录</h2>
          <p className="text-base text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            出门遇见小动物拍一张吧～<br />让你的城市日志热闹起来！
          </p>
        </div>
      ) : (
        /* 分组列表 */
        <div className="space-y-12 pb-24">
          {groupedRecords.map((group) => (
            <div key={group.seasonKey} className="pb-16">
              {/* 分组标题 */}
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{group.label}</h2>

              {/* Swiper 轮播 */}
              <div style={{ overflow: 'visible' }}>
                <Swiper
                  modules={[EffectCoverflow]}
                  effect="coverflow"
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView="auto"
                  spaceBetween={20}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    scale: 0.8,
                    slideShadows: false,
                  }}
                  className="w-full"
                  style={{ overflow: 'visible' }}
                >
                {group.items.map((record) => (
                  <SwiperSlide
                    key={record.id}
                    style={{ width: '260px', paddingTop: '20px', paddingBottom: '20px' }}
                    className="flex justify-center items-start"
                  >
                    <div
                      className="w-64 rounded-2xl overflow-hidden relative transition-transform duration-300 hover:shadow-lg"
                      style={{ background: 'rgb(247, 243, 223)', boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)', marginBottom: '12px' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {/* 菜单按钮 */}
                      <div className="absolute top-3 right-3 z-10" ref={expandingMenuId === record.id ? menuRef : null}>
                        <button
                          onClick={() => setExpandingMenuId(expandingMenuId === record.id ? null : record.id)}
                          className="rounded-full w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 font-bold"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                          aria-label="菜单"
                        >
                          ⋮
                        </button>

                        {expandingMenuId === record.id && (
                          <div
                            className="absolute right-0 top-10 z-20 rounded-xl overflow-hidden"
                            style={{
                              background: 'rgb(247, 243, 223)',
                              boxShadow: '0 4px 10px rgba(107, 92, 67, 0.42)',
                              minWidth: '100px'
                            }}
                          >
                            <button
                              onClick={() => {
                                setExpandedId(record.id)
                                setExpandingMenuId(null)
                              }}
                              className="block w-full text-left px-3 py-2 text-xs first:rounded-t-md"
                              style={{ color: '#794f27' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f0e8d8'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              展开
                            </button>
                            <button
                              onClick={() => {
                                handleOpenShare(record)
                              }}
                              className="block w-full text-left px-3 py-2 text-xs"
                              style={{ color: '#794f27' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f0e8d8'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              分享
                            </button>
                            <button
                              onClick={() => {
                                setConfirmingId(record.id)
                                setDeleteError(null)
                                setExpandingMenuId(null)
                              }}
                              className="block w-full text-left px-3 py-2 text-xs last:rounded-b-md"
                              style={{ color: '#e05a5a' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#f0e8d8'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              删除
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 图片 */}
                      <img
                        src={record.imageBase64}
                        alt={record.species}
                        className="w-full h-64 object-cover"
                      />

                      {/* 信息区 */}
                      <div className="p-3 space-y-2">
                        {/* 物种 */}
                        <div className="flex items-center gap-1">
                          <span className="text-sm">🐾</span>
                          <span className="text-sm font-bold text-[#3d2b1a]">{record.species}</span>
                        </div>

                        {/* 地点 */}
                        <div className="flex items-center gap-1">
                          <span className="text-sm">📍</span>
                          <span className="text-xs text-gray-600">{record.location}</span>
                        </div>

                        {/* 日期 */}
                        <div className="text-xs text-gray-400">{formatDate(record.createdAt)}</div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
                </Swiper>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 删除确认弹窗 */}
      {confirmingId && (
        <div
          className="fixed inset-0 z-[140] flex items-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setConfirmingId(null)}
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
            <p className="text-center font-bold text-gray-800 text-base mb-1">确认删除这条偶遇记录？</p>
            <p className="text-center text-gray-500 text-sm mb-6">它会永远离开你的图鉴...</p>
            {deleteError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600 text-center">{deleteError}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (isDeletingRecord) return
                  setConfirmingId(null)
                }}
                disabled={isDeletingRecord}
                className="flex-1 py-3 rounded-xl font-bold text-[#5a4a3a]"
                style={{ border: '3px solid #5a4a3a', boxShadow: '3px 3px 0px #5a4a3a', backgroundColor: '#fff8ee' }}
              >
                再想想
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeletingRecord}
                className="flex-1 py-3 rounded-xl font-bold text-white"
                style={{ border: '3px solid #7a1a1a', boxShadow: '3px 3px 0px #7a1a1a', backgroundColor: '#c0392b', opacity: isDeletingRecord ? 0.75 : 1 }}
              >
                {isDeletingRecord ? '删除中...' : '挥手道别'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 匿名模式提示 */}
      <p className="text-center text-xs text-gray-400 py-4">匿名模式，记录与本设备绑定</p>

      {/* 修改定位面板 */}
      {showLocationPicker && (
        <LocationPicker
          onConfirm={handleLocationConfirm}
          onClose={() => setShowLocationPicker(false)}
        />
      )}

      <ShareModal
        record={shareRecord}
        isOpen={Boolean(shareRecord)}
        onClose={() => setShareRecord(null)}
      />

      {suggestedRecord && (
        <ReturningSuggestionModal
          similarRecord={suggestedRecord}
          score={suggestedScore}
          onConfirm={handleConfirmReturningFromDetail}
          onDismiss={() => {
            setSuggestedRecord(null)
            setSuggestedScore(null)
            setSuggestedNewRecordId(null)
          }}
        />
      )}

      <SpeciesCorrectionSheet
        isOpen={showSpeciesCorrection}
        onClose={() => setShowSpeciesCorrection(false)}
        value={editingSpecies}
        category={editingCategory}
        speciesTag={editingSpeciesTag}
        onApply={({ species: nextSpecies, category: nextCategory, speciesTag: nextSpeciesTag }) => {
          setEditingSpecies(nextSpecies)
          setEditingCategory(nextCategory)
          setEditingSpeciesTag(nextSpeciesTag)
        }}
      />
    </div>
  )
}

export default ListPage
