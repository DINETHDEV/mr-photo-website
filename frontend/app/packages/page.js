'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check, Star, Zap, Sparkles, Heart, Camera, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { fetchData } from '@/utils/api';

const defaultPackages = [
  {
    _id: 'pkg1',
    name: 'Birthday Special',
    price: '4,500',
    description: 'Perfect for celebrating a loved one’s big day with style.',
    icon: Gift,
    color: 'from-pink-500 to-rose-500',
    features: [
      'A4 Premium Photo Print',
      'Wooden Frame (Matte Finish)',
      'Digital Retouching',
      'Birthday Wish Card Included',
      'Free Background Enhancement'
    ],
    image: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'pkg2',
    name: 'Couple Memory Kit',
    price: '7,500',
    description: 'Capture your love story in a beautiful wooden box frame.',
    icon: Heart,
    color: 'from-red-500 to-orange-500',
    popular: true,
    features: [
      'A3 Large Canvas Print',
      'Premium Box Frame',
      'Advance Color Grading',
      'Customized Message Printed',
      'High-Res Digital Copy'
    ],
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'pkg3',
    name: 'Legacy Restore',
    price: '12,000',
    description: 'The ultimate restoration package for your oldest ancestors.',
    icon: Sparkles,
    color: 'from-amber-500 to-yellow-600',
    features: [
      'Full B&W to Color Conversion',
      'Extreme Damage Repair',
      '2x A4 Prints + 1x A3 Print',
      '3 Premium Glass Frames',
      'Free Shipping Islandwide'
    ],
    image: 'https://images.unsplash.com/photo-1582213706173-def380489953?auto=format&fit=crop&q=80&w=800'
  }
];

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPackages = async () => {
      const data = await fetchData('packages');
      setPackages(data && data.length > 0 ? data : defaultPackages);
      setLoading(false);
    };
    loadPackages();
  }, []);

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[120px] -z-10" />
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[4px] mb-6">
          <Gift size={14} /> Gift Collections
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white mb-6">Premium <span className="text-primary italic">Gift Packages</span></h1>
        <p className="max-w-xl mx-auto text-gray-400 text-lg">
           Specially curated bundles to save you money and deliver the most impactful photo experiences.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, idx) => (
          <GlassCard 
            key={pkg._id} 
            className={`relative flex flex-col h-full border-2 ${pkg.popular ? 'border-primary/40 shadow-neon scale-105 z-10' : 'border-white/5 opacity-90 hover:opacity-100 hover:scale-105 transition-all'}`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full shadow-neon flex items-center gap-2">
                <Star size={12} fill="currentColor" /> Most Popular <Star size={12} fill="currentColor" />
              </div>
            )}

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-black/40">
               <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${pkg.color || 'from-primary to-orange-600'} rounded-bl-[40px] flex items-center justify-center p-4 shadow-xl`}>
                  <Camera size={24} className="text-white" />
               </div>
            </div>

            <h3 className="text-2xl font-black text-white mb-2">{pkg.name}</h3>
            <p className="text-gray-500 text-sm italic mb-6 leading-relaxed">&ldquo;{pkg.description}&rdquo;</p>

            <div className="space-y-3 mb-8 flex-grow">
               {pkg.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3">
                     <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 shrink-0">
                        <Check className="text-primary" size={12} strokeWidth={4} />
                     </div>
                     <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{feature}</span>
                  </div>
               ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
               <div>
                  <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold">Price</span>
                  <div className="flex items-baseline gap-1">
                     <span className="text-primary text-2xl font-black tracking-tighter">LKR {pkg.price}</span>
                  </div>
               </div>
               <Link 
                href={`/order?package=${pkg._id}`} 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${pkg.popular ? 'bg-primary text-black shadow-neon' : 'glass text-primary border-primary/20 hover:bg-primary/20'}`}
              >
                Order Now <ArrowRight size={16} />
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Package Guarantee */}
      <div className="mt-24 text-center">
         <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-2xl border-white/5 text-gray-400 text-sm">
            <Zap className="text-primary" size={18} />
            <span>Fast turnaround on all gift packages. Typically ready in 48 hours.</span>
         </div>
      </div>
    </div>
  );
}
