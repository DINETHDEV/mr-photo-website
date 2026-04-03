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
  Phone
} from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { fetchData } from '@/utils/api';

const categoryIcons = {
  'restoration': Sparkles,
  'design': ImageIcon,
  'printing': Printer,
  'frame': Ruler,
  'laminating': Info,
  'default': Briefcase
};

const categoryColors = {
  'restoration': 'text-blue-400',
  'design': 'text-purple-400',
  'printing': 'text-orange-400',
  'frame': 'text-emerald-400',
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
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[4px] mb-6">
          <Briefcase size={14} /> Official Price List
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white mb-6">Services & <span className="text-primary italic">Pricing</span></h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg">
          Explore our professional photo restoration and printing services. Our prices are transparent and tailored to deliver the highest quality.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((catName, idx) => {
            const Icon = categoryIcons[catName] || categoryIcons.default;
            const colorClass = categoryColors[catName] || categoryColors.default;
            const items = groupedServices[catName];

            return (
              <GlassCard key={idx} className="relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors ${colorClass}`}>
                    <Icon size={28} />
                  </div>
                  <h2 className="text-2xl font-bold text-white capitalize">{catName}</h2>
                </div>

                <div className="space-y-4">
                  {items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group/item">
                       <div className="flex flex-col">
                          <span className="text-white font-medium group-hover/item:text-primary transition-colors">{item.name}</span>
                          <span className="text-xs text-gray-500 font-medium italic">{item.description || 'Professional processing included'}</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-primary font-black tracking-tighter">LKR {item.price.toLocaleString()}</span>
                          <Check className="text-primary/20 group-hover/item:text-primary transition-colors" size={16} />
                       </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                      <Info size={14} className="text-primary" />
                      <span>Inquire for custom sizes</span>
                   </div>
                   <Link href="/contact" className="text-primary text-xs font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">
                      Request Quote
                   </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-[50px] border-dashed border-white/10 max-w-2xl mx-auto">
           <Sparkles size={64} className="mx-auto text-primary/20 mb-8" />
           <h3 className="text-3xl font-black text-white mb-4">Under <span className="text-primary italic">Optimization</span></h3>
           <p className="text-gray-400 text-lg mb-8 px-8 leading-relaxed">
             We are currently updating our price list to serve you better. For immediate pricing info, please contact us directly.
           </p>
           <Link href="/contact" className="btn-primary inline-flex items-center gap-3 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-neon">
             Contact Support <ArrowRight size={18} />
           </Link>
        </div>
      )}

      {/* Note about quality */}
      <div className="mt-20 glass p-8 rounded-[30px] border-primary/10 flex flex-col md:flex-row items-center gap-8">
         <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
            <Phone size={40} />
         </div>
         <div>
            <h3 className="text-2xl font-bold text-white mb-2">Need a Custom Package?</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
               If you have a large batch of photos for restoration or need custom-sized frames, we offer bulk discounts. Contact Mr. Photo directly on WhatsApp or call our hotline for more information.
            </p>
         </div>
      </div>
    </div>
  );
}
