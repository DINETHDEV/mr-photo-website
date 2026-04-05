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
  Star,
  Palette
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
      <nav className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-gray-500 mb-10 md:mb-16">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={10} className="text-gray-700" />
        <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
        <ChevronRight size={10} className="text-gray-700" />
        <span className="text-primary truncate max-w-[150px] sm:max-w-none">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group w-full max-w-2xl mx-auto lg:mx-0"
        >
          <div className="absolute -inset-4 bg-primary/20 blur-[100px] -z-10 rounded-full opacity-50" />
          <GlassCard className="p-3 border-white/10 rounded-[40px] overflow-hidden aspect-square shadow-2xl relative z-10">
            {product.image ? (
              <img 
                src={product.image} 
                className="w-full h-full object-cover rounded-[32px] transition-transform duration-1000 group-hover:scale-110" 
                alt={product.name} 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-white/5 rounded-[32px]">
                <ImageIcon size={100} strokeWidth={1} />
                <p className="text-[10px] uppercase font-black tracking-widest mt-4">Image Unavailable</p>
              </div>
            )}
            
            <div className="absolute top-8 left-8">
               <div className="glass px-5 py-2 rounded-full border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-xl shadow-neon-sm">
                  <Star size={12} fill="currentColor" /> Premium
               </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <span className="text-primary text-[10px] font-black uppercase tracking-[6px] block">{product.category}</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter uppercase italic">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-6 pt-4">
               <div className="text-4xl md:text-5xl font-black text-primary tracking-tighter">LKR {product.price?.toLocaleString()}</div>
               <div className="glass px-4 py-1.5 rounded-xl border-white/10 text-gray-500 text-[10px] uppercase font-black tracking-widest">Base Rate</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-orange-600/40 rounded-[35px] blur opacity-20 group-hover:opacity-40 transition-duration-500" />
            <div className="relative glass p-8 sm:p-10 rounded-[35px] border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <h3 className="text-white text-xl md:text-2xl font-black flex items-center gap-4 tracking-tight uppercase italic underline decoration-primary/20 decoration-4 underline-offset-8">
                   Service <span className="text-primary">Info</span>
                </h3>
                <div className="w-fit flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-[2px]">
                  <CheckCircle2 size={12} /> Expert Standard
                </div>
              </div>
              <div className="space-y-8">
                <p className="text-gray-300 leading-relaxed text-base sm:text-lg font-medium opacity-90 whitespace-pre-wrap italic">
                  &ldquo;{product.description || `Experience superior quality with our ${product.name} service. We ensure perfection in every detail.`}&rdquo;
                </p>
                <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-9 h-9 rounded-full border-2 border-black bg-primary/20 flex items-center justify-center shadow-lg">
                        <ImageIcon size={14} className="text-primary" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">Verified Results</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 glass p-5 rounded-2xl border-white/5 hover:border-primary/20 transition-all group/feat">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover/feat:bg-primary group-hover/feat:text-black transition-all">
                      <CheckCircle2 size={16} className="text-primary group-hover/feat:text-inherit" />
                   </div>
                   <span className="text-xs text-gray-300 font-black uppercase tracking-widest">{f}</span>
                </div>
             ))}
          </div>

          <div className="glass p-6 rounded-[24px] border-white/5 mt-2">
            <h4 className="text-white text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Palette size={14} className="text-primary" /> Available Frame Colors
            </h4>
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { name: 'Black', color: '#0a0a0a', border: 'border-white/20', extra: null },
                { name: 'White', color: '#f5f5f5', border: 'border-black/20', extra: null },
                { name: 'Brown', color: '#7c4a1e', border: 'border-amber-800/30', extra: '+ Rs. 300' }
              ].map((frame, idx) => (
                <div key={idx} className={`flex items-center gap-3 pr-4 p-1.5 rounded-full border transition-all ${frame.extra ? 'bg-amber-950/30 border-amber-600/30 hover:border-amber-500/60' : 'bg-white/5 border-white/5 hover:border-primary/30'}`}>
                  <div className={`w-6 h-6 rounded-full shadow-inner border-2 ${frame.border} shrink-0`} style={{ backgroundColor: frame.color }}></div>
                  <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{frame.name}</span>
                  {frame.extra && (
                    <span className="text-[9px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">{frame.extra}</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-500 font-medium italic flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block shrink-0"></span>
              Custom frame colors available on request — contact us for your preferred shade.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href={`/order?productId=${product._id}`}
              className="flex-grow btn-primary flex items-center justify-center gap-4 py-5 rounded-[24px] shadow-neon text-sm font-black uppercase tracking-[4px] group order-1 sm:order-2"
            >
              Order Now <Zap size={18} className="group-hover:fill-primary" />
            </Link>
            
            <button 
              onClick={() => router.push('/services')}
              className="px-10 py-5 glass rounded-[24px] border-white/10 text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-all order-2 sm:order-1 text-[10px]"
            >
               Back
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center sm:justify-start gap-10 pt-8 border-t border-white/5">
             <div className="flex items-center gap-2.5 text-gray-500 text-[9px] font-black uppercase tracking-[3px]">
                <ShieldCheck size={18} className="text-emerald-500" /> Secure
             </div>
             <div className="flex items-center gap-2.5 text-gray-500 text-[9px] font-black uppercase tracking-[3px]">
                <Zap size={18} className="text-primary fill-primary/20" /> Fast
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
