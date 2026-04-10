import { useState, useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import ListPage from './pages/ListPage'
import NewEncounterPage from './pages/NewEncounterPage'

function App() {
  const [currentPage, setCurrentPage] = useState('list')
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        supabase.auth.signInAnonymously().catch((err) => {
          console.error('Auth error:', err)
        })
      }
      setAuthLoading(false)
    })
  }, [])

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  if (authLoading) {
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
