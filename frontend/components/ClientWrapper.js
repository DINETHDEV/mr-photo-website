'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main className={isAdminPage ? '' : 'min-h-[80vh]'}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}
