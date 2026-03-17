import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Bell, Clock, CheckCircle2, XCircle, ChevronRight, User } from 'lucide-react'

export function UserDashboard() {
  const { user, profile } = useAuth()
  const [requests, setRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
      
      // Real-time subscription for notifications
      const channel = supabase
        .channel('user-updates')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications', 
          filter: `user_id=eq.${user.id}` 
        }, payload => {
          setNotifications(prev => [payload.new, ...prev])
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const { data: reqData, error: reqError } = await supabase
        .from('adoption_requests')
        .select(`
          *,
          goats (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const { data: notifData, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (reqError || notifError) throw reqError || notifError
      setRequests(reqData)
      setNotifications(notifData)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const markNotifRead = async (id) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24 bg-surface">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight">User Dashboard</h1>
            <p className="text-primary/60">Welcome back, <span className="text-primary font-semibold">{profile?.full_name || user?.email}</span></p>
          </div>
          <div className="flex gap-4">
            <button className="p-3 bg-white rounded-full border border-primary/5 shadow-sm hover:border-accent transition-colors relative">
              <Bell size={20} className="text-primary/60" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            <Link to="/profile" className="p-3 bg-white rounded-full border border-primary/5 shadow-sm hover:border-accent transition-colors">
              <User size={20} className="text-primary/60" />
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Applications', value: requests.length, icon: LayoutDashboard, color: 'bg-accent/10 border-accent/20' },
                { label: 'Messages', value: 0, icon: MessageSquare, color: 'bg-primary/5 border-primary/5' },
                { label: 'Notifications', value: notifications.length, icon: Bell, color: 'bg-primary/5 border-primary/5' }
              ].map((stat, i) => (
                <div key={i} className={`p-8 rounded-[2rem] border ${stat.color} flex flex-col items-center text-center`}>
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm">
                    <stat.icon size={24} className="text-primary/40" />
                  </div>
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary/40 leading-none">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Active Applications */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-primary tracking-tight">Recent Applications</h2>
                <Link to="/browse" className="text-accent-dark font-bold text-sm hover:underline">Browse Herd</Link>
              </div>

              {requests.length === 0 ? (
                <div className="bg-white p-12 rounded-[2.5rem] border border-primary/5 text-center">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <LayoutDashboard size={28} className="text-primary/20" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">No applications yet</h3>
                  <p className="text-primary/50 mb-8 max-w-sm mx-auto">Start your journey with us by applying for one of our heritage goats.</p>
                  <Link to="/browse" className="btn-primary inline-flex py-3 px-8 text-sm">Find Your Companion</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request, index) => (
                    <motion.div 
                      key={request.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white p-6 md:p-8 rounded-[2rem] border border-primary/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col md:flex-row md:items-center gap-6"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                        <img 
                          src={request.goats?.images?.[0] || 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80'} 
                          alt={request.goats?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-xl text-primary">{request.goats?.name}</h4>
                          <span className="text-primary/20">•</span>
                          <span className="text-xs font-bold uppercase tracking-widest text-primary/40">{request.goats?.breed}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary/40 text-sm">
                          <Clock size={14} /> Applied on {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30 mb-1 leading-none">Status</p>
                          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider ${
                            request.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/10' :
                            request.status === 'approved' ? 'bg-accent/20 text-primary-light border border-accent/20' :
                            'bg-red-500/10 text-red-500 border border-red-500/10'
                          }`}>
                            {request.status === 'pending' && <Clock size={12} />}
                            {request.status === 'approved' && <CheckCircle2 size={12} />}
                            {request.status === 'rejected' && <XCircle size={12} />}
                            {request.status}
                          </div>
                        </div>
                        <Link to={`/goat/${request.goats?.id}`} className="p-3 bg-primary/5 rounded-full text-primary/30 hover:bg-accent hover:text-primary transition-all">
                          <ChevronRight size={20} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-12">
            <section>
              <h3 className="text-xl font-bold text-primary mb-8 tracking-tight flex items-center gap-3">
                <Bell size={20} className="text-accent-dark" /> Recent Notifications
              </h3>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-primary/40 text-sm bg-white p-8 rounded-[2rem] border border-primary/5 text-center">No recent notifications</p>
                ) : (
                  notifications.map((notif, i) => (
                    <div 
                      key={notif.id} 
                      onClick={() => !notif.read && markNotifRead(notif.id)}
                      className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer ${notif.read ? 'border-primary/5 opacity-60' : 'border-accent/40 shadow-lg shadow-accent/10'}`}
                    >
                      <p className={`text-sm leading-relaxed mb-3 ${notif.read ? 'text-primary' : 'text-primary font-medium'}`}>
                        {notif.message}
                      </p>
                      <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="p-10 rounded-[2.5rem] bg-primary text-white overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-4 leading-tight">Need Support?</h4>
                <p className="text-white/60 mb-8 leading-relaxed">Have questions about your application? Our sanctuary team is here to help.</p>
                <Link to="/chat" className="btn-primary w-full justify-center">
                  Start Chat <MessageSquare size={18} />
                </Link>
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
