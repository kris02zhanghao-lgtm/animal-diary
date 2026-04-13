import { useState, useEffect } from 'react'
import { ensureSession } from './services/authService'
import ListPage from './pages/ListPage'
import NewEncounterPage from './pages/NewEncounterPage'

function App() {
  const [currentPage, setCurrentPage] = useState('list')
  const [authReady, setAuthReady] = useState(false)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    ensureSession()
      .then(() => setAuthReady(true))
      .catch(() => setAuthError('无法建立会话，请刷新重试'))
  }, [])

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

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
      {currentPage === 'list' && <ListPage onNavigate={navigateTo} />}
      {currentPage === 'new' && <NewEncounterPage onNavigate={navigateTo} />}
    </div>
  )
}

export default App
