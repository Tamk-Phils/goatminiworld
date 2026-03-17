import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { FileText, CheckCircle2, XCircle, Clock, ExternalLink, ChevronDown, User, Mountain } from 'lucide-react'
import { Navigate, Link } from 'react-router-dom'

export function AdminApplications() {
  const { isAdmin } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    if (isAdmin) fetchApplications()
  }, [isAdmin])

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('adoption_requests')
        .select('*, goats(*)') // user profile is often null for guests
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setApplications(data)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, userId, status) => {
    // Optimistic Update
    const previousApps = [...applications];
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status } : app
    ));
    if (selectedApp?.id === id) {
      setSelectedApp({ ...selectedApp, status });
    }

    try {
      const { error } = await supabase
        .from('adoption_requests')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error

      // Create notification for user ONLY IF REGISTERED
      if (userId) {
        const notificationMessage = status === 'approved' 
          ? `Your adoption application status has been updated to: APPROVED! Please contact support via the internal chat or email us at support@minigoatworld.com to proceed with your heritage sponsorship and payment.`
          : `Your adoption application status has been updated to: ${status.toUpperCase()}`;

        await supabase.from('notifications').insert([
          {
            user_id: userId,
            message: notificationMessage,
          }
        ])
      }
    } catch (err) {
      setApplications(previousApps); // Rollback
      alert(err.message);
    }
  }

  if (!isAdmin) return <Navigate to="/" />

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight flex items-center gap-4">
            <FileText size={32} className="text-accent-dark" /> Adoption Reviews
          </h1>
          <p className="text-primary/60">Process and evaluate user and guest adoption sponsorship requests.</p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-primary/20">Loading applications...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-4">
              {applications.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-6 rounded-3xl border cursor-pointer transition-all ${
                    selectedApp?.id === app.id 
                    ? 'bg-white border-accent shadow-xl shadow-accent/10 border-2' 
                    : 'bg-white border-primary/5 hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      app.status === 'pending' ? 'bg-amber-500/10 text-amber-600' :
                      app.status === 'approved' ? 'bg-accent/20 text-primary-light' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {app.status}
                    </span>
                    <span className="text-[10px] font-bold text-primary/20 uppercase tracking-widest">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-primary mb-1 truncate">
                    {app.guest_name || 'Anonymous User'}
                  </h3>
                  <p className="text-xs text-primary/40 flex items-center gap-1">
                    Applying for <span className="text-primary font-bold">{app.goats?.name}</span>
                  </p>
                </div>
              ))}
              {applications.length === 0 && (
                <div className="p-12 text-center text-primary/20 bg-white rounded-3xl border border-primary/5">
                  No applications found.
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selectedApp ? (
                  <motion.div 
                    key={selectedApp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white rounded-[3rem] p-10 sm:p-16 border border-primary/5 shadow-sm sticky top-32"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-primary-light text-3xl font-bold">
                          {(selectedApp.guest_name || 'U').charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-primary tracking-tight">
                            {selectedApp.guest_name}
                            {selectedApp.user_id && <span className="ml-2 text-[10px] bg-primary/5 text-primary/40 px-2 py-0.5 rounded-full uppercase tracking-tighter">Registered</span>}
                          </h2>
                          <div className="flex flex-col sm:flex-row sm:gap-4">
                            <p className="text-primary/40 font-medium">{selectedApp.guest_email}</p>
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/goat/${selectedApp.goats?.id}`}
                        className="flex items-center gap-2 text-accent-dark font-bold text-sm hover:underline"
                      >
                        View {selectedApp.goats?.name} <ExternalLink size={14} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-12 py-10 border-y border-primary/5">
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Breed Interest</p>
                        <p className="text-lg font-bold text-primary">{selectedApp.goats?.breed}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Heritage Price</p>
                        <p className="text-lg font-bold text-primary">${selectedApp.goats?.price?.toLocaleString()}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Experience</p>
                        <p className="text-lg font-bold text-accent capitalize">{selectedApp.experience || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="space-y-10 mb-12">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/30 flex items-center gap-2">
                          <Mountain size={14} /> Motivation & Goals
                        </h4>
                        <div className="p-8 bg-primary/5 rounded-[2rem] text-primary/70 leading-relaxed text-sm">
                          {selectedApp.motivation || "No motivation provided."}
                        </div>
                      </div>

                      {selectedApp.message && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/30 flex items-center gap-2">
                            <Mountain size={14} /> Additional Notes
                          </h4>
                          <div className="p-8 bg-primary/5 rounded-[2rem] text-primary/70 leading-relaxed text-sm whitespace-pre-wrap">
                            {selectedApp.message}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => handleStatusChange(selectedApp.id, selectedApp.user_id, 'approved')}
                        disabled={selectedApp.status === 'approved'}
                        className="flex-1 btn-primary py-5 justify-center border-none disabled:bg-primary/20 disabled:text-primary/40 disabled:cursor-not-allowed group relative overflow-hidden"
                      >
                        <CheckCircle2 size={20} className="relative z-10" /> 
                        <span className="relative z-10">{selectedApp.status === 'approved' ? 'Application Approved' : 'Approve Application'}</span>
                      </button>
                      <button 
                         onClick={() => handleStatusChange(selectedApp.id, selectedApp.user_id, 'rejected')}
                         disabled={selectedApp.status === 'rejected'}
                        className="flex-1 py-5 px-8 rounded-full border-2 border-red-500/20 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <XCircle size={20} /> 
                        {selectedApp.status === 'rejected' ? 'Application Rejected' : 'Reject'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border border-primary/5 border-dashed">
                    <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                      <FileText size={32} className="text-primary/20" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">Select an application</h3>
                    <p className="text-primary/30 max-w-xs">Pick a review from the sidebar to see detailed farm information and user statements.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
