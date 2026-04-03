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
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-4 glass-card border-none rounded-none border-b border-white/5' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-neon">
            <Camera className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            MR<span className="text-primary italic">.PHOTO</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-all hover:text-primary ${
                pathname === link.href ? 'text-primary' : 'text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/admin">
             <User className="w-5 h-5 text-gray-500 hover:text-primary transition-colors cursor-pointer" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-full left-0 w-full glass shadow-2xl p-6 flex flex-col gap-4 border-t border-white/10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 text-lg p-3 rounded-lg transition-all ${
                  pathname === link.href ? 'bg-primary/20 text-primary border border-primary/20' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <link.icon size={22} />
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
