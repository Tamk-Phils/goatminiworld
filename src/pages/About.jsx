import { motion } from 'framer-motion'
import { Mountain, Users, Heart, Shield } from 'lucide-react'

export function About() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-accent-dark mb-6 leading-none"
          >
            Since 2006
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-primary mb-8 tracking-tight"
          >
            A Sanctuary Built on <span className="text-accent underline decoration-accent/30">Heritage and Love</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary/60 text-lg leading-relaxed"
          >
            MiniGoat World began as a small family project to preserve the rare Pygmy breed. 
            Today, we are a global leader in heritage goat advocacy, connecting responsible 
            families with the world's most majestic companions.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10">
              <img 
                src="https://images.unsplash.com/photo-1588236079413-5134f759d816?auto=format&fit=crop&q=80&w=1000" 
                alt="Our History" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-accent p-10 rounded-[2.5rem] shadow-xl text-primary md:block hidden">
              <Mountain size={48} className="mb-4" />
              <div className="text-4xl font-bold mb-1">20+</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-60">Years of Care</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h3 className="text-3xl font-bold text-primary mb-6">Preserving Purity</h3>
              <p className="text-primary/60 leading-relaxed">
                We maintain strict breeding standards to ensure the genetic integrity of every animal in our care. 
                Our goats aren't just livestock; they are living pieces of agricultural history.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-3xl border border-primary/5 shadow-sm">
                <Users size={32} className="text-accent-dark mb-4" />
                <h4 className="font-bold text-primary mb-2">Community Driven</h4>
                <p className="text-sm text-primary/60">Supporting local farms and sustainable agricultural practices.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-primary/5 shadow-sm">
                <Heart size={32} className="text-accent-dark mb-4" />
                <h4 className="font-bold text-primary mb-2">Ethics First</h4>
                <p className="text-sm text-primary/60">Every animal's health and happiness is our primary metric of success.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <section className="bg-primary p-12 md:p-24 rounded-[3rem] text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <Shield size={64} className="text-accent mb-8" />
            <h2 className="text-4xl font-bold mb-8">Our Heritage Promise</h2>
            <p className="text-white/60 text-lg leading-relaxed mb-12">
              We stand behind every goat that leaves our sanctuary. From health guarantees to 
              lifelong support, choosing MiniGoat World means joining a family dedicated 
              to the future of these incredible creatures.
            </p>
            <div className="w-full h-px bg-white/10 mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-accent mb-1">500+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Happy Homes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-1">12</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Breed Awards</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-1">100%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Traceability</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-1">24/7</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Consultation</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10"><Mountain size={300} /></div>
            <div className="absolute bottom-10 right-10 rotate-180"><Mountain size={300} /></div>
          </div>
        </section>
      </div>
    </div>
  )
}
