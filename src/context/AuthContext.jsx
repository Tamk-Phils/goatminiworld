import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        // Recognize both potential admin emails (Fixed Typo: minigoatworld)
        const isAdminEmail = ['support@minigoatworld.com', 'phils7872@gmail.com'].includes(authUser.email?.toLowerCase())
        
        const { data: newProfile } = await supabase
          .from('users')
          .upsert({
            id: userId,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || 'Admin',
            role: isAdminEmail ? 'admin' : 'user'
          })
          .select()
          .single()
        setProfile(newProfile)
      } else if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Profile Sync Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const isAdmin = profile?.role === 'admin' || (user?.email && ['support@minigoatworld.com', 'phils7872@gmail.com'].includes(user.email.toLowerCase()))

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => {
      setUser(null)
      setProfile(null)
      return supabase.auth.signOut()
    },
    user,
    profile,
    isAdmin,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
