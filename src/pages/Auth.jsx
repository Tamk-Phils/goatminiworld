import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Mountain } from 'lucide-react'

import logo from '../assets/logo.png'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn({ email, password })
        if (error) throw error
      } else {
        const { data, error } = await signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        })
        
        if (error) throw error
        
        // If Supabase is configured with confirm_email: false, 
        // it will return a session immediately.
        // We can check if a session exists to confirm they are logged in.
        if (data.session) {
          console.log('Signup successful, session created.')
        } else {
          // Fallback if email verification is somehow still on in backend
          alert('Account created! If you cannot log in, please check your email for a confirmation link.')
        }
      }
      navigate('/')
    } catch (err) {
      console.error('Auth Error:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 bg-primary z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532509854226-a2d9d8e66305?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark w-full max-w-md p-10 rounded-[2.5rem] relative z-10 border border-white/10"
      >
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <img src={logo} alt="MiniGoat Logo" className="w-full h-full object-contain" />
          </Link>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join the Herd'}
          </h2>
          <p className="text-white/50 mt-2 text-center">
            {isLogin ? 'Enter your details to access your sanctuary.' : 'Start your journey as a member of our sanctuary.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/20"
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/20"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-all placeholder:text-white/20"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full justify-center py-4 mt-4"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/50 hover:text-accent transition-colors text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
