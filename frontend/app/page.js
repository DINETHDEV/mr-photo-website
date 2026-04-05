'use client';

import { motion } from 'framer-motion';
import { 
  Camera, 
  Sparkles, 
  Image as ImageIcon, 
  Layers, 
  Palette, 
  ShieldCheck, 
  ArrowRight,
  Printer,
  History
} from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "Photo Restoration",
      desc: "Breathe new life into your old, damaged, or faded photographs with our advanced restoration service.",
      color: "text-blue-400"
    },
    {
      icon: Palette,
      title: "Digital Design",
      desc: "Professional retouching, background removal, and digital enhancements tailored to your needs.",
      color: "text-purple-400"
    },
    {
      icon: Printer,
      title: "Premium Prints",
      desc: "High-quality archival printing on various paper types and sizes for lasting memories.",
      color: "text-orange-400"
    },
    {
      icon: ShieldCheck,
      title: "Quality Frames",
      desc: "A wide selection of elegant wooden and premium frames to perfectly showcase your photos.",
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[4px]">
               <Camera size={14} /> Premier Photo Studio
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter">
              VALUE FOR <br />
              EVERY <span className="text-primary italic">CUSTOMER.</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed">
              Experience prestige photo restoration, customized digital design, and premium framing services in Sri Lanka. We preserve your precious memories forever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services" className="btn-primary flex items-center justify-center gap-2 px-8 py-5 rounded-2xl font-bold shadow-neon group w-full sm:w-auto">
                Explore Services <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/portfolio" className="glass hover:bg-white/5 transition-all text-white px-8 py-5 rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-2 w-full sm:w-auto">
                View Portfolio
              </Link>
            </div>

            <div className="grid grid-cols-3 md:flex items-center gap-4 md:gap-8 pt-6 border-t border-white/5">
               <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black text-white">15+</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest">Experience</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black text-white">10k+</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest">Clients</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black text-white">24h</span>
                  <span className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest">Delivery</span>
               </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1 }}
            className="hidden sm:block lg:perspective-1000"
          >
            <div className="relative glass border-primary/10 rounded-[40px] p-6 lg:p-10 overflow-hidden lg:transform-style-3d group">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />
                
                <div className="relative z-10 grid grid-cols-2 gap-4">
                   <div className="space-y-4">
                      <div className="h-32 lg:h-48 glass rounded-3xl border-white/5 flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-500">
                         <History className="text-primary w-8 h-8 lg:w-12 lg:h-12" />
                      </div>
                      <div className="h-48 lg:h-64 glass rounded-3xl border-white/5 flex flex-col items-center justify-center p-4 lg:p-6 space-y-4 group/card">
                         <Layers className="text-blue-400 w-8 h-8 lg:w-10 lg:h-10 group-hover/card:scale-110 transition-transform" />
                         <span className="text-[8px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Multi-layer Restoration</span>
                      </div>
                   </div>
                   <div className="space-y-4 pt-8">
                      <div className="h-48 lg:h-64 glass rounded-3xl border-white/5 flex flex-col items-center justify-center p-4 lg:p-6 space-y-4 group/card">
                         <ImageIcon className="text-purple-400 w-8 h-8 lg:w-10 lg:h-10 group-hover/card:scale-110 transition-transform" />
                         <span className="text-[8px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">High-Res Scanning</span>
                      </div>
                      <div className="h-32 lg:h-48 glass rounded-3xl border-white/5 border-primary/20 flex items-center justify-center p-6 group/card">
                         <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover/card:bg-primary group-hover/card:text-black transition-all">
                           <Camera className="w-6 h-6 lg:w-8 lg:h-8" />
                         </div>
                      </div>
                   </div>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-black text-primary uppercase tracking-[5px]">Expertise</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">Everything For Your <span className="text-primary">Photos.</span></h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <GlassCard key={i} className="group hover:border-primary/30 transition-all border-white/5 p-8 flex flex-col gap-6">
                <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${f.color}`}>
                  <f.icon size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{f.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto glass p-10 sm:p-12 md:p-20 rounded-[40px] sm:rounded-[50px] border-primary/20 relative z-10 text-center space-y-8 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase">READY TO BRING <br /> MEMORIES TO <span className="text-primary italic underline decoration-primary/20 underline-offset-8">LIFE?</span></h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Our experts are waiting to handle your precious photos with extreme care and professionalism. Get started today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
               <Link href="/services" className="btn-primary w-full sm:w-auto px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-neon">
                  Order Now
               </Link>
               <Link href="/contact" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-widest">
                  Let&apos;s Talk
               </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
