'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XSquare,
  Loader2,
  Gift,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Save,
  X,
  PlusCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { fetchAdminData, postAdminData, putAdminData, deleteAdminData } from '@/utils/adminApi';

export default function PackagesManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPkg, setCurrentPkg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [features, setFeatures] = useState(['']);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const data = await fetchAdminData('packages/all');
      setPackages(data || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load packages");
      setLoading(false);
    }
  };

  const openModal = (pkg = null) => {
    if (pkg) {
      setCurrentPkg(pkg);
      setFormData({
        name: pkg.name,
        price: pkg.price,
        description: pkg.description,
        isActive: pkg.isActive
      });
      setFeatures(pkg.features || ['']);
      setImagePreview(pkg.image);
    } else {
      setCurrentPkg(null);
      setFormData({
        name: '',
        price: '',
        description: '',
        isActive: true
      });
      setFeatures(['']);
      setImagePreview(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => setFeatures([...features, '']);
  const updateFeature = (idx, val) => {
    const newFeatures = [...features];
    newFeatures[idx] = val;
    setFeatures(newFeatures);
  };
  const removeFeature = (idx) => setFeatures(features.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('isActive', formData.isActive);
    data.append('features', JSON.stringify(features.filter(f => f.trim() !== '')));
    if (selectedFile) data.append('image', selectedFile);

    try {
      if (currentPkg) {
        await putAdminData(`packages/${currentPkg._id}`, data, true);
        toast.success("Package updated");
      } else {
        if (!selectedFile) return toast.error("Please select an image");
        await postAdminData('packages', data, true);
        toast.success("New package created");
      }
      setIsModalOpen(false);
      loadPackages();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteAdminData(`packages/${id}`);
        toast.success("Package removed");
        loadPackages();
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
               <Gift className="text-primary" size={32} /> 
               Gift <span className="text-primary italic">Packages</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Create and manage stylized bundle packages.</p>
         </div>

         <button 
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2 px-6 py-4 rounded-2xl shadow-neon group"
        >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> New Package
         </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {packages.map((pkg) => (
            <GlassCard key={pkg._id} className={`p-0 overflow-hidden border-white/5 hover:border-primary/20 flex flex-col ${!pkg.isActive ? 'opacity-60' : ''}`}>
               <div className="relative aspect-video">
                  <img src={pkg.image} className="w-full h-full object-cover" alt={pkg.name} />
                  <div className="absolute top-4 right-4 flex gap-2">
                     <button onClick={() => openModal(pkg)} className="w-10 h-10 glass rounded-full text-white flex items-center justify-center shadow-lg hover:bg-primary hover:text-black transition-all"><Edit3 size={16}/></button>
                     <button onClick={() => handleDelete(pkg._id)} className="w-10 h-10 glass rounded-full text-white flex items-center justify-center shadow-lg hover:bg-red-500 transition-all"><Trash2 size={16}/></button>
                  </div>
               </div>
               
               <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                     <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{pkg.name}</h3>
                     <span className="text-lg font-black text-primary tracking-tighter">LKR {pkg.price}</span>
                  </div>
                  <p className="text-xs text-gray-500 italic line-clamp-2 h-8 leading-relaxed mb-4">{pkg.description}</p>
                  
                  <div className="space-y-2 mb-4">
                     {pkg.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                           <CheckCircle2 size={12} className="text-primary" /> {f}
                        </div>
                     ))}
                     {pkg.features.length > 3 && <div className="text-[10px] text-gray-600 italic">+{pkg.features.length - 3} more...</div>}
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
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{currentPkg ? 'Edit' : 'New'} <span className="text-primary italic">Package</span></h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-[2px] mt-1">Bundle Configuration</p>
               </div>

               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Package Name</label>
                        <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (LKR)</label>
                        <input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} type="number" required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none h-24 resize-none" />
                     </div>
                     
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Cover Image</label>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl h-40 group cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all overflow-hidden relative">
                           {imagePreview ? (
                              <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover p-2 rounded-[24px]" alt="Preview" />
                           ) : (
                              <div className="text-center group-hover:scale-110 transition-transform">
                                 <PlusCircle className="mx-auto text-gray-700 mb-2" size={32} />
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Click to Upload</span>
                              </div>
                           )}
                           <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                        </label>
                     </div>
                  </div>

                  <div className="space-y-6 flex flex-col">
                     <div className="space-y-2 flex-grow">
                        <div className="flex justify-between items-center mb-4">
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Features (What's included)</label>
                           <button type="button" onClick={addFeature} className="text-[10px] bg-primary/20 text-primary font-black px-3 py-1 rounded-full border border-primary/20 hover:bg-primary hover:text-black transition-all">+ ADD</button>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                           {features.map((f, i) => (
                              <div key={i} className="flex gap-2">
                                 <input value={f} onChange={e => updateFeature(i, e.target.value)} type="text" placeholder="Featured item..." className="flex-grow bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-primary/50" />
                                 <button type="button" onClick={() => removeFeature(i)} className="p-3 glass rounded-xl text-red-500 hover:bg-red-500/20"><Trash2 size={14}/></button>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                        <input id="active" type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-primary bg-black" />
                        <label htmlFor="active" className="text-xs font-bold text-gray-300">Active Package</label>
                     </div>

                     <button type="submit" className="w-full btn-primary py-5 text-lg shadow-neon flex items-center justify-center gap-3">
                        <Save size={20} /> {currentPkg ? 'Update Package' : 'Create Package'}
                     </button>
                  </div>
               </form>
            </motion.div>
         </div>
      )}
    </div>
  );
}
