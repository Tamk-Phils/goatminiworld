import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, CheckCircle2, Send, Mountain } from 'lucide-react'

export function Apply() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [goat, setGoat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    phone: '',
    experience: 'beginner',
    environment: '',
    motivation: '',
    message: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    fetchGoat()
  }, [id, user])

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
      const { error } = await supabase
        .from('adoption_requests')
        .insert([
          {
            user_id: user.id,
            goat_id: id,
            phone: formData.phone,
            experience: formData.experience,
            environment: formData.environment,
            motivation: formData.motivation,
            message: formData.message,
            status: 'pending'
          }
        ])

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
            Your application for <strong>{goat?.name}</strong> has been successfully submitted. Our team will review your farm information and get back to you shortly.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full justify-center py-4"
          >
            Go to Dashboard
          </button>
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">User Sponsorship Program</h1>
            <p className="text-primary/60 mb-10 leading-relaxed">
              We take great care in selecting the right homes for our heritage goats. Please provide details about your farm and experience.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-light opacity-80">Phone Number</label>
                  <input 
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-white border border-primary/10 rounded-2xl p-4 focus:outline-none focus:border-accent shadow-sm transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-primary-light opacity-80">Experience Level</label>
                  <select 
                    className="w-full bg-white border border-primary/10 rounded-2xl p-4 focus:outline-none focus:border-accent shadow-sm transition-all appearance-none"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  >
                    <option value="beginner">Beginner (No Goats Yet)</option>
                    <option value="intermediate">Intermediate (1-2 Years)</option>
                    <option value="expert">Expert (3+ Years/Breeder)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-primary-light opacity-80">Living Environment</label>
                <textarea 
                  required
                  placeholder="Describe where the goat will live (acreage, shelter types, fencing)..."
                  className="w-full bg-white border border-primary/10 rounded-2xl p-6 h-32 focus:outline-none focus:border-accent shadow-sm transition-all"
                  value={formData.environment}
                  onChange={(e) => setFormData({...formData, environment: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-primary-light opacity-80">Motivation</label>
                <textarea 
                  required
                  placeholder="Why are you interested in this specific breed or animal?"
                  className="w-full bg-white border border-primary/10 rounded-2xl p-6 h-32 focus:outline-none focus:border-accent shadow-sm transition-all"
                  value={formData.motivation}
                  onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-primary-light opacity-80">Additional Message (Optional)</label>
                <textarea 
                  placeholder="Any specific questions or details you'd like to share..."
                  className="w-full bg-white border border-primary/10 rounded-2xl p-6 h-28 focus:outline-none focus:border-accent shadow-sm transition-all"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="btn-primary w-full justify-center py-5 text-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Final Application'}
                {!submitting && <Send size={20} />}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-primary p-8 rounded-[2.5rem] text-white overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">You're applying for</p>
                <h3 className="text-3xl font-bold mb-4">{goat?.name}</h3>
                <div className="aspect-square rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={goat?.images?.[0] || 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80'} 
                    alt={goat?.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/10">
                  <span className="text-white/60">Breed</span>
                  <span className="font-bold text-accent">{goat?.breed}</span>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <Mountain size={200} />
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-accent/10 border border-accent/20">
              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Mountain size={18} className="text-accent-dark" /> Process Overview
              </h4>
              <ul className="space-y-4 text-sm text-primary/70">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  Submission & Review
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  Admin Consultation
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  Deposit & Logistics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
