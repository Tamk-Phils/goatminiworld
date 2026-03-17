import { Navbar } from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
// ... rest of imports unchanged

function App() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <div className="min-h-screen bg-surface selection:bg-accent selection:text-primary">
        {!isAdminPath && <Navbar />}
        <main>
          <Routes>
            {/* ... routes unchanged */}
          </Routes>
        </main>
        {!isAdminPath && <Footer />}
      </div>
    </AuthProvider>
  )
}

export default App
