import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield, Heart, MessageSquare, Info, X, Mountain, Ruler, Thermometer, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Home() {
  const [selectedBreed, setSelectedBreed] = useState(null)

  const breeds = [
    { 
      title: 'Nigerian Dwarf', 
      desc: 'Highly productive and gentle companions, perfect for small acreage farms.',
      img: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80',
      specs: {
        height: '17 - 23 inches',
        weight: '60 - 75 lbs',
        temperament: 'Gentle & Gregarious',
        yield: 'High Butterfat Milk'
      }
    },
    { 
      title: 'Pygmy Heritage', 
      desc: 'Ancient breeds with compact size and remarkable resilience.',
      img: 'https://images.unsplash.com/photo-1761945729356-34eb5f7c9254?auto=format&fit=crop&q=80&w=1000',
      specs: {
        height: '16 - 20 inches',
        weight: '50 - 65 lbs',
        temperament: 'Alert & Active',
        resilience: 'Very High'
      }
    },
    { 
      title: 'Fainting (Myotonic)', 
      desc: 'Docile, heavy-muscled heritage breed known for their unique genetic trait.',
      img: 'https://images.unsplash.com/photo-1642776185817-16c1b2419465?auto=format&fit=crop&q=80&w=1000',
      specs: {
        height: '17 - 25 inches',
        weight: '60 - 150 lbs',
        temperament: 'Quiet & Easy-to-keep',
        trait: 'Congenital Myotonia'
      }
    }
  ]
  return (
    <div className="bg-primary min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          {/* Background image reverted to original */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm"
          >
            Sustaining Heritage Breeds
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
          >
            Nurture the Soul with <br />
            <span className="text-accent underline decoration-accent/30">Heritage Companionship</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed"
          >
            We connect responsible families with premium heritage goat breeds. 
            Join our mission to preserve these majestic creatures for generations to come.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link to="/browse" className="btn-primary">
              Explore Our Herd <ArrowRight size={20} />
            </Link>
            <a href="#mission" className="btn-outline">
              Learn Our Mission
            </a>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="bg-primary pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-6 leading-none">Our Mission</h2>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Innovating the Future of Heritage Preservation</h3>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                At MiniGoat World, we combine ancient heritage with modern sustainability. 
                Our sanctuary is more than a farm; it's a bridge between generations, 
                ensuring that rare breeds like Pygmy and Nigerian Dwarf goats thrive 
                in environments that honor their legacy.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-accent mb-2">100%</div>
                  <div className="text-sm font-medium text-white/40 uppercase tracking-widest">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent mb-2">20+</div>
                  <div className="text-sm font-medium text-white/40 uppercase tracking-widest">Years of Experience</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1741456868875-30574ef99e55?auto=format&fit=crop&q=80&w=1000" 
                alt="Sanctuary Mission" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Breed Showcase Grid */}
      <section className="bg-surface py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary/40 mb-6 leading-none">Heritage Breeds</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">Where Nature Meets Excellence</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {breeds.map((breed, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer"
                onClick={() => setSelectedBreed(breed)}
              >
                <img 
                  src={breed.img} 
                  alt={breed.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <h4 className="text-3xl font-bold text-white mb-2">{breed.title}</h4>
                  <p className="text-white/60 mb-6 max-w-sm text-sm">{breed.desc}</p>
                  <button className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                    View Breed Specs <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Breed Specs Modal */}
      <AnimatePresence>
        {selectedBreed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-xl"
            onClick={() => setSelectedBreed(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3.5rem] p-12 max-w-2xl w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedBreed(null)}
                className="absolute top-8 right-8 p-3 rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all z-10"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row gap-10 items-center mb-10">
                <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden shrink-0 shadow-lg shadow-primary/10">
                  <img src={selectedBreed.img} className="w-full h-full object-cover" alt={selectedBreed.title} />
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-primary mb-4">{selectedBreed.title}</h3>
                  <div className="flex items-center gap-2 text-accent-dark font-bold text-xs uppercase tracking-[0.2em]">
                    <Shield size={16} /> Heritage Certification
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {Object.entries(selectedBreed.specs).map(([label, value], i) => (
                  <div key={i} className="p-6 bg-primary/5 rounded-[2rem] border border-primary/5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-primary/5 flex items-center justify-center text-accent-dark shadow-sm shrink-0">
                      {label === 'height' ? <Ruler size={18} /> : 
                       label === 'weight' ? <Mountain size={18} /> : 
                       label === 'temperament' ? <Heart size={18} /> : 
                       <Zap size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">{label}</p>
                      <p className="text-primary font-bold text-sm tracking-tight">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-accent/20 rounded-[2rem] flex items-center justify-between border-2 border-accent/20">
                <div>
                  <h4 className="font-bold text-primary mb-1 text-lg">Interested in this breed?</h4>
                  <p className="text-primary/60 text-xs">Our sanctuary experts can provide detailed rehoming guides.</p>
                </div>
                <Link to="/browse" className="bg-primary text-white p-4 rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
                  <ArrowRight size={24} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sustainability Section */}
      <section className="bg-primary py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-accent mb-6 leading-none">Sustainability</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Regenerative Farming for a Greener Tomorrow</h3>
            <p className="text-white/60 text-lg leading-relaxed mb-12">
              Our goats play a vital role in local land management. Through rotational grazing 
              and natural soil building, we ensure that the sanctuary enriches the earth 
              while providing the highest quality care for our herd.
            </p>
            
            <button className="btn-outline">
              Explore Our Sustainability Practices
            </button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-primary/5 py-32 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-[3.5rem] overflow-hidden group"
            >
              <img 
                src="https://images.unsplash.com/photo-1741456868875-30574ef99e55?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="Sanctuary Life"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute top-10 right-10 flex gap-2">
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest">
                  Live Feed
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col justify-center">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-accent-dark mb-6 leading-none">The Experience</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">A Day in the Life at MiniGoat World</h3>
              <p className="text-primary/60 text-lg leading-relaxed mb-10">
                From morning grazing sessions in the dew-covered meadows to quiet evenings 
                in our temperature-controlled sanctuaries, every moment is designed 
                to respect the natural rhythms of our heritage herd.
              </p>
              
              <div className="space-y-6">
                {[
                  { time: '06:00 AM', event: 'Dawn Pasturing & Health Checks' },
                  { time: '11:00 AM', event: 'Social Heritage Interaction' },
                  { time: '04:00 PM', event: 'Regenerative Grazing Rotation' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-center p-6 bg-white rounded-3xl border border-primary/5 shadow-sm">
                    <span className="text-xs font-bold text-accent-dark uppercase tracking-widest shrink-0 w-24">{item.time}</span>
                    <div className="h-8 w-px bg-primary/10" />
                    <span className="font-bold text-primary">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-32 border-y border-primary/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary/40 mb-6 leading-none">Our Community</h2>
            <h3 className="text-4xl font-bold text-primary tracking-tight">Voices of the Sanctuary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              {
                text: "The support from MiniGoat World has been life-changing for our small family farm. Their heritage expertise is unmatched.",
                author: "Sarah Jenkins",
                role: "Member since 2021",
                img: "/community/portrait_1_sarah_1773737408235.png"
              },
              {
                text: "We adopted two Nigerian Dwarfs and were blown away by the health and temperament of the animals. Truly a premium experience.",
                author: "Dr. Marcus Chen",
                role: "Vet & User",
                img: "/community/portrait_2_marcus_1773737427020.png"
              },
              {
                text: "MiniGoat World isn't just a platform; it's a movement for sustainable agricultural preservation. Proud to be part of the herd.",
                author: "Emma Thorne",
                role: "Heritage Advocate",
                img: "/community/portrait_3_emma_1773737444810.png"
              },
              {
                text: "The level of care and detail in their breeding program is visible in every animal. A gold standard for heritage farms.",
                author: "David Miller",
                role: "Heritage Farmer",
                img: "/community/portrait_4_david_1773737460799.png"
              },
              {
                text: "Finding MiniGoat World was a blessing. Their commitment to these majestic creatures is beautiful to witness.",
                author: "Linda Thompson",
                role: "Sanctuary Member",
                img: "/community/portrait_5_linda_1773737475853.png"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/5 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-accent/20 shadow-xl">
                  <img src={t.img} alt={t.author} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Heart key={j} size={12} className="text-accent fill-accent" />)}
                </div>
                <p className="text-primary/70 mb-8 leading-relaxed italic text-sm">"{t.text}"</p>
                <div className="mt-auto">
                  <h4 className="font-bold text-primary">{t.author}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface py-32 border-t border-primary/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary/40 mb-6 leading-none">Common Questions</h2>
              <h3 className="text-4xl font-bold text-primary tracking-tight">Got Questions? We've Got You Covered.</h3>
            </div>
            <Link to="/faq" className="btn-primary py-3 px-8 text-sm">
              View All FAQs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'What kind of farming solutions do you offer?',
              'How can I start using the MiniGoat World platform?',
              'Are your technologies eco-friendly?',
              'Do you provide support and training?'
            ].map((q, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-primary/5 flex items-center justify-between hover:shadow-xl hover:shadow-primary/5 transition-all group cursor-pointer">
                <span className="font-bold text-primary/80 group-hover:text-primary transition-colors">{q}</span>
                <div className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-primary/20 group-hover:bg-accent group-hover:text-primary group-hover:border-accent transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
