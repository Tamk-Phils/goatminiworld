import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Trash2, AlertTriangle, ShieldAlert, Database, CheckCircle2, Clock } from 'lucide-react'

export function AdminMaintenance() {
  const [stats, setStats] = useState({
    rejectedApps: 0,
    readNotifications: 0,
    oldMessages: 0
  })
  const [loading, setLoading] = useState(true)
  const [purging, setPurging] = useState(null)

  useEffect(() => {
    fetchStats()
    autoPurge()
  }, [])

  const autoPurge = async () => {
    // Silently purge very old records (90+ days) to keep within free tier
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    
    try {
      await supabase.from('notifications').delete().lt('created_at', ninetyDaysAgo.toISOString())
      await supabase.from('messages').delete().lt('created_at', ninetyDaysAgo.toISOString())
      // We don't auto-purge applications as they are more important
    } catch (e) {
      console.error('Auto-purge failed', e)
    }
  }

  const fetchStats = async () => {
    setLoading(true)
    try {
      const { count: rejected } = await supabase
        .from('adoption_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected')

      const { count: readNotifs } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', true)

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { count: oldMsgs } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', thirtyDaysAgo.toISOString())

      setStats({
        rejectedApps: rejected || 0,
        readNotifications: readNotifs || 0,
        oldMessages: oldMsgs || 0
      })
    } finally {
      setLoading(false)
    }
  }

  const purge = async (type) => {
    if (!confirm(`Are you sure you want to permanently delete these ${type}? This action cannot be undone.`)) return
    
    setPurging(type)
    try {
      let error
      if (type === 'rejected applications') {
        const { error: err } = await supabase.from('adoption_requests').delete().eq('status', 'rejected')
        error = err
      } else if (type === 'read notifications') {
        const { error: err } = await supabase.from('notifications').delete().eq('is_read', true)
        error = err
      } else if (type === 'old messages') {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const { error: err } = await supabase.from('messages').delete().lt('created_at', thirtyDaysAgo.toISOString())
        error = err
      }

      if (error) throw error
      await fetchStats()
      alert(`Successfully purged ${type}!`)
    } catch (err) {
      alert(err.message)
    } finally {
      setPurging(null)
    }
  }

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight flex items-center gap-4">
          <Database size={32} className="text-accent-dark" /> System Maintenance
        </h1>
        <p className="text-primary/60">Manage database health and optimize storage capacity.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Storage Gauge */}
        <div className="md:col-span-3 bg-red-50 border border-red-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-24 h-24 rounded-full border-8 border-red-100 border-t-red-500 flex items-center justify-center relative">
            <span className="text-xl font-black text-red-600">85%</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-red-800 mb-2 flex items-center justify-center md:justify-start gap-2">
              <ShieldAlert size={24} /> Critical Storage Warning
            </h3>
            <p className="text-red-700/70 text-sm max-w-xl">
              Database storage is nearing capacity limits. Frequent maintenance is required to prevent write failures and ensure system stability.
            </p>
          </div>
          <button 
            onClick={fetchStats}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <Clock size={18} /> Refresh Audit
          </button>
        </div>

        {/* Maintenance Cards */}
        <MaintenanceCard 
          title="Rejected Applications"
          count={stats.rejectedApps}
          description="Clear all rejected sponsorship requests to free up database rows."
          onPurge={() => purge('rejected applications')}
          isPurging={purging === 'rejected applications'}
          loading={loading}
        />
        <MaintenanceCard 
          title="Read Notifications"
          count={stats.readNotifications}
          description="Remove all system notifications that have already been read."
          onPurge={() => purge('read notifications')}
          isPurging={purging === 'read notifications'}
          loading={loading}
        />
        <MaintenanceCard 
          title="Old Breed Logs"
          count={stats.oldMessages}
          description="Purge chat messages and breed logs older than 30 days."
          onPurge={() => purge('old messages')}
          isPurging={purging === 'old messages'}
          loading={loading}
        />
      </div>
    </div>
  )
}

function MaintenanceCard({ title, count, description, onPurge, isPurging, loading }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] border border-primary/5 shadow-sm flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="p-3 bg-primary/5 rounded-2xl text-primary">
          <Database size={24} />
        </div>
        <span className="text-2xl font-black text-primary/10 tracking-tighter">{loading ? '...' : count}</span>
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-primary/40 text-sm mb-8 flex-1 leading-relaxed">{description}</p>
      <button 
        onClick={onPurge}
        disabled={count === 0 || isPurging}
        className="w-full py-4 rounded-2xl border-2 border-red-500/20 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
      >
        {isPurging ? 'Purging...' : (
          <>
            <Trash2 size={18} /> Purge Records
          </>
        )}
      </button>
    </motion.div>
  )
}
