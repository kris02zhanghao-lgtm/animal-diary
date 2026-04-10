import { useState, useMemo, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import { getRecords, deleteRecord } from '../services/supabaseService'

function ListPage({ onNavigate }) {
  const [records, setRecords] = useState([])
  const [confirmingId, setConfirmingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [expandingMenuId, setExpandingMenuId] = useState(null)
  const [loadError, setLoadError] = useState(null)
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
    <div className="min-h-screen bg-[#fffdf7] px-4 py-6">
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      {/* 页面标题 */}
      <h1
        className="text-center text-xl mt-4 mb-6"
        style={{ fontFamily: "'Press Start 2P', cursive" }}
      >
        我的动物图鉴
      </h1>

      {/* Tab 占位 UI */}
      <div className="flex gap-6 justify-center mb-8">
        <button className="pb-2 font-bold text-[#3d2b1a]" style={{ borderBottom: '3px solid #7cb342' }}>
          时间线
        </button>
        <button className="pb-2 text-gray-500" onClick={() => {}}>
          图鉴
        </button>
      </div>

      {loadError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{loadError}</p>
        </div>
      )}

      {/* 展开态详情视图 - 全屏显示，列表隐藏 */}
      {expandedId !== null ? (
        <div className="mb-24 max-w-2xl mx-auto">
          {/* 详情视图顶部：返回按钮 + 菜单 */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setExpandedId(null)}
              className="text-2xl text-gray-700 hover:text-gray-900"
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
                  className="absolute right-0 top-8 bg-white rounded-lg shadow-lg z-20"
                  style={{ border: '2px solid #5a4a3a', minWidth: '120px' }}
                >
                  <button
                    onClick={() => {
                      alert('即将上线，敬请期待！')
                      setExpandingMenuId(null)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-md"
                  >
                    分享
                  </button>
                  <button
                    onClick={() => {
                      setConfirmingId(expandedRecord.id)
                      setExpandingMenuId(null)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-md"
                  >
                    删除
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 详情卡片 */}
          <div
            className="rounded-2xl overflow-hidden bg-white"
            style={{ border: '3px solid #5a4a3a', boxShadow: '4px 4px 0px #5a4a3a' }}
          >
            {/* 大图 */}
            <img
              src={expandedRecord.imageBase64}
              alt={expandedRecord.species}
              className="w-full max-h-96 object-contain bg-gray-100"
            />

            {/* 完整日志 */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">偶遇日志</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {expandedRecord.journal}
                </p>
              </div>

              {/* 物种、地点、日期 */}
              <div className="pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span>🐾</span>
                  <span className="font-bold text-gray-800">{expandedRecord.species}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="text-gray-600">{expandedRecord.location}</span>
                </div>
                <div className="text-xs text-gray-400">{formatDate(expandedRecord.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>
      ) : records.length === 0 ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="text-6xl mb-6">🐿️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">还没有偶遇记录</h2>
          <p className="text-gray-500 text-base text-center leading-relaxed">
            出门遇见小动物拍一张吧～<br />让你的城市日志热闹起来！
          </p>
        </div>
      ) : (
        /* 分组列表 */
        <div className="space-y-12 pb-24">
          {groupedRecords.map((group) => (
            <div key={group.seasonKey}>
              {/* 分组标题 */}
              <h2 className="text-lg font-bold text-[#3d2b1a] mb-4">{group.label}</h2>

              {/* Swiper 轮播 */}
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
              >
                {group.items.map((record) => (
                  <SwiperSlide
                    key={record.id}
                    style={{ width: '260px' }}
                    className="flex justify-center"
                  >
                    <div
                      className="w-64 rounded-2xl overflow-hidden bg-white relative"
                      style={{ border: '3px solid #5a4a3a', boxShadow: '4px 4px 0px #5a4a3a' }}
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
                            className="absolute right-0 top-10 bg-white rounded-lg shadow-lg z-20"
                            style={{ border: '2px solid #5a4a3a', minWidth: '100px' }}
                          >
                            <button
                              onClick={() => {
                                setExpandedId(record.id)
                                setExpandingMenuId(null)
                              }}
                              className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 first:rounded-t-md"
                            >
                              展开
                            </button>
                            <button
                              onClick={() => {
                                alert('即将上线，敬请期待！')
                                setExpandingMenuId(null)
                              }}
                              className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-100"
                            >
                              分享
                            </button>
                            <button
                              onClick={() => {
                                setConfirmingId(record.id)
                                setExpandingMenuId(null)
                              }}
                              className="block w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 last:rounded-b-md"
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

      {/* 浮动添加按钮 */}
      <button
        onClick={() => onNavigate('new')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#7cb342] text-white text-2xl shadow-lg flex items-center justify-center hover:bg-[#6a9e38] transition-colors"
        aria-label="添加新记录"
      >
        +
      </button>
    </div>
  )
}

export default ListPage
