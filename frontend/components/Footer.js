import Link from 'next/link';
import { Camera, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 glass py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-neon">
               <Camera className="text-black w-6 h-6" />
             </div>
             <span className="text-2xl font-black tracking-tighter text-white">
               MR<span className="text-primary italic">.PHOTO</span>
             </span>
          </Link>
          <p className="text-gray-400 text-sm italic">
            &ldquo;Value For Every Customer&rdquo;
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium photo restoration, design, and printing services. We bring your memories back to life with state-of-the-art technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-3">
            {['Home', 'Portfolio', 'Services', 'Packages', 'Order Now', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-400 group">
              <Phone className="text-primary w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm tracking-wide">+94 77 706 1718</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400 group">
              <Mail className="text-primary w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm tracking-wide">mrphoto444@gmail.com</span>
            </li>
            <li className="flex items-start gap-3 text-gray-400 group">
              <MapPin className="text-primary w-5 h-5 mt-1 group-hover:scale-110 transition-transform" />
              <span className="text-sm leading-relaxed tracking-wide">Colombo, Sri Lanka</span>
            </li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Follow Us</h4>
          <div className="flex gap-4 mb-8">
            <Link href="https://facebook.com" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
              <Facebook size={20} />
            </Link>
            <Link href="https://instagram.com" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
              <Instagram size={20} />
            </Link>
            <Link href="https://twitter.com" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
              <Twitter size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} MR Photo Studio. All rights reserved.
        </p>
        <p className="text-gray-600 text-[10px] uppercase tracking-[4px]">
          Design by DineX Dev
        </p>
      </div>
    </footer>
  );
}
