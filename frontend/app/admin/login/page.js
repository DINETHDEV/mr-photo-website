'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Lock, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { postData } from '@/utils/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await postData('auth/login', { email, password });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('adminEmail', data.email);
        toast.success("Welcome back, Admin!");
        router.push('/admin');
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[150px] -z-10" />

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary mx-auto rounded-3xl flex items-center justify-center shadow-neon-xl mb-6 transform hover:rotate-12 transition-transform duration-500">
            <Camera size={40} className="text-black" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Admin <span className="text-primary italic">Portal</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium tracking-wide">MR Photo Studio Management System</p>
        </div>

        <div className="glass p-8 md:p-10 border-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-[2px] ml-1">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mrphoto.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 focus:bg-white/10 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary uppercase tracking-[2px] ml-1">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-primary/50 focus:bg-white/10 transition-all outline-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg shadow-neon group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Secure Login <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-[3px]">
             <ShieldCheck size={14} className="text-primary" />
             <span>Encrypted Session</span>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-600 text-xs uppercase tracking-widest font-black">
          Value For Every Customer
        </p>
      </div>
    </div>
  );
}
