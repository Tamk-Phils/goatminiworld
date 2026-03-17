import { Navbar } from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './pages/Home'
import { Auth } from './pages/Auth'
import { Browse } from './pages/Browse'
import { GoatDetails } from './pages/GoatDetails'
import { Apply } from './pages/Apply'
import { UserDashboard } from './pages/UserDashboard'
import { UserChat } from './pages/UserChat'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminInventory } from './pages/AdminInventory'
import { AdminApplications } from './pages/AdminApplications'
import { AdminChat } from './pages/AdminChat'
import { AdminUsers } from './pages/AdminUsers'
import { AdminLayout } from './components/AdminLayout'
import { About } from './pages/About'
import { Sustainability } from './pages/Sustainability'
import { FAQ } from './pages/FAQ'
import { Gallery } from './pages/Gallery'
import { AuthProvider } from './context/AuthContext'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  return (
    <AuthProvider>
      <div className="min-h-screen bg-surface selection:bg-accent selection:text-primary">
        {!isAdminPath && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/goat/:id" element={<GoatDetails />} />
            <Route path="/apply/:id" element={<Apply />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <UserChat />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="applications" element={<AdminApplications />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="chat" element={<AdminChat />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="/about" element={<About />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
        {!isAdminPath && <Footer />}
      </div>
    </AuthProvider>
  )
}

export default App
