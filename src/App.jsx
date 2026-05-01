import { lazy, Suspense, useEffect, useState } from 'react'
import { ensureSession } from './services/authService'
import ListPage from './pages/ListPage'
import BottomTabBar from './components/BottomTabBar'

const NewEncounterPage = lazy(() => import('./pages/NewEncounterPage'))
const CollectionPage = lazy(() => import('./pages/CollectionPage'))
const ReportPage = lazy(() => import('./pages/ReportPage'))
const MapView = lazy(() => import('./components/MapView'))

function PageFallback() {
  return (
    <div className="min-h-screen bg-[#fffdf7] flex items-center justify-center">
      <p className="text-gray-400 text-sm">页面加载中...</p>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('timeline')
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [expandTargetId, setExpandTargetId] = useState(null)

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
    <div className="min-h-screen bg-[#fffdf7] overflow-x-hidden">
      {activePage === 'timeline' && <ListPage initialExpandedId={expandTargetId} />}
      <Suspense fallback={<PageFallback />}>
        {activePage === 'map' && (
          <MapView onExpandRecord={(record) => {
            setExpandTargetId(record.id)
            setActivePage('timeline')
          }} />
        )}
        {activePage === 'collection' && (
          <CollectionPage onExpandRecord={(recordId) => {
            setExpandTargetId(recordId)
            setActivePage('timeline')
          }} />
        )}
        {activePage === 'report' && <ReportPage />}
        {activePage === 'new' && (
          <NewEncounterPage onNavigate={() => setActivePage('timeline')} />
        )}
      </Suspense>
      {activePage !== 'new' && (
        <BottomTabBar active={activePage} onChange={setActivePage} />
      )}
    </div>
  )
}

export default App
