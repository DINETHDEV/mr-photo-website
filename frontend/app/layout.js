import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ClientWrapper from '@/components/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MR Photo | Value For Every Customer',
  description: 'Premium photo restoration, design, and printing services in Sri Lanka.',
  keywords: 'photo restoration, photo design, photo printing, frames, Sri Lanka, MR Photo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} animated-bg selection:bg-primary/30 min-h-screen text-foreground`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'rgba(25, 25, 25, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 170, 0, 0.3)',
          },
        }} />
      </body>
    </html>
  );
}
