import { motion } from 'framer-motion'
import { Mountain, Instagram, ArrowRight } from 'lucide-react'

export function Gallery() {
  const images = [
    { url: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80', breed: 'Nigerian Dwarf', location: 'West Pastures' },
    { url: 'https://images.unsplash.com/photo-1761945729356-34eb5f7c9254?auto=format&fit=crop&q=80&w=1000', breed: 'Pygmy', location: 'Main Barn' },
    { url: 'https://images.unsplash.com/photo-1642776185817-16c1b2419465?auto=format&fit=crop&q=80&w=1000', breed: 'Fainting (Myotonic)', location: 'Sanctuary Creek' },
    { url: 'https://images.unsplash.com/photo-1741456868875-30574ef99e55?auto=format&fit=crop&q=80&w=1000', breed: 'Heritage Herd', location: 'Eco-Orchard' },
    { url: 'https://images.unsplash.com/photo-1544253185-180a5624775d?auto=format&fit=crop&q=80', breed: 'Miniature Alpine', location: 'Morning Meadows' },
    { url: 'https://images.unsplash.com/photo-1484557918186-75c17945ade0?auto=format&fit=crop&q=80', breed: 'Heritage Breed', location: 'Fiber Fields' },
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent-dark mb-6 leading-none"
              >
                Visual Sanctuary
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-bold text-primary mb-6 tracking-tight"
              >
                The Art of <span className="text-accent underline decoration-accent/20">Heritage Breed</span> Life
              </motion.h1>
            </div>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4"
              >
              <button className="flex items-center gap-2 font-bold text-primary/40 hover:text-accent transition-colors">
                <Instagram size={20} /> Follow Our Daily Life
              </button>
            </motion.div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {images.map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i % 3) * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-square rounded-[2.5rem] overflow-hidden cursor-pointer"
            >
              <img 
                src={img.url} 
                alt={img.breed} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-8 left-8 right-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                <p className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{img.location}</p>
                <h4 className="text-2xl font-bold text-white mb-4">{img.breed}</h4>
                <div className="w-10 h-10 rounded-full bg-accent text-primary flex items-center justify-center">
                  <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="bg-primary/5 p-12 md:p-24 rounded-[3rem] border border-primary/5 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-primary mb-6">Capture the Heritage</h3>
            <p className="text-primary/60 mb-10 leading-relaxed text-lg">
              Our sanctuary is open to professional photographers by appointment. 
              Help us document the majesty of heritage breed goats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary py-4 px-10">Request Access</button>
              <button className="btn-outline py-4 px-10 border-primary/10 text-primary hover:bg-primary hover:text-white">Learn Requirements</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
