import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Users, FileText, MessageSquare, TrendingUp, AlertCircle, ChevronRight, Mountain } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

import logo from '../assets/logo.png'

export function AdminDashboard() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState({
    totalGoats: 0,
    pendingApps: 0,
    totalUsers: 0,
    unreadMessages: 0
  })
  const [recentApps, setRecentApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats()
    }
  }, [isAdmin])

  const fetchAdminStats = async () => {
    try {
      const [
        { count: goatCount },
        { count: appCount },
        { count: userCount },
        { count: msgCount },
        { data: apps }
      ] = await Promise.all([
        supabase.from('goats').select('*', { count: 'exact', head: true }),
        supabase.from('adoption_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('adoption_requests').select('*, users(*), goats(*)').order('created_at', { ascending: false }).limit(5)
      ])

      setStats({
        totalGoats: goatCount || 0,
        pendingApps: appCount || 0,
        totalUsers: userCount || 0,
        unreadMessages: msgCount || 0
      })
      setRecentApps(apps || [])
    } catch (err) {
      console.error('Error fetching admin stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) return <Navigate to="/" />
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-surface">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const statCards = [
    { label: 'Total Herd', value: stats.totalGoats, image: logo, color: 'text-primary' },
    { label: 'Pending Applications', value: stats.pendingApps, icon: FileText, color: 'text-amber-600' },
    { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: 'text-primary' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageSquare, color: 'text-accent-dark' }
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">Admin Command Center</h1>
            <p className="text-primary/60">Sanctuary Operations Overview</p>
          </div>
          <div className="flex gap-4">
            <Link to="/admin/inventory" className="btn-primary py-3 px-6 text-sm">Manage Herd</Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-primary/5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden p-1.5">
                  {stat.image ? (
                    <img src={stat.image} alt={stat.label} className="w-full h-full object-contain" />
                  ) : (
                    <stat.icon size={20} className={stat.color} />
                  )}
                </div>
                <TrendingUp size={16} className="text-accent" />
              </div>
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-primary/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Applications */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-primary tracking-tight">Pending Reviews</h2>
                <Link to="/admin/applications" className="text-accent-dark font-bold text-sm hover:underline">View All</Link>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-primary/5 overflow-hidden shadow-sm">
                {recentApps.length === 0 ? (
                  <div className="p-12 text-center text-primary/30">No pending applications</div>
                ) : (
                  <div className="divide-y divide-primary/5">
                    {recentApps.map((app) => (
                      <div key={app.id} className="p-8 hover:bg-primary/5 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-primary font-bold">
                            {app.users?.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary">{app.users?.full_name || 'Anonymous User'}</h4>
                            <p className="text-xs text-primary/40 uppercase tracking-widest mt-1">Applying for <span className="text-primary font-bold">{app.goats?.name}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/5 text-primary/40'
                          }`}>
                            {app.status}
                          </span>
                          <Link to="/admin/applications" className="p-2 text-primary/20 hover:text-accent transition-colors">
                            <ChevronRight size={20} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-12">
            <section>
              <h3 className="text-xl font-bold text-primary mb-8 tracking-tight flex items-center gap-3">
                <AlertCircle size={20} className="text-red-500" /> System Alerts
              </h3>
              <div className="space-y-4">
                <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10">
                  <p className="text-sm text-red-600 font-medium leading-relaxed">
                    Storage space is at 85%. Consider clearing old breed logs.
                  </p>
                </div>
                <div className="p-6 bg-accent/5 rounded-3xl border border-accent/10">
                  <p className="text-sm text-primary-light font-medium leading-relaxed">
                    New message from 3 users awaiting response.
                  </p>
                </div>
              </div>
            </section>

            <div className="p-10 rounded-[2.5rem] bg-primary text-white overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-4 leading-tight">Admin Support</h4>
                <p className="text-white/60 mb-8 leading-relaxed">Direct access to technical sanctuary maintenance.</p>
                <button className="btn-primary w-full justify-center">
                  Open Chat Hub
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <MessageSquare size={160} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
