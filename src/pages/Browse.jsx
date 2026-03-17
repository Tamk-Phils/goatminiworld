import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Search, Filter, ArrowRight, Tag, Info } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Browse() {
  const [goats, setGoats] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [breedFilter, setBreedFilter] = useState('All')

  useEffect(() => {
    fetchGoats()
  }, [])

  const fetchGoats = async () => {
    try {
      const { data, error } = await supabase
        .from('goats')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setGoats(data)
    } catch (err) {
      console.error('Error fetching goats:', err)
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

  const breeds = ['All', 'Pygmy', 'Fainting', 'Nigerian Dwarf']
  
  const filteredGoats = goats.filter(goat => {
    const matchesSearch = goat.name.toLowerCase().includes(search.toLowerCase()) || 
                          goat.breed.toLowerCase().includes(search.toLowerCase())
    const matchesBreed = breedFilter === 'All' || goat.breed === breedFilter
    return matchesSearch && matchesBreed
  })

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">Our Heritage Herd</h1>
          <p className="text-primary/60 text-lg max-w-2xl leading-relaxed">
            Browse our carefully raised collection of premium heritage goats. Each individual represents a commitment to sustainability and breed purity.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full lg:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-accent transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or breed..."
              className="w-full bg-white border border-primary/10 rounded-2xl py-4 pl-12 pr-4 text-primary focus:outline-none focus:border-accent shadow-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto">
            {breeds.map(breed => (
              <button 
                key={breed}
                onClick={() => setBreedFilter(breed)}
                className={`px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${breedFilter === breed ? 'bg-primary text-accent' : 'bg-white border border-primary/10 text-primary hover:border-accent'}`}
              >
                {breed}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 rounded-[2rem] bg-primary/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGoats.map((goat, index) => (
              <motion.div
                key={goat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-primary/5 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={goat.images?.[0] || goat.legacy_image_url || getBreedImage(goat.breed)} 
                    alt={goat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Tag size={12} className="text-accent-dark" /> {goat.breed}
                  </div>
                  <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full backdrop-blur-md text-xs font-bold uppercase tracking-wider ${goat.status === 'available' ? 'bg-accent/90 text-primary' : 'bg-red-500/90 text-white'}`}>
                    {goat.status}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary mb-1">{goat.name}</h3>
                      <p className="text-primary/50 text-sm line-clamp-1">{goat.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary/40 text-xs font-bold uppercase">Price</p>
                      <p className="text-2xl font-bold text-primary">${goat.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Link 
                      to={`/goat/${goat.id}`}
                      className="flex-1 btn-primary py-3 justify-center text-sm"
                    >
                      View Details
                    </Link>
                    <button className="p-3 rounded-full border border-primary/10 hover:border-accent hover:text-accent transition-colors">
                      <Info size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredGoats.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-primary/20" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">No goats found</h3>
            <p className="text-primary/50">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  )
}
