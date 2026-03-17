import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Mountain, 
  Users, 
  FileText, 
  MessageSquare, 
  LogOut, 
  X, 
  Menu,
  Home,
  Database
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

import logo from '../assets/logo.png'

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { signOut } = useAuth()

  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/inventory', label: 'Inventory', icon: Database },
    { to: '/admin/applications', label: 'Applications', icon: FileText },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/chat', label: 'Support Chat', icon: MessageSquare },
  ]

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-[60] p-3 bg-primary text-accent rounded-2xl shadow-lg lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed inset-y-0 left-0 z-50 w-72 bg-primary text-white flex flex-col p-8 lg:translate-x-0 ${
              isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            {/* Logo */}
            <div className="flex items-center gap-4 mb-16">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={logo} alt="MiniGoat Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">MiniGoat World</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-dark opacity-80">Command Center</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {links.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <Link 
                    key={link.to} 
                    to={link.to}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                      isActive 
                      ? 'bg-accent text-primary font-bold shadow-lg shadow-accent/10' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon size={20} className={isActive ? 'text-primary' : 'text-white/40 group-hover:text-accent transition-colors'} />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto pt-8 border-t border-white/10 space-y-2">
              <Link 
                to="/"
                className="flex items-center gap-4 px-6 py-4 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <Home size={20} />
                <span className="text-sm font-medium">Back to Website</span>
              </Link>
              <button 
                onClick={signOut}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all w-full text-left"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  )
}
