import Link from 'next/link';
import { Camera, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 glass py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-4 group">
             <div className="relative w-14 h-14 bg-white/5 rounded-[22px] flex items-center justify-center p-1.5 border border-white/10 group-hover:border-primary/40 transition-all duration-500 shadow-2xl backdrop-blur-3xl overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src="/images/logo.png" className="w-full h-full object-contain rounded-xl" alt="MR Photo" />
             </div>
             <span className="text-2xl font-black tracking-tighter text-white">
               MR<span className="text-primary italic">.PHOTO</span>
             </span>
          </Link>
          <div className="space-y-4">
            <p className="text-primary text-[10px] font-black uppercase tracking-[4px] italic">
              &ldquo;Value For Every Customer&rdquo;
            </p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Premium photo restoration, design, and printing services. We bring your memories back to life with state-of-the-art technology.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
          <ul className="space-y-3">
            {['Home', 'Previous Projects', 'Services', 'Packages', 'Order Now', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  href={
                    item === 'Home' ? '/' :
                    item === 'Previous Projects' ? '/portfolio' :
                    item === 'Order Now' ? '/order' :
                    `/${item.toLowerCase()}`
                  }
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
              <span className="text-sm leading-relaxed tracking-wide">Kalutara, Sri Lanka</span>
            </li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Follow Us</h4>
          <div className="flex gap-4">
            <Link href="https://web.facebook.com/profile.php?id=100064042300162" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:bg-blue-600/20 hover:text-blue-500 transition-all border border-white/5 hover:border-blue-600/30">
              <Facebook size={20} />
            </Link>
            <Link href="https://instagram.com" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:bg-pink-600/20 hover:text-pink-500 transition-all border border-white/5 hover:border-pink-600/30">
              <Instagram size={20} />
            </Link>
            <Link href="https://wa.me/94777061718" className="w-10 h-10 glass flex items-center justify-center rounded-lg hover:bg-emerald-600/20 hover:text-emerald-500 transition-all border border-white/5 hover:border-emerald-600/30">
              <Phone size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} MR Photo Studio. All rights reserved.
        </p>
        <p className="text-gray-600 text-[10px] uppercase tracking-[4px]">
          Design by GridX Dev Studio
        </p>
      </div>
    </footer>
  );
}
