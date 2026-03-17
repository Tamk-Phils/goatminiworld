import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Plus, Search, Edit3, Trash2, Camera, X, Check, Save, Mountain } from 'lucide-react'
import { Navigate } from 'react-router-dom'

export function AdminInventory() {
  const { isAdmin } = useAuth()
  const [goats, setGoats] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    breed: 'Pygmy',
    price: '',
    initial_deposit: '',
    description: '',
    status: 'available',
    images: []
  })

  useEffect(() => {
    if (isAdmin) fetchGoats()
  }, [isAdmin])

  const fetchGoats = async () => {
    try {
      const { data, error } = await supabase
        .from('goats')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setGoats(data)
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `goat-images/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from('goats')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('goats')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Process manual URL inputs or uploaded files
      // We'll keep it simple: any new files uploaded go into the images array
      if (isEditing) {
        const { error } = await supabase.from('goats').update(formData).eq('id', isEditing)
        if (error) throw error
      } else {
        const { error } = await supabase.from('goats').insert([formData])
        if (error) throw error
      }
      
      setShowAddModal(false)
      setIsEditing(null)
      setFormData({ name: '', breed: 'Pygmy', price: '', initial_deposit: '', description: '', status: 'available', images: [] })
      fetchGoats()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    setLoading(true)
    try {
      const uploadPromises = files.map(file => uploadImage(file))
      const urls = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...urls]
      }))
    } catch (err) {
      alert('Upload failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This action cannot be undone.')) return
    try {
      const { error } = await supabase.from('goats').delete().eq('id', id)
      if (error) throw error
      fetchGoats()
    } catch (err) {
      alert(err.message)
    }
  }

  if (!isAdmin) return <Navigate to="/" />

  return (
    <div className="min-h-screen pt-32 pb-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2 tracking-tight flex items-center gap-4">
              <Mountain size={32} className="text-accent-dark" /> Herd Inventory
            </h1>
            <p className="text-primary/60">Source of truth for the heritage herd.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary py-4 px-8"
          >
            <Plus size={20} /> Add New Goat
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-primary/20">Loading inventory...</div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-primary/5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  <tr>
                    <th className="px-8 py-6">Image</th>
                    <th className="px-8 py-6">Name</th>
                    <th className="px-8 py-6">Breed</th>
                    <th className="px-8 py-6">Price</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {goats.map((goat) => (
                    <tr key={goat.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-primary/5">
                          <img 
                            src={goat.images?.[0] || goat.legacy_image_url || 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80'} 
                            alt={goat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-primary">{goat.name}</td>
                      <td className="px-8 py-6 text-primary/60">{goat.breed}</td>
                      <td className="px-8 py-6 font-medium">${goat.price.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          goat.status === 'available' ? 'bg-accent/20 text-primary-light' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {goat.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setIsEditing(goat.id)
                              setFormData(goat)
                              setShowAddModal(true)
                            }}
                            className="p-3 rounded-xl bg-primary/5 text-primary/40 hover:bg-accent hover:text-primary transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(goat.id)}
                            className="p-3 rounded-xl bg-primary/5 text-primary/40 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
                onClick={() => setShowAddModal(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-4xl rounded-[3rem] p-10 sm:p-16 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <header className="mb-12 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-primary tracking-tight">
                    {isEditing ? 'Update Goat' : 'Add New Heritage Goat'}
                  </h2>
                  <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-primary/5 rounded-full transition-colors">
                    <X size={24} className="text-primary/40" />
                  </button>
                </header>

                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-4">Goat Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full bg-primary/5 border-none rounded-2xl py-4 px-6 focus:ring-2 ring-accent"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-4">Breed</label>
                        <select 
                          className="w-full bg-primary/5 border-none rounded-2xl py-4 px-6 focus:ring-2 ring-accent"
                          value={formData.breed}
                          onChange={(e) => setFormData({...formData, breed: e.target.value})}
                        >
                          <option>Pygmy</option>
                          <option>Fainting</option>
                          <option>Nigerian Dwarf</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-4">Status</label>
                        <select 
                          className="w-full bg-primary/5 border-none rounded-2xl py-4 px-6 focus:ring-2 ring-accent"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option>available</option>
                          <option>reserved</option>
                          <option>sold</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-4">Price ($)</label>
                        <input 
                          required
                          type="number" 
                          className="w-full bg-primary/5 border-none rounded-2xl py-4 px-6 focus:ring-2 ring-accent"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-4">Deposit ($)</label>
                        <input 
                          required
                          type="number" 
                          className="w-full bg-primary/5 border-none rounded-2xl py-4 px-6 focus:ring-2 ring-accent"
                          value={formData.initial_deposit}
                          onChange={(e) => setFormData({...formData, initial_deposit: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-4">Description</label>
                      <textarea 
                        className="w-full bg-primary/5 border-none rounded-2xl py-4 px-6 h-40 focus:ring-2 ring-accent resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 ml-4">Heritage Images</label>
                      
                      {/* Image Preview Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        {formData.images?.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-primary/5">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                              className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}
                        
                        {/* Upload Button */}
                        <label className="aspect-square rounded-xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-all text-primary/30 hover:text-primary hover:border-accent">
                          <Camera size={24} className="mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-primary/30 italic px-4">Upload actual photos of the heritage breed.</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-6">
                    <button type="submit" className="btn-primary w-full justify-center py-5">
                      <Save size={20} /> {isEditing ? 'Update Goat' : 'Add to Herd'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
