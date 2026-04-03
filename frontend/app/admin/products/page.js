'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Loader2,
  DollarSign,
  Tag,
  Save,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import { fetchAdminData, postAdminData, putAdminData, deleteAdminData } from '@/utils/adminApi';

const categories = ['restoration', 'design', 'frames', 'printing', 'laminating'];

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'restoration',
    price: '',
    description: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchAdminData('products/all');
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load services");
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description || '',
        isActive: product.isActive
      });
      setImagePreview(product.image || null);
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        category: 'restoration',
        price: '',
        description: '',
        isActive: true
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('isActive', formData.isActive);
    if (imageFile) data.append('image', imageFile);

    try {
      if (currentProduct) {
        await putAdminData(`products/${currentProduct._id}`, data, true);
        toast.success("Service updated");
      } else {
        await postAdminData('products', data, true);
        toast.success("New service added");
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteAdminData(`products/${id}`);
        toast.success("Service removed");
        loadProducts();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <Briefcase className="text-primary" size={32} /> 
               Services <span className="text-primary italic">& Products</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your service offerings and pricing list.</p>
         </div>

         <button 
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2 px-6 py-4 rounded-2xl shadow-neon group"
        >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add New Service
         </button>
      </header>

      {/* Search */}
      <div className="relative group max-w-2xl">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
         <input 
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-16 pr-6 text-white focus:border-primary/50 focus:bg-white/10 transition-all outline-none"
         />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredProducts.map((product) => (
            <GlassCard key={product._id} className={`group border-white/5 hover:border-primary/20 ${!product.isActive ? 'opacity-60' : ''}`}>
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 glass rounded-xl text-primary bg-primary/10 overflow-hidden">
                     {product.image ? (
                        <img src={product.image} className="w-full h-full object-cover" alt="Service" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center"><Tag size={20} /></div>
                     )}
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => openModal(product)} className="p-2 glass rounded-lg text-gray-500 hover:text-primary transition-colors hover:border-primary/20"><Edit3 size={16}/></button>
                     <button onClick={() => handleDelete(product._id)} className="p-2 glass rounded-lg text-gray-500 hover:text-red-500 transition-colors hover:border-red-500/20"><Trash2 size={16}/></button>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{product.name}</h3>
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-[3px]">{product.category}</span>
                  </div>

                  <p className="text-gray-400 text-xs line-clamp-2 h-8">{product.description || 'No description provided.'}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                     <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-primary" />
                        <span className="text-lg font-black text-white tracking-tighter">LKR {product.price}</span>
                     </div>
                     <span className={`flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest ${product.isActive ? 'text-emerald-400' : 'text-gray-600'}`}>
                        {product.isActive ? <CheckCircle2 size={12}/> : <XCircle size={12}/>}
                        {product.isActive ? 'Active' : 'Hidden'}
                     </span>
                  </div>
               </div>
            </GlassCard>
         ))}

         {filteredProducts.length === 0 && (
           <div className="col-span-full text-center py-20 glass rounded-[30px] border-dashed border-white/10">
             <Briefcase size={48} className="mx-auto text-gray-700 mb-4" />
             <p className="text-gray-500">No services found.</p>
           </div>
         )}
      </div>

      {/* Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="w-full max-w-lg glass p-8 md:p-10 border-primary/20 shadow-neon relative my-auto"
            >
               <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
               
               <div className="mb-8">
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{currentProduct ? 'Edit' : 'Create'} <span className="text-primary italic">Service</span></h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-[2px] mt-1">Studio Offerings</p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Service Photo</label>
                     <div className="flex items-center gap-4">
                        <div className="w-20 h-20 glass rounded-2xl border-white/10 overflow-hidden relative group shrink-0">
                           {imagePreview ? (
                              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon size={24}/></div>
                           )}
                           <label htmlFor="product-image" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                              <Upload size={18} />
                           </label>
                        </div>
                        <div className="space-y-1">
                           <label htmlFor="product-image" className="text-sm font-bold text-primary cursor-pointer hover:underline">
                              {imagePreview ? 'Change Image' : 'Upload Image'}
                           </label>
                           <p className="text-[10px] text-gray-500 font-bold uppercase">PNG, JPG up to 5MB</p>
                           <input 
                              type="file" 
                              id="product-image" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageChange}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Service Name</label>
                     <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none transition-all"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                        <select 
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                           className="w-full bg-black border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none appearance-none cursor-pointer"
                        >
                           {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (LKR)</label>
                        <input 
                           type="number" 
                           required
                           value={formData.price}
                           onChange={(e) => setFormData({...formData, price: e.target.value})}
                           className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary/50 outline-none h-24 resize-none transition-all"
                     />
                  </div>

                  <div className="flex items-center gap-3 py-2">
                     <input 
                        type="checkbox" 
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="w-5 h-5 accent-primary bg-black border border-white/10 cursor-pointer"
                     />
                     <label htmlFor="isActive" className="text-sm font-bold text-gray-300 cursor-pointer">Active (Visible on website)</label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={btnLoading}
                    className="w-full btn-primary py-4 text-lg shadow-neon flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {btnLoading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
                     {currentProduct ? 'Update Service' : 'Save New Service'}
                  </button>
               </form>
            </motion.div>
         </div>
      )}
    </div>
  );
}
