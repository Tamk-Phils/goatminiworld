import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Send, ArrowLeft, Mountain, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function UserChat() {
  const { user, profile } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [adminId, setAdminId] = useState(null)
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    
    fetchAdminAndMessages()

    const channel = supabase
      .channel('chat-room')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user.id}` 
      }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  const fetchAdminAndMessages = async () => {
    try {
      // Find an admin to chat with (don't use single() as it errors if 0 found)
      const { data: admins } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .limit(1)

      if (admins && admins.length > 0) {
        setAdminId(admins[0].id)
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data)
    } catch (err) {
      console.error('Error fetching messages:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || !adminId) return

    const newMessage = {
      sender_id: user.id,
      receiver_id: adminId,
      content: input,
      is_read: false
    }

    // Optimistic update
    setMessages(prev => [...prev, { ...newMessage, created_at: new Date().toISOString(), id: Math.random() }])
    setInput('')

    try {
      const { error } = await supabase.from('messages').insert([newMessage])
      if (error) throw error
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-12 bg-surface flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-6 flex flex-col flex-1">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full border border-primary/5 text-primary/40 hover:text-primary transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">Sanctuary Support</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-accent-dark">Live Consultation</p>
            </div>
          </div>
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-accent shadow-lg shadow-primary/10">
            <Mountain size={28} />
          </div>
        </header>

        <div className="flex-1 bg-white rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 flex flex-col overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {loading ? (
              <div className="h-full flex items-center justify-center text-primary/20">
                <p>Loading conversation...</p>
              </div>
            ) : !adminId ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-12">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <Mountain size={32} className="text-primary/20" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Sanctuary Offline</h3>
                <p className="text-primary/40 text-sm leading-relaxed">
                  Our team is currently setting up the sanctuary. Please try again in a few minutes or contact us via email.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-12">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare size={32} className="text-primary/20" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Start a conversation</h3>
                <p className="text-primary/40 text-sm leading-relaxed">
                  Send a message to our sanctuary team regarding your applications or any breed-specific questions.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                    msg.sender_id === user.id 
                    ? 'bg-primary text-white rounded-tr-none border border-primary shadow-primary/10' 
                    : 'bg-surface-dark/50 text-primary rounded-tl-none border border-black/5'
                  }`}>
                    {msg.content}
                    <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest opacity-30 ${msg.sender_id === user.id ? 'text-white' : 'text-primary'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-6 bg-surface-dark/20 border-t border-primary/5">
            <div className="relative group flex gap-4">
              <input 
                type="text" 
                placeholder={!adminId ? "Sanctuary team offline..." : "Type your message..."}
                className="flex-1 bg-white border border-primary/10 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:border-accent shadow-sm transition-all disabled:opacity-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!adminId}
              />
              <button 
                type="submit"
                disabled={!input.trim() || !adminId}
                className="w-14 h-14 bg-accent text-primary rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={24} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
