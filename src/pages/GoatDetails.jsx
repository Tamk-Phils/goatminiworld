import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Tag, Calendar, DollarSign, MessageSquare, ShieldCheck, Heart } from 'lucide-react'

export function GoatDetails() {
  const { id } = useParams()
  const [goat, setGoat] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const getBreedImage = (breed) => {
    const images = {
      'Nigerian Dwarf': 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80',
      'Pygmy': 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&q=80',
      'Fainting': 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80'
    }
    return images[breed] || images['Nigerian Dwarf']
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!goat) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-primary">
      <h2 className="text-3xl font-bold mb-4">Goat not found</h2>
      <Link to="/browse" className="btn-primary">Back to Catalog</Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/browse" className="inline-flex items-center gap-2 text-primary/60 hover:text-accent transition-colors mb-8 font-medium">
          <ArrowLeft size={20} /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10">
              <img 
                src={goat.images?.[0] || goat.legacy_image_url || getBreedImage(goat.breed)} 
                alt={goat.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {goat.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {goat.images.slice(1).map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-primary/5 border border-primary/5 group">
                    <img 
                      src={url} 
                      alt="Gallery" 
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-primary text-accent text-xs font-bold uppercase tracking-wider">
                {goat.breed}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${goat.status === 'available' ? 'bg-accent/20 text-primary-light border border-accent/20' : 'bg-red-500/10 text-red-500 border border-red-500/10'}`}>
                {goat.status}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight">{goat.name}</h1>
            
            <p className="text-primary/60 text-lg leading-relaxed mb-10">
              {goat.description || "This majestic heritage breed goat is raised with the highest standards of care. Known for its gentle temperament and exceptional breed characteristics, it's ready to join a responsible guardian's herd."}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-10 border-y border-primary/5 py-10">
              <div>
                <div className="flex items-center gap-2 text-primary-light mb-1">
                  <DollarSign size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider opacity-60">Price</span>
                </div>
                <p className="text-3xl font-bold text-primary">${goat.price?.toLocaleString()}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary-light mb-1">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider opacity-60">Breed Spec</span>
                </div>
                <p className="text-lg font-bold text-primary">{goat.stats?.temperament || 'Heritage Purebred'}</p>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-primary/5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-primary-light">
                  <Heart size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Health Guarantee</h4>
                  <p className="text-primary/60 text-sm mt-1">Full veterinary screening and heritage certification provided.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-primary/5 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-primary-light">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Ready for Rehoming</h4>
                  <p className="text-primary/60 text-sm mt-1">Available for immediate application review and logistics planning.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to={`/apply/${goat.id}`}
                className="flex-1 btn-primary py-5 justify-center text-lg"
              >
                Start Adoption Application
              </Link>
              <button className="px-8 py-5 rounded-full border-2 border-primary/10 font-bold text-primary flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                <MessageSquare size={20} /> Ask a Question
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
