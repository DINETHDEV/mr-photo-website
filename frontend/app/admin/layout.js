'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Image as ImageIcon, 
  Star, 
  Briefcase, 
  LogOut, 
  Menu, 
  X,
  Loader2,
  Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Services/Products', href: '/admin/products', icon: Briefcase },
  { name: 'Gift Packages', href: '/admin/packages', icon: Package },
  { name: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
];

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Basic Auth Check
    const token = localStorage.getItem('token');
    const isLoginPage = pathname === '/admin/login';

    if (!token && !isLoginPage) {
      router.push('/admin/login');
    } else if (token && isLoginPage) {
      router.push('/admin');
    }
    
    setIsLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    toast.success("Logged out successfully");
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen z-40 transition-all duration-300 glass border-none rounded-none border-r border-white/5 bg-black/40 backdrop-blur-3xl ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full py-8">
          {/* Admin Brand */}
          <div className="px-6 mb-12 flex items-center gap-4 overflow-hidden">
             <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-neon">
               <Camera size={20} className="text-black" />
             </div>
             {isSidebarOpen && (
                <span className="font-black text-xl tracking-tighter transition-all">
                   ADMIN<span className="text-primary">.PANEL</span>
                </span>
             )}
          </div>

          {/* Links */}
          <nav className="flex-grow space-y-2 px-3">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group overflow-hidden ${
                    isActive 
                      ? 'bg-primary text-black font-black shadow-neon' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <link.icon size={22} className={isActive ? 'text-black' : 'group-hover:text-primary transition-colors'} />
                  {isSidebarOpen && <span className="text-sm tracking-wide">{link.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 pt-6 border-t border-white/5 mt-auto">
            <button
               onClick={handleLogout}
               className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group overflow-hidden"
            >
              <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
              {isSidebarOpen && <span className="text-sm font-bold tracking-widest uppercase">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 relative">
         <header className="flex justify-between items-center mb-10 md:mb-16">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 glass rounded-xl text-gray-400 hover:text-primary hover:border-primary/40 transition-all"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-4">
               <Link href="/" className="text-[10px] text-gray-500 hover:text-white font-bold uppercase tracking-widest border-r border-white/10 pr-4 transition-all">
                  Visit Main Site
               </Link>
               <div className="flex items-center gap-3 glass py-1.5 pl-1.5 pr-4 rounded-full border-white/10 group cursor-pointer hover:border-primary/20">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orange-600 flex items-center justify-center font-black text-black text-xs uppercase">
                     MP
                  </div>
                  <span className="text-xs font-bold text-gray-300 transition-colors">Admin MR Photo</span>
               </div>
            </div>
         </header>

         {/* Content Wrapper */}
         <div className="max-w-6xl">
            <Suspense fallback={<Loader2 className="animate-spin text-primary m-auto" size={32} />}>
               {children}
            </Suspense>
         </div>
      </main>
    </div>
  );
}
