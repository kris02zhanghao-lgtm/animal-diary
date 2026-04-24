import { useState, useEffect } from 'react'
import { ensureSession } from './services/authService'
import ListPage from './pages/ListPage'
import NewEncounterPage from './pages/NewEncounterPage'
import MapView from './components/MapView'
import BottomTabBar from './components/BottomTabBar'

function App() {
  const [activePage, setActivePage] = useState('timeline')
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    ensureSession()
      .then(() => setAuthReady(true))
      .catch(() => setAuthError('无法建立会话，请刷新重试'))
  }, [])

  if (authError) {
    return (
      <div className="min-h-screen bg-[#fffdf7] flex items-center justify-center">
        <p className="text-red-500 text-sm">{authError}</p>
      </div>
    )
  }

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#fffdf7] flex items-center justify-center">
        <p className="text-gray-400 text-sm">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {activePage === 'timeline' && <ListPage />}
      {activePage === 'map' && <MapView />}
      {activePage === 'new' && (
        <NewEncounterPage onNavigate={() => setActivePage('timeline')} />
      )}
      {activePage !== 'new' && (
        <BottomTabBar active={activePage} onChange={setActivePage} />
      )}
    </div>
  )
}

export default App
