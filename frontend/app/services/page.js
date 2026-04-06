'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Info, 
  Briefcase, 
  Ruler, 
  Image as ImageIcon, 
  Sparkles, 
  Printer, 
  Loader2, 
  ArrowRight,
  Phone,
  Package
} from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { fetchData } from '@/utils/api';

const categoryIcons = {
  'restoration': Sparkles,
  'design': ImageIcon,
  'printing': Printer,
  'frame': Ruler,
  'frames': Ruler,
  'frame only': Ruler,
  'full package': Package,
  'laminating': Info,
  'default': Briefcase
};

const categoryColors = {
  'restoration': 'text-blue-400',
  'design': 'text-purple-400',
  'printing': 'text-orange-400',
  'frame': 'text-emerald-400',
  'frames': 'text-emerald-400',
  'frame only': 'text-emerald-400',
  'full package': 'text-primary',
  'default': 'text-primary'
};

export default function Services() {
  const [dbServices, setDbServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchData('products');
        setDbServices(data || []);
      } catch (error) {
        console.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  // Group services by category
  const groupedServices = dbServices.reduce((acc, product) => {
    const cat = product.category.toLowerCase();
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  const categories = Object.keys(groupedServices);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[4px] mb-8">
          <Briefcase size={14} /> Official Price List
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 uppercase italic tracking-tighter">Services & <span className="text-primary italic">Pricing</span></h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed px-4">
          Explore our professional photo restoration and printing services. Our prices are transparent and tailored to deliver the highest quality.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {categories.map((catName, idx) => {
            const Icon = categoryIcons[catName] || categoryIcons.default;
            const colorClass = categoryColors[catName] || categoryColors.default;
            const items = groupedServices[catName];

            return (
              <GlassCard key={idx} className="relative overflow-hidden group p-4 sm:p-8">
                <div className="flex items-center gap-4 mb-8 sm:mb-10">
                  <div className={`p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors ${colorClass}`}>
                    <Icon size={24} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white capitalize italic tracking-tight">{catName}</h2>
                </div>

                <div className="space-y-3">
                  {items.map((item, iIdx) => (
                    <Link 
                      key={iIdx} 
                      href={`/products?id=${item._id}`}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-[24px] hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group/item cursor-pointer glass-card-sm"
                    >
                       <div className="flex items-center gap-3 sm:gap-4 flex-grow min-w-0">
                          {item.image ? (
                             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 shrink-0 shadow-lg group-hover/item:border-primary/20 transition-all">
                                <img src={item.image} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" alt={item.name} />
                             </div>
                          ) : (
                             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-gray-700">
                                <ImageIcon size={20} />
                             </div>
                          )}
                          <div className="flex flex-col min-w-0 gap-0.5">
                             <span className="text-white text-sm sm:text-base md:text-lg font-black group-hover/item:text-primary transition-colors line-clamp-2 leading-tight tracking-tight italic uppercase">
                                {item.name}
                             </span>
                             <span className="text-[8px] sm:text-[9px] text-gray-500 font-black uppercase tracking-[2px] line-clamp-1 opacity-60">
                                {item.description || 'Professional processing'}
                             </span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-white/5">
                          <div className="flex flex-col items-end">
                             <span className="text-[7px] sm:text-[8px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">From</span>
                             <span className="text-primary font-black tracking-tighter text-sm sm:text-lg whitespace-nowrap">LKR {item.price.toLocaleString()}</span>
                          </div>
                          <div className="hidden sm:flex w-8 h-8 rounded-full bg-primary/10 items-center justify-center text-primary translate-x-2 group-hover/item:translate-x-0 opacity-0 group-hover/item:opacity-100 transition-all">
                             <ArrowRight size={14} />
                          </div>
                       </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-8 sm:mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                   <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[4px]">
                      <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                      <span>Custom sizes available</span>
                   </div>
                   <Link href="/contact" className="w-full sm:w-auto text-center px-6 py-2 rounded-full glass border-white/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
                      Inquire
                   </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-[40px] border-dashed border-white/10 max-w-2xl mx-auto px-6">
           <Sparkles size={64} className="mx-auto text-primary/20 mb-8" />
           <h3 className="text-3xl font-black text-white mb-4">Under <span className="text-primary italic">Optimization</span></h3>
           <p className="text-gray-400 text-lg mb-8 leading-relaxed italic">
             We are currently updating our price list to serve you better.
           </p>
           <Link href="/contact" className="btn-primary inline-flex items-center gap-3 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-neon">
             Contact Support <ArrowRight size={18} />
           </Link>
        </div>
      )}

      {/* Note about quality */}
      <div className="mt-16 sm:mt-24 glass p-8 sm:p-12 rounded-[40px] border-primary/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
         <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 shadow-neon-sm">
            <Phone size={40} />
         </div>
         <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight italic uppercase">Need a Custom Package?</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl font-medium">
               If you have a large batch of photos for restoration or need custom-sized frames, we offer bulk discounts. Contact Mr. Photo directly for more information.
            </p>
         </div>
      </div>
    </div>
  );
}
