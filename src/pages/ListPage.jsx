import { useState, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import { getRecords, deleteRecord } from '../services/storageService'

function ListPage({ onNavigate }) {
  const [records, setRecords] = useState(() => getRecords())
  const [confirmingId, setConfirmingId] = useState(null)

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

  const handleDelete = () => {
    deleteRecord(confirmingId)
    setRecords(getRecords())
    setConfirmingId(null)
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

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

      {records.length === 0 ? (
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
                      className="w-64 rounded-2xl overflow-hidden bg-white"
                      style={{ border: '3px solid #5a4a3a', boxShadow: '4px 4px 0px #5a4a3a' }}
                    >
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
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{formatDate(record.createdAt)}</span>
                          <button
                            onClick={() => setConfirmingId(record.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
                            aria-label="删除"
                          >
                            ×
                          </button>
                        </div>
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
