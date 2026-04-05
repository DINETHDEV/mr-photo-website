'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Camera, Home, Image as ImageIcon, Briefcase, Package, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Portfolio', href: '/portfolio', icon: ImageIcon },
  { name: 'Services', href: '/services', icon: Briefcase },
  { name: 'Packages', href: '/packages', icon: Package },
  { name: 'Order Now', href: '/order', icon: Camera },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-3 glass-card border-none rounded-none border-b border-white/5 bg-black/60 shadow-2xl' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform duration-500">
             <img 
               src="/images/logo.png" 
               className="w-full h-full object-contain" 
               alt="MR Photo Logo"
               onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100?text=MR+PHOTO";
               }}
             />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white leading-none uppercase italic">
              MR<span className="text-primary">.PHOTO</span>
            </span>
            <span className="text-[7px] md:text-[8px] font-black text-gray-500 uppercase tracking-[3px] mt-1.5 opacity-80 leading-none">
               Value For Every Customer
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-bold tracking-widest uppercase transition-all hover:text-primary ${
                pathname === link.href ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admin">
             <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary transition-colors">
               <User className="w-4 h-4 text-gray-500 hover:text-primary transition-colors cursor-pointer" />
             </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl glass border-white/10 text-white" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-full left-0 w-full glass-card border-none rounded-none border-t border-white/10 shadow-2xl p-8 flex flex-col gap-2 min-h-[60vh] bg-black/90 backdrop-blur-3xl overflow-y-auto"
          >
            <div className="text-[10px] font-black text-primary uppercase tracking-[5px] mb-4 opacity-50">Navigation</div>
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                    pathname === link.href 
                      ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                      : 'text-gray-300 hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <link.icon size={20} className={pathname === link.href ? 'text-primary' : 'text-gray-500'} />
                    <span className="text-lg font-black tracking-tight uppercase italic">{link.name}</span>
                  </div>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <X size={14} className="rotate-45 text-primary/30" />
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="text-[10px] font-black text-primary uppercase tracking-[5px] mb-6 opacity-50">Connect with us</div>
              <div className="grid grid-cols-2 gap-4">
                 <Link href="/contact" className="glass p-4 rounded-2xl flex flex-col items-center gap-2 border-white/5 hover:border-primary/20 transition-all">
                    <Mail size={20} className="text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Email</span>
                 </Link>
                 <Link href="/admin" className="glass p-4 rounded-2xl flex flex-col items-center gap-2 border-white/5 hover:border-primary/20 transition-all">
                    <User size={20} className="text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Admin</span>
                 </Link>
              </div>
            </div>
            
            <div className="mt-auto pt-10 text-center">
               <p className="text-[8px] text-gray-600 font-black uppercase tracking-[3px]">MR Photo &copy; {new Date().getFullYear()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
