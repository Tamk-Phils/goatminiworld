import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export function Footer() {
  return (
    <footer className="bg-primary text-white py-20 px-6 sm:px-12 md:px-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logo} alt="MiniGoat Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">MINIGOAT WORLD</h3>
          </div>
          <p className="text-white/60 mb-8 leading-relaxed">
            Preserving heritage breeds through responsible care and sustainable agricultural practices.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
              <Instagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
              <Facebook size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-accent">Quick Links</h4>
          <ul className="space-y-4 text-white/60">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/browse" className="hover:text-white transition-colors">Our Herd</Link></li>
            <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/sustainability" className="hover:text-white transition-colors">Sustainability</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-accent">Contact</h4>
          <ul className="space-y-4 text-white/60">
            <li className="flex items-center gap-3"><Mail size={18} className="text-accent"/> support@minigoatworld.com</li>
            <li className="flex items-center gap-3"><Phone size={18} className="text-accent"/> +1 (555) GOAT-HERD</li>
            <li className="flex items-center gap-3"><MapPin size={18} className="text-accent"/> 123 Sanctuary Way, Green Valley</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-accent">Newsletter</h4>
          <p className="text-white/60 mb-6 text-sm">Join our herd for updates on new arrivals and conservation efforts.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 rounded-l-full px-4 py-2 w-full focus:outline-none focus:border-accent"
            />
            <button className="bg-accent text-primary px-6 py-2 rounded-r-full font-bold hover:bg-accent-hover transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
        <p>&copy; {new Date().getFullYear()} MiniGoat World. All rights reserved.</p>
      </div>
    </footer>
  )
}
