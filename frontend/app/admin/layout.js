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
  { name: 'Previous Projects', href: '/admin/portfolio', icon: ImageIcon },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
];

export default function AdminLayout({ children }) {
  // Sidebar closed by default — will open on desktop via useEffect
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // ── Auth check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoginPage = pathname === '/admin/login';

    if (!token && !isLoginPage) {
      router.replace('/admin/login');
      return;
    }
    if (token && isLoginPage) {
      router.replace('/admin');
      return;
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ── Open sidebar by default on desktop, close on mobile ──────────────────
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    // Set initial value
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Auto-close sidebar on mobile when route changes ──────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    toast.success('Logged out successfully');
    router.replace('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white relative">

      {/* ── Mobile Backdrop Overlay ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300
          glass border-r border-white/5 bg-black/70 backdrop-blur-3xl
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0 md:w-20'}
        `}
      >
        <div className="flex flex-col h-full py-8">

          {/* Brand + Close button on mobile */}
          <div className="px-5 mb-10 flex items-center justify-between gap-4 overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-neon">
                <Camera size={20} className="text-black" />
              </div>
              <span className={`font-black text-lg tracking-tighter transition-all whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                ADMIN<span className="text-primary">.PANEL</span>
              </span>
            </div>
            {/* Close button visible only on mobile when open */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 glass rounded-lg text-gray-500 hover:text-white transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-grow space-y-1.5 px-3">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    // Close sidebar on mobile after clicking a link
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group overflow-hidden ${
                    isActive
                      ? 'bg-primary text-black font-black shadow-neon'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <link.icon
                    size={22}
                    className={`shrink-0 ${isActive ? 'text-black' : 'group-hover:text-primary transition-colors'}`}
                  />
                  <span className={`text-sm tracking-wide whitespace-nowrap overflow-hidden transition-all ${isSidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 md:hidden'}`}>
                    {link.name}
                  </span>
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
              <LogOut size={22} className="shrink-0 group-hover:translate-x-1 transition-transform" />
              <span className={`text-sm font-bold tracking-widest uppercase whitespace-nowrap overflow-hidden transition-all ${isSidebarOpen ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 md:hidden'}`}>
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={`flex-grow min-w-0 p-5 md:p-10 relative transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="flex justify-between items-center mb-10 md:mb-14">
          {/* Hamburger — always visible */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 glass rounded-xl text-gray-400 hover:text-primary hover:border-primary/40 transition-all shrink-0"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[10px] text-gray-500 hover:text-white font-bold uppercase tracking-widest border-r border-white/10 pr-4 transition-all hidden sm:block"
            >
              Visit Main Site
            </Link>
            <div className="flex items-center gap-2 glass py-1.5 pl-1.5 pr-3 rounded-full border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orange-600 flex items-center justify-center font-black text-black text-xs uppercase shrink-0">
                MP
              </div>
              <span className="text-xs font-bold text-gray-300 hidden sm:block">Admin MR Photo</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-6xl">
          <Suspense fallback={<Loader2 className="animate-spin text-primary m-auto" size={32} />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
