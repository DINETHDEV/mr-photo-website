'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Briefcase, Ruler, Image as ImageIcon, Sparkles, Printer } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { fetchData } from '@/utils/api';

const defaultServices = [
  {
    category: 'Photo Restoration',
    icon: Sparkles,
    color: 'text-blue-400',
    items: [
      { name: 'Basic Restoration', price: '1,500', note: 'Scratch removal, color fix' },
      { name: 'Advanced Restoration', price: '3,500', note: 'Heavy damage, missing parts' },
      { name: 'Colorization', price: '2,000', note: 'B&W to full color' },
    ]
  },
  {
    category: 'Photo Design',
    icon: ImageIcon,
    color: 'text-purple-400',
    items: [
      { name: 'Background Removal', price: '500', note: 'Transparent or solid color' },
      { name: 'Digital Enhancement', price: '1,000', note: 'Skin retouching, lighting' },
      { name: 'Custom Collage', price: '2,500', note: 'Multiple photos into one' },
    ]
  },
  {
    category: 'Printing & Sizes',
    icon: Printer,
    color: 'text-orange-400',
    items: [
      { name: '4" x 6" (Passport)', price: '200', note: 'High quality glossy/matte' },
      { name: 'A4 Size Print', price: '800', note: 'Standard document size' },
      { name: 'A3 Size Print', price: '1,500', note: 'Large poster size' },
    ]
  },
  {
    category: 'Frames & Laminating',
    icon: Ruler,
    color: 'text-emerald-400',
    items: [
      { name: 'Laminating (A4)', price: '300', note: 'Heat sealed protection' },
      { name: 'Wooden Frame (A4)', price: '1,200', note: 'Premium wood finish' },
      { name: 'Box Frame (A3)', price: '3,000', note: 'Deep gallery style' },
    ]
  }
];

export default function Services() {
  const [dbServices, setDbServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchData('products');
      setDbServices(data || []);
      setLoading(false);
    };
    loadServices();
  }, []);

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[4px] mb-6">
          <Briefcase size={14} /> Our Offerings
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white mb-6">Services & <span className="text-primary italic">Pricing</span></h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg">
          Transparent pricing for premium results. We use the finest materials and latest software to ensure your photos last a lifetime.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {defaultServices.map((section, idx) => (
          <GlassCard key={idx} className="relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors ${section.color}`}>
                <section.icon size={28} />
              </div>
              <h2 className="text-2xl font-bold font-white">{section.category}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group/item">
                   <div className="flex flex-col">
                      <span className="text-white font-medium group-hover/item:text-primary transition-colors">{item.name}</span>
                      <span className="text-xs text-gray-500 font-medium italic">{item.note}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-primary font-black tracking-tighter">LKR {item.price}</span>
                      <Check className="text-primary/20 group-hover/item:text-primary transition-colors" size={16} />
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                  <Info size={14} className="text-primary" />
                  <span>Custom sizes available</span>
               </div>
               <button className="text-primary text-xs font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all">
                  Request Quote
               </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Note about quality */}
      <div className="mt-20 glass p-8 rounded-[30px] border-primary/10 flex flex-col md:flex-row items-center gap-8">
         <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
            <Sparkles size={40} />
         </div>
         <div>
            <h3 className="text-2xl font-bold text-white mb-2">The &ldquo;Mr. Photo&rdquo; Standard</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
               Every service we provide includes a secondary quality inspection. We don&apos;t just print; we ensure the lighting, color balance, and sharpness are perfect before the final output. Value for every customer isn&apos;t just a tagline—it&apos;s our promise.
            </p>
         </div>
      </div>
    </div>
  );
}
