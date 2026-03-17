import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Send, Search, Users, MessageSquare, Mountain, ArrowLeft, Mail } from 'lucide-react'
import { Navigate, useNavigate, Link, useLocation } from 'react-router-dom'

export function AdminChat() {
  const { user, isAdmin } = useAuth()
  const location = useLocation()
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) {
      if (location.state?.startChatWith) {
        initiateChat(location.state.startChatWith)
      } else {
        fetchConversations()
      }
      
      const channel = supabase
        .channel('admin-chat-hub')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}` 
        }, payload => {
          fetchConversations() // Refresh list on new message
          if (selectedUser?.id === payload.new.sender_id) {
            setMessages(prev => [...prev, payload.new])
          }
        })
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [isAdmin, selectedUser])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  const [searchTerm, setSearchTerm] = useState('')

  const initiateChat = async (userId) => {
    setLoading(true)
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      
      setSelectedUser(userData)
      fetchMessages(userId)
      // Also fetch conversation list so the user shows up there
      fetchConversations()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchConversations = async (search = '') => {
    setLoading(true)
    try {
      if (search) {
        // If searching, find any user by name or email
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .neq('role', 'admin')
          .or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
          .limit(20)
        if (error) throw error
        setConversations(userData || [])
      } else {
        // Default: Get unique users who have sent messages to me OR I have sent messages to
        const { data: sentMessages } = await supabase.from('messages').select('receiver_id').eq('sender_id', user.id)
        const { data: recMessages } = await supabase.from('messages').select('sender_id').eq('receiver_id', user.id)
        
        const userIds = [...new Set([
          ...(sentMessages?.map(m => m.receiver_id) || []),
          ...(recMessages?.map(m => m.sender_id) || [])
        ])]

        if (userIds.length > 0) {
          const { data: userData } = await supabase.from('users').select('*').in('id', userIds)
          setConversations(userData || [])
        } else {
          setConversations([])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
      
      setMessages(data || [])
      
      // Mark as read
      await supabase.from('messages').update({ is_read: true }).eq('sender_id', userId).eq('receiver_id', user.id)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || !selectedUser) return

    const newMessage = {
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content: input,
      is_read: false
    }

    setMessages(prev => [...prev, { ...newMessage, created_at: new Date().toISOString(), id: Math.random() }])
    setInput('')

    try {
      const { error } = await supabase.from('messages').insert([newMessage])
      if (error) throw error
    } catch (err) {
      console.error(err)
    }
  }

  if (!isAdmin) return <Navigate to="/" />

  return (
    <div className="min-h-screen pt-32 pb-12 bg-surface flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-6 flex flex-col flex-1">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-3 bg-white rounded-full border border-primary/5 text-primary/40 hover:text-primary transition-all">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-4xl font-bold text-primary tracking-tight">Chat Operations</h1>
          </div>
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-accent shadow-lg shadow-primary/10">
            <Mountain size={28} />
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12 h-[calc(100vh-320px)] min-h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1 space-y-6 flex flex-col h-full overflow-hidden">
            <div className="relative group flex-shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                className="w-full bg-white border border-primary/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  fetchConversations(e.target.value)
                }}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {conversations.map((u) => (
                <div 
                  key={u.id}
                  onClick={() => { setSelectedUser(u); fetchMessages(u.id); }}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-center gap-4 ${
                    selectedUser?.id === u.id ? 'bg-primary text-white border-primary shadow-xl shadow-primary/10' : 'bg-white border-primary/5 hover:border-accent/40'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold ${selectedUser?.id === u.id ? 'bg-white text-primary' : 'bg-primary/5 text-primary'}`}>
                    {u.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold truncate">{u.full_name || 'Anonymous User'}</h4>
                    <p className={`text-[10px] uppercase tracking-widest truncate ${selectedUser?.id === u.id ? 'text-white/40' : 'text-primary/30'}`}>
                      {u.email}
                    </p>
                  </div>
                </div>
              ))}
              {conversations.length === 0 && !loading && (
                <div className="py-20 text-center text-primary/20">No active conversations</div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-[3rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden h-full">
            <AnimatePresence mode="wait">
              {selectedUser ? (
                <motion.div 
                  key={selectedUser.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  <header className="p-8 border-b border-primary/5 flex items-center justify-between bg-primary text-white flex-shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center font-bold flex-shrink-0">
                        {selectedUser.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-none mb-1">{selectedUser.full_name || 'Anonymous User'}</h3>
                        <div className="flex items-center gap-2 text-white/40">
                          <Mail size={12} />
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{selectedUser.email}</p>
                        </div>
                      </div>
                    </div>
                    <Link to="/admin/users" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <Users size={20} />
                    </Link>
                  </header>

                  <div className="flex-1 overflow-y-auto p-8 space-y-4">
                    {messages.map((msg, i) => (
                      <div 
                        key={msg.id}
                        className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-5 rounded-[2rem] text-sm leading-relaxed ${
                          msg.sender_id === user.id 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-surface-dark border border-black/5 text-primary rounded-tl-none'
                        }`}>
                          {msg.content}
                          <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest opacity-30 ${msg.sender_id === user.id ? 'text-white' : 'text-primary'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>

                  <form onSubmit={handleSend} className="p-6 bg-surface-dark/20 border-t border-primary/5 flex-shrink-0">
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Type response..."
                        className="flex-1 bg-white border border-primary/10 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:border-accent shadow-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <button 
                        type="submit"
                        disabled={!input.trim()}
                        className="w-14 h-14 bg-accent text-primary rounded-2xl flex-shrink-0 flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
                      >
                        <Send size={24} />
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-surface-dark/20 border-dashed border-2 border-primary/5 m-8 rounded-[2.5rem]">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare size={32} className="text-primary/20" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">Select a conversation</h3>
                  <p className="text-primary/30 max-w-xs">Review user inquiries and provide technical support to our sanctuary community.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
