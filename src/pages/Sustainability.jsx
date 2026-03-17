import { motion } from 'framer-motion'
import { Leaf, Sun, Wind, Droplets, Mountain } from 'lucide-react'

export function Sustainability() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-accent-dark mb-6 leading-none"
          >
            Eco-Sanctuary
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-primary mb-8 tracking-tight max-w-4xl"
          >
            Building the Future Through <span className="text-accent">Regenerative Harmony</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary/60 text-lg leading-relaxed max-w-2xl"
          >
            How we integrate traditional wisdom with modern eco-technology to create 
            a sanctuary that gives back more than it takes.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {[
            { 
              icon: Leaf, 
              title: "Rotational Grazing", 
              desc: "Managing pastures to improve soil health and prevent overgrazing, utilizing goats' natural behaviors.",
              color: "bg-green-500/10 text-green-600"
            },
            { 
              icon: Sun, 
              title: "Solar Operations", 
              desc: "Our sanctuary runs on 100% renewable energy, powering our monitoring and cooling systems.",
              color: "bg-amber-500/10 text-amber-600"
            },
            { 
              icon: Droplets, 
              title: "Water Conservation", 
              desc: "Advanced rainwater harvesting and gray-water recycling systems maintain our lush pastures year-round.",
              color: "bg-blue-500/10 text-blue-600"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-10 bg-white rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{item.title}</h3>
              <p className="text-primary/60 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary mb-8 tracking-tight">Environmental Stewardship</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center font-bold text-primary">1</div>
                <div>
                  <h4 className="font-bold text-primary mb-2">Waste to Gold</h4>
                  <p className="text-primary/60 text-sm">Every byproduct of our farm is composted and returned to the soil as high-quality organic nutrient.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center font-bold text-primary">2</div>
                <div>
                  <h4 className="font-bold text-primary mb-2">Native Reforestation</h4>
                  <p className="text-primary/60 text-sm">We've planted over 2,000 native trees to provide natural shelter and increase local biodiversity.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center font-bold text-primary">3</div>
                <div>
                  <h4 className="font-bold text-primary mb-2">Zero Chemical Policy</h4>
                  <p className="text-primary/60 text-sm">No harmful pesticides or synthetic fertilizers are ever used on our heritage lands.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80" 
              alt="Sustainable Pasture" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
            <div className="absolute top-10 left-10 right-10 p-10 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20">
              <Wind className="text-accent mb-4" size={32} />
              <p className="text-white font-bold text-lg leading-relaxed">
                "Our goal is not just to preserve breeds, but to preserve the ecosystems they were meant to live in."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
