import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mountain, LogOut, User as UserIcon, LayoutDashboard, Menu, X, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'

import logo from '../assets/logo.png'

export function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isDarkPage = location.pathname === '/' || location.pathname === '/about' || location.pathname === '/sustainability'
  const navbarBg = isScrolled || !isDarkPage ? 'bg-primary/95 shadow-lg backdrop-blur-md px-6' : 'glass px-6'

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Herd', path: '/browse' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'FAQ', path: '/faq' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
      <div className={`max-w-7xl mx-auto flex items-center justify-between py-3 rounded-full transition-all duration-300 ${navbarBg}`}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src={logo} alt="MiniGoat Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white">MINIGOAT WORLD</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-accent ${location.pathname === link.path ? 'text-accent' : 'text-white/80'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to={isAdmin ? '/admin/chat' : '/chat'}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                title="Support"
              >
                <MessageSquare size={20} />
              </Link>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                title="Dashboard"
              >
                {isAdmin ? <LayoutDashboard size={20} /> : <UserIcon size={20} />}
              </Link>
              <button
                onClick={() => signOut()}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
                title="Sign Out"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block btn-primary py-2 px-6 text-sm">
              Contact Us <ArrowSmallRight />
            </Link>
          )}

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 glass-dark rounded-3xl p-6 flex flex-col gap-4 text-white"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium border-b border-white/10 pb-2"
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <Link 
              to="/auth" 
              onClick={() => setIsOpen(false)}
              className="btn-primary justify-center mt-2"
            >
              Contact Us
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  )
}

function ArrowSmallRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  )
}
