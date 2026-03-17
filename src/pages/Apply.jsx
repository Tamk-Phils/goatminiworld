import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, CheckCircle2, Send, Mountain, User, Mail, Phone } from 'lucide-react'

export function Apply() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [goat, setGoat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    experience: 'beginner',
    motivation: '',
    message: ''
  })

  useEffect(() => {
    fetchGoat()
  }, [id])

  const fetchGoat = async () => {
    try {
      const { data, error } = await supabase
        .from('goats')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      setGoat(data)
    } catch (err) {
      console.error('Error fetching goat:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const submissionData = {
        goat_id: id,
        guest_name: formData.name,
        guest_email: formData.email,
        experience: formData.experience,
        motivation: formData.motivation,
        message: formData.message,
        status: 'pending'
      }

      // If user is logged in, link the ID
      if (user) {
        submissionData.user_id = user.id
      }

      const { error } = await supabase
        .from('adoption_requests')
        .insert([submissionData])

      if (error) throw error
      setSubmitted(true)
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-surface flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white p-12 rounded-[3rem] shadow-2xl shadow-primary/5 border border-primary/5"
        >
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-primary mx-auto mb-8 shadow-xl shadow-accent/20">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">Application Sent!</h2>
          <p className="text-primary/60 mb-10 leading-relaxed">
            Your application for <strong>{goat?.name}</strong> has been successfully submitted. Our team will review your information and get back to you shortly.
          </p>
          <div className="space-y-4">
            {user && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary w-full justify-center py-4"
              >
                Go to Dashboard
              </button>
            )}
            <button 
              onClick={() => navigate('/browse')}
              className={`w-full justify-center py-4 font-bold rounded-full border-2 transition-all ${user ? 'border-primary/10 text-primary/40 hover:bg-primary/5' : 'bg-primary text-white border-primary hover:bg-primary/90'}`}
            >
              Browse More Goats
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-4xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Heritage Breed Sponsorship</h1>
            <p className="text-primary/60 mb-10 leading-relaxed text-lg">
              Become a guardian of heritage agriculture. Our application process ensures our goats find dedicated caretakers who value sustainability and breed preservation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Contact Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent/20 rounded-lg text-primary-light">
                    <User size={18} />
                  </div>
                  <h3 className="font-bold text-white text-xl">Contact Information</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-light opacity-60 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                      <input 
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full bg-white border border-primary/10 rounded-2xl p-4 pl-12 focus:outline-none focus:border-accent shadow-sm transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-light opacity-60 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                      <input 
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full bg-white border border-primary/10 rounded-2xl p-4 pl-12 focus:outline-none focus:border-accent shadow-sm transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary-light opacity-60 ml-1">Experience Level</label>
                    <select 
                      className="w-full bg-white border border-primary/10 rounded-2xl p-4 focus:outline-none focus:border-accent shadow-sm transition-all appearance-none font-medium"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    >
                      <option value="beginner">Beginner (No Goats Yet)</option>
                      <option value="intermediate">Intermediate (1-2 Years)</option>
                      <option value="expert">Expert (3+ Years/Breeder)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Motivation Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent/20 rounded-lg text-primary-light">
                    <Mountain size={18} />
                  </div>
                  <h3 className="font-bold text-white text-xl">Sponsorship Details</h3>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary-light opacity-60 ml-1">Motivation & Goals</label>
                  <textarea 
                    required
                    placeholder="Why are you interested in this specific breed or animal? What are your goals for heritage preservation?"
                    className="w-full bg-white border border-primary/10 rounded-2xl p-6 h-32 focus:outline-none focus:border-accent shadow-sm transition-all text-sm leading-relaxed"
                    value={formData.motivation}
                    onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-primary-light opacity-60 ml-1">Additional Message (Optional)</label>
                  <textarea 
                    placeholder="Any specific questions or details you'd like to share..."
                    className="w-full bg-white border border-primary/10 rounded-2xl p-6 h-28 focus:outline-none focus:border-accent shadow-sm transition-all text-sm leading-relaxed"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-primary w-full justify-center py-6 text-xl shadow-xl shadow-primary/10"
                >
                  {submitting ? 'Processing...' : 'Submit Sponsorship Application'}
                  {!submitting && <Send size={22} />}
                </button>
                <p className="text-center text-[10px] text-primary-light opacity-40 mt-6 uppercase tracking-widest font-bold">
                  Secure Submission • Heritage Preservation Protocol
                </p>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-primary p-8 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl shadow-primary/20">
              <div className="relative z-10">
                <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">You're applying for</p>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">{goat?.name}</h3>
                <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-inner bg-white/5">
                  <img 
                    src={goat?.images?.[0] || 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80'} 
                    alt={goat?.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="text-white/40 text-sm font-medium">Breed</span>
                  <span className="font-bold text-accent tracking-tight">{goat?.breed}</span>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-5">
                <Mountain size={200} />
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-accent/10 border border-accent/20">
              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Mountain size={18} className="text-accent-dark" /> Guardian Process
              </h4>
              <ul className="space-y-4 text-xs font-medium text-primary/70">
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-lg bg-accent text-primary flex items-center justify-center font-bold text-[10px] shrink-0">01</span>
                  Application Review
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-lg bg-accent text-primary flex items-center justify-center font-bold text-[10px] shrink-0">02</span>
                  Breed Consultation
                </li>
                <li className="flex gap-4">
                  <span className="w-6 h-6 rounded-lg bg-accent text-primary flex items-center justify-center font-bold text-[10px] shrink-0">03</span>
                  Secure Logistics
                </li>
              </ul>
            </div>
            
            {!user && (
              <div className="p-8 rounded-[2.5rem] bg-white border border-primary/5 shadow-sm text-center">
                <p className="text-xs text-primary/40 leading-relaxed">
                  Want to track your application and chat with breeders?
                </p>
                <Link to="/auth" className="text-accent-dark font-bold text-xs mt-2 inline-block hover:underline">
                  Create a Guardian Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
