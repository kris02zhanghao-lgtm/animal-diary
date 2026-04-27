import { useState, useMemo, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import { getRecords, deleteRecord, updateRecord } from '../services/supabaseService'
import LocationPicker from '../components/LocationPicker'

function ListPage({ initialExpandedId = null }) {
  const [records, setRecords] = useState([])
  const [confirmingId, setConfirmingId] = useState(null)
  const [expandedId, setExpandedId] = useState(initialExpandedId)
  const [expandingMenuId, setExpandingMenuId] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [isSavingLocation, setIsSavingLocation] = useState(false)
  const [locationSaveError, setLocationSaveError] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingJournal, setEditingJournal] = useState('')
  const [editingSpecies, setEditingSpecies] = useState('')
  const [editingLocation, setEditingLocation] = useState('')
  const [editingLatitude, setEditingLatitude] = useState(null)
  const [editingLongitude, setEditingLongitude] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [detailSaveError, setDetailSaveError] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    getRecords()
      .then((data) => {
        setRecords(data.map(normalizeRecord))
        setLoadError(null)
      })
      .catch(() => {
        setLoadError('加载记录失败，请刷新重试')
      })
  }, [])

  useEffect(() => {
    if (expandedRecord) {
      setEditingTitle(expandedRecord.title || '')
      setEditingJournal(expandedRecord.journal || '')
      setEditingSpecies(expandedRecord.species || '')
      setEditingLocation(expandedRecord.location || '')
      setEditingLatitude(expandedRecord.latitude || null)
      setEditingLongitude(expandedRecord.longitude || null)
      setDetailSaveError(null)
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

  const handleSaveDetail = async () => {
    if (!expandedRecord || !editingSpecies.trim()) return
    setIsSaving(true)
    setDetailSaveError(null)
    try {
      await updateRecord(expandedRecord.id, {
        title: editingTitle,
        species: editingSpecies,
        journal: editingJournal,
        location: editingLocation,
        latitude: editingLatitude,
        longitude: editingLongitude,
      })
      const updated = await getRecords()
      const normalized = updated.map(normalizeRecord)
      setRecords(normalized)
    } catch {
      setDetailSaveError('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    await deleteRecord(confirmingId)
    const updated = await getRecords()
    setRecords(updated.map(normalizeRecord))
    setLoadError(null)
    setConfirmingId(null)
    setExpandedId(null)
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

  // 展开态的卡片对象
  const expandedRecord = expandedId ? records.find(r => r.id === expandedId) : null

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
          {/* 详情视图顶部：返回按钮 + 菜单 */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setExpandedId(null)}
              className="text-2xl"
              style={{ color: 'var(--text-primary)' }}
              aria-label="返回"
            >
              ←
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
                    minWidth: '120px'
                  }}
                >
                  <button
                    onClick={() => {
                      alert('即将上线，敬请期待！')
                      setExpandingMenuId(null)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm first:rounded-t-md"
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

            {/* 标题 */}
            <div className="p-5 space-y-4">
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                className="w-full text-lg font-bold px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="偶遇小标题"
              />

              {/* 完整日志 */}
              <div>
                <p className="text-sm text-gray-500 mb-2">偶遇日志</p>
                <textarea
                  value={editingJournal}
                  onChange={(e) => setEditingJournal(e.target.value)}
                  className="w-full text-sm text-gray-700 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-24 resize-none"
                  placeholder="记录你的发现..."
                />
              </div>

              {/* 物种、地点、日期 */}
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span>🐾</span>
                  <input
                    type="text"
                    value={editingSpecies}
                    onChange={(e) => setEditingSpecies(e.target.value)}
                    className="flex-1 font-bold px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="动物种类"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <span>📍</span>
                    <span className="text-gray-600 text-sm">{editingLocation || '暂无地点'}</span>
                  </div>
                  <button
                    onClick={() => { setShowLocationPicker(true); setLocationSaveError(null) }}
                    className="text-xs px-2 py-1 rounded-full ml-2"
                    style={{ background: '#f0e8d8', color: '#7a5c3a' }}
                  >
                    {isSavingLocation ? '修改中...' : '修改'}
                  </button>
                </div>
                <div className="text-xs text-gray-400">{formatDate(expandedRecord.createdAt)}</div>

                {/* 保存错误提示 */}
                {detailSaveError && (
                  <p className="text-xs text-red-500">{detailSaveError}</p>
                )}

                {/* 保存按钮 */}
                <button
                  onClick={handleSaveDetail}
                  disabled={!editingSpecies.trim() || isSaving}
                  className="w-full py-2 rounded-xl font-bold text-white transition-opacity"
                  style={{
                    background: editingSpecies.trim() && !isSaving ? '#d4a574' : '#ccc',
                    cursor: editingSpecies.trim() && !isSaving ? 'pointer' : 'not-allowed',
                    opacity: editingSpecies.trim() && !isSaving ? 1 : 0.6,
                  }}
                >
                  {isSaving ? '保存中...' : '保存修改'}
                </button>
              </div>
            </div>
          </div>
        </div>
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
                                alert('即将上线，敬请期待！')
                                setExpandingMenuId(null)
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

      {/* 匿名模式提示 */}
      <p className="text-center text-xs text-gray-400 py-4">匿名模式，记录与本设备绑定</p>

      {/* 修改定位面板 */}
      {showLocationPicker && (
        <LocationPicker
          onConfirm={handleLocationConfirm}
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </div>
  )
}

export default ListPage
