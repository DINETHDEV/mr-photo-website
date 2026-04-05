'use client';

import { useState, useEffect } from 'react';
import { 
  ImageIcon, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Loader2, 
  Layers, 
  CheckCircle2, 
  X, 
  Upload, 
  LayoutGrid, 
  Save, 
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { fetchAdminData, postAdminData, deleteAdminData } from '@/utils/adminApi';

const portfolioCategories = ['Restoration', 'Design', 'Frames', 'Printing'];

export default function PortfolioManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Restoration',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await fetchAdminData('portfolio');
      setItems(data || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load portfolio");
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select an image");

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('image', imageFile);

    try {
      toast.loading("Uploading masterpiece...", { id: 'upload' });
      await postAdminData('portfolio', data, true);
      toast.success("Added to gallery", { id: 'upload' });
      setIsModalOpen(false);
      resetForm();
      loadPortfolio();
    } catch (error) {
      toast.error("Upload failed", { id: 'upload' });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: 'Restoration' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this masterpiece from gallery?")) {
      try {
        await deleteAdminData(`portfolio/${id}`);
        toast.success("Work item removed");
        loadPortfolio();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <ImageIcon className="text-primary" size={32} /> 
               Previous Projects <span className="text-primary italic">Gallery</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your studio&apos;s showcased work and masterpiece gallery.</p>
         </div>

         <button 
          onClick={() => { setIsModalOpen(true); resetForm(); }}
          className="btn-primary flex items-center gap-2 px-6 py-4 rounded-2xl shadow-neon group"
        >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Work Item
         </button>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {items.map((item) => (
            <GlassCard key={item._id} className="p-0 overflow-hidden border-white/5 hover:border-primary/20 flex flex-col group">
               <div className="relative aspect-video">
                  <img src={item.image || item.beforeImage} className="w-full h-full object-cover" alt={item.title} />
                  <div className="absolute top-4 right-4 flex gap-2">
                     <button onClick={() => handleDelete(item._id)} className="w-10 h-10 glass rounded-full text-white flex items-center justify-center shadow-lg hover:bg-red-500 transition-all"><Trash2 size={16}/></button>
                  </div>
               </div>
               
               <div className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{item.title}</h3>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[3px]">{item.category}</span>
                  </div>
               </div>
            </GlassCard>
         ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="w-full max-w-2xl glass p-8 md:p-10 border-primary/20 shadow-neon-xl relative max-h-[85vh] overflow-y-auto"
            >
               <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
               
               <div className="mb-10 text-center md:text-left">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Add <span className="text-primary italic">Work Item</span></h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-[2px] mt-1">Gallery Configuration</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2 col-span-1 border-b border-white/5 pb-6 md:border-none md:pb-0">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Masterpiece Title</label>
                        <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" required placeholder="A brief name for this work" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Showcase Category</label>
                        <div className="grid grid-cols-2 gap-2">
                           {portfolioCategories.map(cat => (
                              <button 
                                 key={cat}
                                 type="button"
                                 onClick={() => setFormData({...formData, category: cat})}
                                 className={`py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    formData.category === cat ? 'bg-primary text-black' : 'glass text-gray-500'
                                 }`}
                              >
                                 {cat}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                     <div className="space-y-4 text-center max-w-xs mx-auto">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Work Image</label>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl h-64 group cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all overflow-hidden relative">
                           {imagePreview ? (
                              <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover p-2 rounded-[30px]" alt="Preview" />
                           ) : (
                              <div className="text-center group-hover:scale-110 transition-transform">
                                 <PlusCircle className="mx-auto text-gray-700 mb-2" size={32} />
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 block">Select Photo</span>
                              </div>
                           )}
                           <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                        </label>
                     </div>
                  </div>

                  <button type="submit" className="w-full btn-primary py-5 text-lg shadow-neon flex items-center justify-center gap-3">
                     <Save size={20} /> Publish to Gallery
                  </button>
               </form>
            </motion.div>
         </div>
      )}
    </div>
  );
}

// Fix missing Lucide import
const PlusCircle = ({ size, className }) => <Plus className={className} size={size} />;
const ArrowRightLeft = ({ size, className }) => <Layers className={className} size={size} />;
