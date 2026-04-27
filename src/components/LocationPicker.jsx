import { useState, useRef, useEffect } from 'react'

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

function loadAmapPlugins() {
  return new Promise((resolve) => {
    window.AMap.plugin(['AMap.Geocoder', 'AMap.PlaceSearch'], resolve)
  })
}

function LocationPicker({ onConfirm, onClose }) {
  const [activeTab, setActiveTab] = useState('gps')
  const [gpsStatus, setGpsStatus] = useState('idle')
  const [pendingLocation, setPendingLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [amapReady, setAmapReady] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    loadAmapScript()
      .then(loadAmapPlugins)
      .then(() => setAmapReady(true))
      .catch(() => {})
  }, [])

  const handleGpsLocate = () => {
    if (!navigator.geolocation) {
      setGpsStatus('unavailable')
      return
    }
    setGpsStatus('loading')
    setPendingLocation(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        if (!amapReady || !window.AMap?.Geocoder) {
          setPendingLocation({ location: '已定位', latitude, longitude })
          setGpsStatus('success')
          return
        }
        const geocoder = new window.AMap.Geocoder({ radius: 500 })
        geocoder.getAddress([longitude, latitude], (status, result) => {
          let locationText = '已定位'
          if (status === 'complete' && result.regeocode) {
            const addr = result.regeocode.addressComponent
            const district = addr.district || ''
            const street = addr.township || addr.street || ''
            locationText = (district + street).trim() || result.regeocode.formattedAddress?.slice(0, 15) || '已定位'
          }
          setPendingLocation({ location: locationText, latitude, longitude })
          setGpsStatus('success')
        })
      },
      (err) => {
        setGpsStatus(err.code === 1 ? 'denied' : 'unavailable')
      },
      { timeout: 10000 }
    )
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim()) { setSearchResults([]); return }

    debounceRef.current = setTimeout(() => {
      if (!amapReady || !window.AMap?.PlaceSearch) return
      setIsSearching(true)
      const placeSearch = new window.AMap.PlaceSearch({ pageSize: 5 })
      placeSearch.search(value, (status, result) => {
        setIsSearching(false)
        if (status === 'complete' && result.poiList?.pois?.length > 0) {
          setSearchResults(result.poiList.pois.slice(0, 5))
        } else {
          setSearchResults([])
        }
      })
    }, 300)
  }

  const handleSelectPoi = (poi) => {
    const lng = poi.location?.lng
    const lat = poi.location?.lat
    setPendingLocation({ location: poi.name, latitude: lat, longitude: lng })
    setSearchResults([])
    setSearchQuery(poi.name)
  }

  const handleConfirm = () => {
    if (pendingLocation) onConfirm(pendingLocation)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[110]"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-[120] rounded-t-2xl"
        style={{ background: '#fffdf7', maxHeight: '75vh', overflowY: 'auto' }}
      >
        <div className="flex justify-between items-center px-5 pt-5 pb-2">
          <h3 className="font-bold text-base" style={{ color: '#3d2b1a' }}>修改定位</h3>
          <button onClick={onClose} className="text-2xl text-gray-400 leading-none">×</button>
        </div>

        <div className="flex mx-4 mb-4 rounded-xl overflow-hidden" style={{ background: '#f0e8d8' }}>
          {[
            { id: 'gps', label: '📍 自动定位' },
            { id: 'search', label: '🔍 搜索地点' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPendingLocation(null) }}
              className="flex-1 py-2 text-sm font-medium transition-colors"
              style={{
                background: activeTab === tab.id ? '#7cb342' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#7a5c3a',
                borderRadius: '10px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-8">
          {activeTab === 'gps' ? (
            <div className="space-y-3">
              <button
                onClick={handleGpsLocate}
                disabled={gpsStatus === 'loading'}
                className="w-full py-3 rounded-xl font-medium text-white text-sm"
                style={{ background: gpsStatus === 'loading' ? '#bbb' : '#7cb342' }}
              >
                {gpsStatus === 'loading' ? '定位中...' : '📍 一键定位'}
              </button>
              {gpsStatus === 'success' && pendingLocation && (
                <p className="text-sm text-center" style={{ color: '#7cb342' }}>
                  ✓ {pendingLocation.location}
                </p>
              )}
              {gpsStatus === 'denied' && (
                <p className="text-sm text-center text-red-500">
                  位置权限已拒绝，请在系统设置中开启定位权限后重试
                </p>
              )}
              {gpsStatus === 'unavailable' && (
                <p className="text-sm text-center text-gray-400">
                  定位暂不可用，可切换到「搜索地点」手动选择
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="输入地点关键词，如「中山公园」"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: '#f0e8d8', color: '#3d2b1a', border: '1px solid #e0d0b8' }}
                autoFocus
              />
              {isSearching && (
                <p className="text-xs text-center text-gray-400">搜索中...</p>
              )}
              {searchResults.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e0d0b8' }}>
                  {searchResults.map((poi, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectPoi(poi)}
                      className="w-full text-left px-4 py-3 text-sm"
                      style={{
                        background: pendingLocation?.location === poi.name ? '#f0e8d8' : '#fffdf7',
                        borderBottom: i < searchResults.length - 1 ? '1px solid #f0e8d8' : 'none',
                        color: '#3d2b1a',
                      }}
                    >
                      <div className="font-medium">{poi.name}</div>
                      {poi.address && (
                        <div className="text-xs text-gray-400 mt-0.5 truncate">{poi.address}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {searchQuery.trim() && !isSearching && searchResults.length === 0 && (
                <p className="text-xs text-center text-gray-400">未找到相关地点，请尝试其他关键词</p>
              )}
              {pendingLocation && activeTab === 'search' && (
                <p className="text-sm text-center" style={{ color: '#7cb342' }}>
                  ✓ 已选择：{pendingLocation.location}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!pendingLocation}
            className="w-full mt-5 py-3 rounded-xl font-bold text-white text-sm"
            style={{
              background: pendingLocation ? '#7cb342' : '#ccc',
              boxShadow: pendingLocation ? '0 4px 12px rgba(124,179,66,0.4)' : 'none',
            }}
          >
            确认位置
          </button>
        </div>
      </div>
    </>
  )
}

export default LocationPicker
