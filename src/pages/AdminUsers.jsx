import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { 
  Users, 
  Search, 
  Trash2, 
  UserPlus, 
  UserMinus, 
  MessageSquare,
  Mail,
  Calendar,
  Shield,
  User
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)
      
      if (error) throw error
      fetchUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure? This will delete the user profile. Note: Actual Auth account must be deleted via Supabase Dashboard for full removal.')) return
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
      
      if (error) throw error
      fetchUsers()
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">User Network</h1>
            <p className="text-primary/60 text-lg max-w-2xl leading-relaxed">
              Manage sanctuary users, assign administrative roles, and initiate direct support channels.
            </p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filter by name or email..."
              className="w-full bg-white border border-primary/10 rounded-2xl py-4 pl-12 pr-4 text-primary focus:outline-none focus:border-accent shadow-sm transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-primary/5" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-3xl p-6 border border-primary/5 shadow-xl shadow-primary/5 hover:border-accent/40 transition-all flex flex-col md:flex-row md:items-center gap-6"
              >
                {/* User Avatar & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner ${
                    user.role === 'admin' ? 'bg-primary text-accent' : 'bg-primary/5 text-primary'
                  }`}>
                    {user.full_name?.charAt(0) || <User size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                      {user.full_name || 'Anonymous User'}
                      {user.role === 'admin' && (
                        <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent-dark text-[10px] font-bold uppercase tracking-widest">Admin</span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-primary/40">
                      <span className="flex items-center gap-1.5"><Mail size={14} /> {user.email}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 md:border-l border-primary/5 pt-4 md:pt-0 md:pl-6">
                  <button 
                    onClick={() => navigate('/admin/chat', { state: { startChatWith: user.id } })}
                    className="p-3 bg-white border border-primary/10 rounded-xl text-primary/40 hover:text-accent hover:border-accent transition-all group/btn flex items-center gap-2"
                    title="Start Chat"
                  >
                    <MessageSquare size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest md:hidden lg:block">Chat</span>
                  </button>

                  <div className="h-8 w-px bg-primary/5 mx-1 hidden md:block" />

                  {user.role === 'admin' ? (
                    <button 
                      onClick={() => handleUpdateRole(user.id, 'user')}
                      className="p-3 bg-white border border-primary/10 rounded-xl text-primary/40 hover:text-orange-500 hover:border-orange-500 transition-all flex items-center gap-2"
                      title="Demote to User"
                    >
                      <UserMinus size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest md:hidden lg:block">Demote</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUpdateRole(user.id, 'admin')}
                      className="p-3 bg-white border border-primary/10 rounded-xl text-primary/40 hover:text-accent hover:border-accent transition-all flex items-center gap-2"
                      title="Promote to Admin"
                    >
                      <UserPlus size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest md:hidden lg:block">Promote</span>
                    </button>
                  )}

                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-3 bg-white border border-primary/10 rounded-xl text-primary/40 hover:text-red-500 hover:border-red-500 transition-all flex items-center gap-2"
                    title="Delete Account Row"
                  >
                    <Trash2 size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest md:hidden lg:block">Delete</span>
                  </button>
                </div>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-primary/10">
                <Users size={48} className="text-primary/10 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary/40">No users found</h3>
                <p className="text-primary/20">Expand your search or clear filters to see all sanctuary users.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
