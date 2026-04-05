'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Info, 
  Loader2, 
  Image as ImageIcon,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { fetchData } from '@/utils/api';

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const data = await fetchData(`products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (!id || !product) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-4xl font-black text-white mb-4">Product Not Found</h1>
      <p className="text-gray-500 mb-8">The service you are looking for does not exist or has been removed.</p>
      <Link href="/services" className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2">
        <ArrowLeft size={18} /> Back to Services
      </Link>
    </div>
  );

  const features = [
    'Premium High-Res Printing',
    'Professional Color Grading',
    'Studio-Quality Retouching',
    'Custom Layout Options'
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[3px] text-gray-500 mb-12">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
        <ChevronRight size={12} />
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group "
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-[100px] -z-10" />
          <GlassCard className="p-2 border-white/10 rounded-[40px] overflow-hidden aspect-square">
            {product.image ? (
              <img 
                src={product.image} 
                className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-110" 
                alt={product.name} 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-white/5 rounded-[32px]">
                <ImageIcon size={120} strokeWidth={1} />
                <p className="text-sm uppercase font-bold tracking-widest mt-4">No Preview Available</p>
              </div>
            )}
            
            <div className="absolute top-8 left-8 flex flex-col gap-3">
               <div className="glass px-4 py-2 rounded-full border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Star size={12} fill="currentColor" /> Premium Service
               </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div>
            <span className="text-primary text-[10px] font-black uppercase tracking-[5px] mb-4 block">{product.category}</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">{product.name}</h1>
            <div className="flex items-center gap-4">
               <div className="text-4xl font-black text-primary tracking-tighter">LKR {product.price?.toLocaleString()}</div>
               <div className="glass px-3 py-1 rounded-lg border-white/10 text-gray-500 text-[10px] uppercase font-bold tracking-widest">Base Price</div>
            </div>
          </div>

          <div className="glass p-8 rounded-[30px] border-white/5 bg-white/[0.02]">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2 italic">
               <Info size={18} className="text-primary" /> Service Description
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg">
               {product.description || `Enhance your memories with our ${product.name} service. We prioritize quality and precision to ensure every pixel tells your story perfectly.`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 glass p-4 rounded-2xl border-white/5">
                   <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-primary" />
                   </div>
                   <span className="text-sm text-gray-300 font-medium">{f}</span>
                </div>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6">
            <Link 
              href={`/order?productId=${product._id}`}
              className="flex-grow btn-primary flex items-center justify-center gap-4 py-6 rounded-3xl shadow-neon text-lg font-black uppercase tracking-widest group"
            >
              Order This Service <Zap size={20} className="group-hover:fill-primary" />
            </Link>
            
            <button 
              onClick={() => router.push('/services')}
              className="px-10 py-6 glass rounded-3xl border-white/10 text-gray-400 font-black uppercase tracking-widest hover:text-white transition-colors"
            >
               Browse All
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center sm:justify-start gap-8 pt-8 border-t border-white/5">
             <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-[2px]">
                <ShieldCheck size={16} className="text-emerald-500" /> Secure Order
             </div>
             <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-[2px]">
                <Zap size={16} className="text-primary" /> Fast Delivery
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}
