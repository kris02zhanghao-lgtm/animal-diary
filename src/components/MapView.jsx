import { useEffect, useRef, useState } from 'react'
import { getRecords } from '../services/supabaseService'
import { getEmojiForSpecies } from '../utils/animalEmojiMapper'

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY

function loadAmapScript() {
  return new Promise((resolve, reject) => {
    if (window.AMap) { resolve(); return }
    const existing = document.querySelector('script[data-amap]')
    if (existing) {
      existing.addEventListener('load', resolve)
      existing.addEventListener('error', reject)
      return
    }
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
    script.setAttribute('data-amap', '1')
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function normalizeRecord(r) {
  return {
    ...r,
    imageBase64: r.image_base64 ?? r.imageBase64,
    createdAt: r.created_at ?? r.createdAt,
  }
}

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function MapView() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [mapReady, setMapReady] = useState(false)
  const [records, setRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    getRecords()
      .then(data => setRecords(data.map(normalizeRecord)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    let destroyed = false
    loadAmapScript()
      .then(() => {
        if (destroyed || !containerRef.current) return
        const map = new window.AMap.Map(containerRef.current, {
          zoom: 12,
          resizeEnable: true,
        })
        mapRef.current = map
        setMapReady(true)
      })
      .catch(() => {})
    return () => {
      destroyed = true
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    const geoRecords = records.filter(r => r.latitude != null && r.longitude != null)

    geoRecords.forEach(record => {
      const emoji = getEmojiForSpecies(record.species)
      const marker = new window.AMap.Marker({
        position: [record.longitude, record.latitude],
        content: `<div style="font-size:26px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">${emoji}</div>`,
        offset: new window.AMap.Pixel(-22, -22),
      })
      marker.on('click', () => setSelectedRecord(record))
      marker.setMap(mapRef.current)
      markersRef.current.push(marker)
    })

    if (geoRecords.length > 0) {
      mapRef.current.setFitView()
    }
  }, [mapReady, records])

  const geoRecords = records.filter(r => r.latitude != null && r.longitude != null)
  const showNoGeoHint = records.length > 0 && geoRecords.length === 0
  const showEmptyHint = records.length === 0

  return (
    <div style={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
      {(showNoGeoHint || showEmptyHint) && !selectedRecord && (
        <div className="absolute top-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <div
            className="px-4 py-2 rounded-full text-sm"
            style={{
              background: 'rgb(247, 243, 223)',
              color: '#7a5c3a',
              boxShadow: '0 2px 8px rgba(107,92,67,0.3)',
            }}
          >
            {showEmptyHint
              ? '还没有偶遇记录，出门记录一条吧！'
              : '记录新偶遇时允许定位，即可在地图上看到它们 📍'}
          </div>
        </div>
      )}

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {selectedRecord && (
        <>
          <div
            className="absolute inset-0 z-20"
            onClick={() => setSelectedRecord(null)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 z-30 rounded-t-2xl"
            style={{
              background: 'rgb(247, 243, 223)',
              boxShadow: '0 -4px 16px rgba(107, 92, 67, 0.3)',
            }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getEmojiForSpecies(selectedRecord.species)}</span>
                  <span className="font-bold text-[#3d2b1a] text-base">{selectedRecord.species}</span>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-2xl text-gray-400 leading-none"
                  aria-label="关闭"
                >
                  ×
                </button>
              </div>

              {selectedRecord.imageBase64 && (
                <img
                  src={selectedRecord.imageBase64}
                  alt={selectedRecord.species}
                  className="w-full object-contain rounded-xl mb-3"
                  style={{ maxHeight: '128px', background: '#f5ede0' }}
                />
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <span>📍</span>
                  <span className="text-[#5a4a3a]">{selectedRecord.location}</span>
                </div>
                <div className="text-xs text-gray-400">{formatDate(selectedRecord.createdAt)}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MapView
