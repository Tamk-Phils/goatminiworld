import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: "What makes heritage breeds different from common goat breeds?",
      a: "Heritage breeds are traditional livestock breeds that were raised by our ancestors before industrial farming. They are known for their resilience, unique temperaments, and genetic diversity, often being perfectly adapted to specific local environments."
    },
    {
      q: "What is the process for adopting a goat?",
      a: "The process begins with a sponsorship application. Our team reviews your farm infrastructure and experience. If approved, we facilitate a consultation, followed by a deposit to reserve your companion and logistics planning for rehoming."
    },
    {
      q: "Do you provide health certifications?",
      a: "Yes, every goat from MiniGoat World comes with full veterinary health records, including vaccination history, breed purity certification, and a health guarantee for the first 90 days."
    },
    {
      q: "Can I visit the sanctuary before applying?",
      a: "Due to our focus on animal well-being and biosecurity, we offer scheduled virtual tours for serious applicants. Physical visits are arranged only during the final consultation phase of the adoption process."
    },
    {
      q: "How much space does a heritage goat need?",
      a: "While it varies by breed, we generally recommend a minimum of 200-250 square feet of pasture per goat, along with secure, well-ventilated indoor shelter."
    },
    {
      q: "Do goats need companions?",
      a: "Absolutely. Goats are highly social herd animals. We require that our goats go to homes where they will have at least one other goat companion."
    }
  ]

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-20 text-center">
          <HelpCircle size={48} className="text-accent-dark mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-primary mb-6 tracking-tight">Member Knowledge Base</h1>
          <p className="text-primary/60 text-lg max-w-2xl mx-auto">
            Everything you need to know about heritage sponsorship, from care requirements to the adoption process.
          </p>
        </header>

        <div className="space-y-4 mb-20">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-3xl border transition-all overflow-hidden ${openIndex === i ? 'bg-white border-accent shadow-xl shadow-accent/5' : 'bg-white border-primary/5 hover:border-accent/40'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full p-8 flex items-center justify-between text-left"
              >
                <span className={`text-lg font-bold ${openIndex === i ? 'text-primary' : 'text-primary'}`}>{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-accent text-primary rotate-180' : 'bg-primary/5 text-primary/40'}`}>
                  {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-primary/60 leading-relaxed border-t border-primary/5 pt-6 mx-8">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="p-12 rounded-[3rem] bg-primary text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-white/60 mb-10 max-w-sm mx-auto leading-relaxed">
              Our sanctuary team is available for real-time consultation every day from 9am to 6pm.
            </p>
            <button className="btn-primary inline-flex py-4 px-10 mx-auto">
              Contact Support <MessageSquare size={18} />
            </button>
          </div>
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <HelpCircle size={400} className="absolute -bottom-20 -right-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
