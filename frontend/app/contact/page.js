'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, MessageCircle, Clock, ChevronRight, CornerDownRight } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';

const CONTACT_INFO = [
  {
    title: 'Call Us',
    value: '+94 77 706 1718',
    icon: Phone,
    link: 'tel:+94777061718',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    title: 'Email Us',
    value: 'mrphoto444@gmail.com',
    icon: Mail,
    link: 'mailto:mrphoto444@gmail.com',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    title: 'Visit Us',
    value: 'Colombo, Sri Lanka',
    icon: MapPin,
    link: 'https://maps.google.com',
    color: 'text-red-400',
    bg: 'bg-red-400/10',
  },
];

const WORKING_HOURS = [
  { day: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 5:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

export default function Contact() {
  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
         <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[4px] mb-4">
              <MessageCircle size={14} /> Get In Touch
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
               Let&apos;s Build Your <br />
               <span className="text-primary italic">Perfect Memory.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
               Whether it&apos;s a vintage photo restoration or a custom gift package, our team is ready to help you every step of the way. Chat with us now!
            </p>
            <div className="pt-6">
               <Link 
                href="https://wa.me/94777061718" 
                className="btn-primary inline-flex items-center gap-4 px-10 py-5 text-xl rounded-[20px] shadow-neon-xl group"
              >
                 Chat on WhatsApp <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
               </Link>
            </div>
         </div>

         <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-primary/20 blur-[150px] -z-10" />
            <GlassCard className="p-0 overflow-hidden h-[400px] md:h-[500px] border-primary/20 relative group">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.5858597401!2d79.786164!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1712140000000!5m2!1sen!2slk" 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'invert(100%) hue-rotate(180deg) brightness(0.6)' }} 
                allowFullScreen="" 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 glass rounded-2xl border-white/10 backdrop-blur-2xl">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                       <MapPin size={24} />
                    </div>
                    <div>
                       <h4 className="text-white font-bold text-lg leading-tight tracking-tight">Main Studio</h4>
                       <p className="text-gray-400 text-xs uppercase tracking-widest font-black">Colombo, Sri Lanka</p>
                    </div>
                 </div>
              </div>
            </GlassCard>
         </div>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
         {CONTACT_INFO.map((item, idx) => (
           <Link key={idx} href={item.link} className="block group">
              <GlassCard className="flex items-center gap-6 p-8 border-white/5 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${item.bg} ${item.color}`}>
                    <item.icon size={30} />
                 </div>
                 <div className="overflow-hidden">
                    <h4 className="text-gray-500 text-[10px] uppercase font-bold tracking-[3px] mb-1">{item.title}</h4>
                    <p className="text-white font-black text-lg truncate group-hover:text-primary transition-colors">{item.value}</p>
                 </div>
              </GlassCard>
           </Link>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
         {/* Working Hours */}
         <div>
            <div className="flex items-center gap-3 text-white font-black text-2xl mb-8 tracking-tighter">
               <Clock size={28} className="text-primary" />
               <h2>Working Hours</h2>
            </div>
            <div className="space-y-4">
               {WORKING_HOURS.map((item, idx) => (
                 <div key={idx} className="flex justify-between items-center p-5 glass border-white/5 rounded-2xl hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-3">
                       <CornerDownRight size={16} className="text-primary opacity-50 group-hover:opacity-100" />
                       <span className="text-gray-300 font-medium">{item.day}</span>
                    </div>
                    <span className="text-white font-black tracking-tight">{item.hours}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Social Connect */}
         <div>
            <div className="flex items-center gap-3 text-white font-black text-2xl mb-8 tracking-tighter">
               <Instagram size={28} className="text-primary" />
               <h2>Social Connect</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <Link href="https://facebook.com" className="group">
                  <GlassCard className="p-6 text-center border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-600/40 transition-all">
                     <Facebook size={32} className="mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform" />
                     <span className="block text-white font-bold text-sm">Facebook</span>
                     <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">/mrphoto.lk</span>
                  </GlassCard>
               </Link>
               <Link href="https://instagram.com" className="group">
                  <GlassCard className="p-6 text-center border-white/5 group-hover:bg-pink-600/10 group-hover:border-pink-600/40 transition-all">
                     <Instagram size={32} className="mx-auto mb-4 text-pink-600 group-hover:scale-110 transition-transform" />
                     <span className="block text-white font-bold text-sm">Instagram</span>
                     <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">@mrphoto.studio</span>
                  </GlassCard>
               </Link>
            </div>
            <div className="mt-4">
              <Link href="https://twitter.com" className="group">
                  <GlassCard className="p-6 flex items-center justify-center gap-4 border-white/5 group-hover:bg-sky-400/10 group-hover:border-sky-400/40 transition-all">
                     <Twitter size={24} className="text-sky-400" />
                     <span className="text-white font-bold">Follow our latest work on Twitter</span>
                     <ChevronRight size={18} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </GlassCard>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
