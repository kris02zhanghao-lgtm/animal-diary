import { lazy, Suspense, useEffect, useState } from 'react'
import { ensureSession, getSessionErrorMessage } from './services/authService'
import ListPage from './pages/ListPage'
import BottomTabBar from './components/BottomTabBar'

const NewEncounterPage = lazy(() => import('./pages/NewEncounterPage'))
const CollectionPage = lazy(() => import('./pages/CollectionPage'))
const ReportPage = lazy(() => import('./pages/ReportPage'))
const MapView = lazy(() => import('./components/MapView'))
const PublicCollectionPage = lazy(() => import('./pages/PublicCollectionPage'))

function getSharedToken() {
  const match = window.location.pathname.match(/^\/shared\/([a-zA-Z0-9]+)$/)
  return match ? match[1] : null
}

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
  const [authAttempt, setAuthAttempt] = useState(0)
  const [expandTargetId, setExpandTargetId] = useState(null)

  const sharedToken = getSharedToken()

  useEffect(() => {
    if (sharedToken) return

    let ignore = false
    ensureSession()
      .then(() => {
        if (!ignore) setAuthReady(true)
      })
      .catch((error) => {
        if (!ignore) setAuthError(getSessionErrorMessage(error))
      })

    return () => {
      ignore = true
    }
  }, [sharedToken, authAttempt])

  const retrySession = () => {
    setAuthReady(false)
    setAuthError(null)
    setAuthAttempt(current => current + 1)
  }

  if (sharedToken) {
    return (
      <Suspense fallback={<PageFallback />}>
        <PublicCollectionPage token={sharedToken} />
      </Suspense>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[#fffdf7] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-red-500 text-sm">{authError}</p>
        <button
          type="button"
          onClick={retrySession}
          className="px-5 py-2.5 rounded-xl bg-[#6b8e4e] text-white text-sm font-semibold shadow-sm active:scale-95 transition-transform"
        >
          重新连接
        </button>
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
      <div className={activePage === 'timeline' ? 'block' : 'hidden'}>
        <ListPage initialExpandedId={expandTargetId} isActive={activePage === 'timeline'} />
      </div>
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
