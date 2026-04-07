'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  User, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Sparkles,
  Image as ImageIcon,
  Package as PackageIcon,
  X,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import { fetchData, postData } from '@/utils/api';

function OrderFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPackageId = searchParams.get('packageId') || searchParams.get('package');
  const initialProductId = searchParams.get('productId') || searchParams.get('product');

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [packages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    serviceType: initialPackageId ? 'package' : (initialProductId ? 'individual' : 'individual'),
    packageId: initialPackageId || '',
    productId: initialProductId || '',
    uploadedImage: '',
    message: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [pkgs, prods] = await Promise.all([
          fetchData('packages'),
          fetchData('products')
        ]);
        setPackages(pkgs || []);
        setProducts(prods || []);
      } catch (error) {
        toast.error("Failed to load options");
      } finally {
        setFetchingData(false);
      }
    };
    loadInitialData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'ml_default'); // Fallback preset
    data.append('cloud_name', 'dguist2qh');

    try {
      const resp = await fetch(
        `https://api.cloudinary.com/v1_1/dguist2qh/image/upload`,
        { method: 'POST', body: data }
      );
      const res = await resp.json();
      setFormData(prev => ({ ...prev, uploadedImage: res.secure_url }));
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Image upload failed");
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedProduct = products.find(p => p._id === formData.productId);
    const selectedPackage = packages.find(p => p._id === formData.packageId);
    
    const isFrameOnly = (selectedProduct?.category === 'frame only') || 
                      (selectedProduct?.name?.toLowerCase().includes('frame only')) ||
                      (selectedPackage?.name?.toLowerCase().includes('frame only'));

    if (!isFrameOnly && !formData.uploadedImage) {
      toast.error("Please upload your photo first");
      return;
    }

    setLoading(true);
    try {
      await postData('orders', formData);
      toast.success("Order placed successfully! We will contact you soon.");
      router.push('/');
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[4px]"
        >
          <ShoppingBag size={14} /> Secure Ordering
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-white italic tracking-tighter"
        >
          BRING MEMORIES TO <span className="text-primary italic underline decoration-primary/20 underline-offset-8">LIFE.</span>
        </motion.h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <GlassCard className="p-8 md:p-10 border-primary/10 shadow-neon">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-primary uppercase tracking-[5px] flex items-center gap-2">
                  <User size={14} /> Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
                        value={formData.customerName}
                        onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:border-primary/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                      <input 
                        type="tel" 
                        required
                        placeholder="071 234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:border-primary/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-primary/50" size={18} />
                      <textarea 
                        required
                        placeholder="Enter your full address for frame delivery..."
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:border-primary/50 outline-none transition-all h-24 resize-none"
                      />
                    </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <h3 className="text-xs font-black text-primary uppercase tracking-[5px] flex items-center gap-2">
                  <Sparkles size={14} /> Service Selection
                </h3>

                 <div className="grid grid-cols-2 gap-4">
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, serviceType: 'individual', packageId: ''})}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${formData.serviceType === 'individual' ? 'bg-primary/10 border-primary shadow-neon-sm' : 'bg-white/5 border-white/10 text-gray-500'}`}
                   >
                     <ImageIcon size={20} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-center">Individual Service</span>
                   </button>
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, serviceType: 'package', productId: ''})}
                    className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${formData.serviceType === 'package' ? 'bg-primary/10 border-primary shadow-neon-sm' : 'bg-white/5 border-white/10 text-gray-500'}`}
                   >
                     <PackageIcon size={20} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-center">Gift Package</span>
                   </button>
                </div>

                <AnimatePresence mode="wait">
                  {formData.serviceType === 'individual' && (
                    <motion.div 
                      key="individual"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Service</label>
                       <div className="relative">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                          <select 
                            required={formData.serviceType === 'individual'}
                            value={formData.productId}
                            onChange={(e) => setFormData({...formData, productId: e.target.value})}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-white text-sm focus:border-primary/50 outline-none transition-all appearance-none"
                          >
                             <option value="" disabled>Choose a service...</option>
                             {products.map(p => (
                               <option key={p._id} value={p._id} className="bg-black py-2">{p.name} - LKR {p.price.toLocaleString()}</option>
                             ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                             <ArrowRight size={14} className="rotate-90 text-gray-500" />
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {formData.serviceType === 'package' && (
                    <motion.div 
                      key="package"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Package</label>
                       <div className="relative">
                          <PackageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                          <select 
                            required={formData.serviceType === 'package'}
                            value={formData.packageId}
                            onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 pl-12 pr-10 text-white text-sm focus:border-primary/50 outline-none transition-all appearance-none"
                          >
                             <option value="" disabled>Choose a package...</option>
                             {packages.map(p => (
                               <option key={p._id} value={p._id} className="bg-black py-2">{p.name} - LKR {p.price.toLocaleString()}</option>
                             ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                             <ArrowRight size={14} className="rotate-90 text-gray-500" />
                          </div>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Special Instructions</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-primary/50" size={18} />
                      <textarea 
                        placeholder="Any specific requests for restoration?"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:border-primary/50 outline-none transition-all h-24 resize-none"
                      />
                    </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading || uploading}
                className="w-full btn-primary py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-neon flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all hover:scale-[1.02]"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Confirm Order <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        </motion.div>

        {/* Right Column: Image Upload Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="space-y-4">
             <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
               Upload Photo {(() => {
                 const selectedProduct = products.find(p => p._id === formData.productId);
                 const selectedPackage = packages.find(p => p._id === formData.packageId);
                 const isFrameOnly = (selectedProduct?.category === 'frame only') || 
                                   (selectedProduct?.name?.toLowerCase().includes('frame only')) ||
                                   (selectedPackage?.name?.toLowerCase().includes('frame only'));
                 return isFrameOnly ? <span className="text-primary/60 lowercase italic">(Optional)</span> : "";
               })()}
             </h3>
             <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                  disabled={uploading}
                />
                <label 
                  htmlFor="imageUpload"
                  className={`relative block aspect-[4/5] rounded-[40px] border-2 border-dashed transition-all cursor-pointer overflow-hidden group/upload ${imagePreview ? 'border-primary/50' : 'border-white/10 hover:border-primary/30 bg-white/5'}`}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                        <Upload size={32} className="animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4 p-8 text-center">
                       <div className="w-20 h-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:text-primary transition-all">
                          <ImageIcon size={32} />
                       </div>
                       <div className="space-y-1">
                          <span className="text-white font-bold text-sm block">Click to Upload</span>
                          <span className="text-[10px] uppercase font-bold tracking-widest">JPG, PNG up to 10MB</span>
                       </div>
                    </div>
                  )}

                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-primary gap-3">
                       <Loader2 className="animate-spin" size={40} />
                       <span className="text-[10px] font-black uppercase tracking-[3px] animate-pulse">Uploading...</span>
                    </div>
                  )}
                </label>

                {formData.uploadedImage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 text-black rounded-full flex items-center justify-center shadow-neon border-4 border-black"
                  >
                    <CheckCircle2 size={24} />
                  </motion.div>
                )}
             </div>
          </div>

          <GlassCard className="p-6 border-white/5 bg-white/[0.02] space-y-4">
             <div className="flex items-center gap-3 text-primary">
                <ShieldCheck size={18} />
                <h4 className="font-bold text-sm text-white">Why Choose Mr. Photo?</h4>
             </div>
             <ul className="space-y-3">
                {[
                  'Professional Manual Restoration',
                  'High-Resolution Digital Scan',
                  'Premium Color Balancing',
                  'Archival Grade Printing',
                  '100% Satisfaction Guarantee'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[10px] text-gray-400 font-medium italic">
                    <Sparkles size={12} className="text-primary mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
             </ul>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      }>
        <OrderFormContent />
      </Suspense>
    </div>
  );
}

function ShieldCheck({ size, className }) {
   return (
     <svg 
       width={size} 
       height={size} 
       viewBox="0 0 24 24" 
       fill="none" 
       stroke="currentColor" 
       strokeWidth="2" 
       strokeLinecap="round" 
       strokeLinejoin="round" 
       className={className}
     >
       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
       <path d="m9 12 2 2 4-4" />
     </svg>
   );
}
