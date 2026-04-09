import { useState } from 'react'
import ListPage from './pages/ListPage'
import NewEncounterPage from './pages/NewEncounterPage'

function App() {
  const [currentPage, setCurrentPage] = useState('list')

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-[#fffdf7]">
      {currentPage === 'list' && <ListPage onNavigate={navigateTo} />}
      {currentPage === 'new' && <NewEncounterPage onNavigate={navigateTo} />}
    </div>
  )
}

export default App
