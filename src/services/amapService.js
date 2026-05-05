const AMAP_KEY = import.meta.env.VITE_AMAP_KEY

let amapScriptPromise = null
let amapPluginsPromise = null

export function loadAmapScript() {
  if (window.AMap) return Promise.resolve()
  if (amapScriptPromise) return amapScriptPromise

  amapScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-amap]')
    if (existing) {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
    script.setAttribute('data-amap', '1')
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

  return amapScriptPromise
}

export function loadAmapPlugins() {
  if (amapPluginsPromise) return amapPluginsPromise

  amapPluginsPromise = loadAmapScript().then(() => new Promise((resolve) => {
    window.AMap.plugin(['AMap.Geocoder', 'AMap.PlaceSearch'], resolve)
  }))

  return amapPluginsPromise
}

export async function reverseGeocode(latitude, longitude) {
  await loadAmapPlugins()

  if (!window.AMap?.Geocoder) {
    return '已定位'
  }

  return new Promise((resolve) => {
    const geocoder = new window.AMap.Geocoder({ radius: 500 })
    geocoder.getAddress([longitude, latitude], (status, result) => {
      if (status !== 'complete' || !result.regeocode) {
        resolve('已定位')
        return
      }

      const addr = result.regeocode.addressComponent
      const district = addr.district || ''
      const street = addr.township || addr.street || ''
      resolve((district + street).trim() || result.regeocode.formattedAddress?.slice(0, 15) || '已定位')
    })
  })
}
