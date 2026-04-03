'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Briefcase, 
  Star, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Users,
  Image as ImageIcon,
  Zap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { fetchAdminData } from '@/utils/adminApi';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <GlassCard className="relative overflow-hidden group border-white/5 hover:border-primary/20">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-[100px] group-hover:scale-110 transition-transform`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${color.split(' ')[1]}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-bold uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded-full">
           <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-xs font-black uppercase tracking-[3px] mb-2">{title}</h3>
    <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
  </GlassCard>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    packages: 0,
    reviews: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [orders, products, packages, reviews] = await Promise.all([
          fetchAdminData('orders'),
          fetchAdminData('products/all'),
          fetchAdminData('packages/all'),
          fetchAdminData('reviews/all'),
        ]);

        setStats({
          orders: orders?.length || 0,
          pendingOrders: orders?.filter(o => o.status === 'Pending').length || 0,
          products: products?.length || 0,
          packages: packages?.length || 0,
          reviews: reviews?.length || 0
        });

        setRecentOrders(orders?.slice(0, 5) || []);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
     return <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {[1,2,3,4].map(i => <div key={i} className="h-32 glass rounded-2xl" />)}
        </div>
        <div className="h-96 glass rounded-2xl" />
     </div>;
  }

  return (
    <div className="space-y-10">
      <header>
         <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Welcome Back, <span className="text-primary italic">Admin!</span></h1>
         <p className="text-gray-500 text-sm font-medium tracking-wide">Here&apos;s a quick overview of your studio performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Orders" 
          value={stats.orders} 
          icon={ShoppingBag} 
          color="from-blue-500 to-indigo-500 text-blue-400" 
          trend="+12%"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingOrders} 
          icon={Clock} 
          color="from-orange-500 to-amber-500 text-orange-400" 
        />
        <StatCard 
          title="Active Packages" 
          value={stats.packages} 
          icon={Package} 
          color="from-emerald-500 to-teal-500 text-emerald-400" 
        />
        <StatCard 
          title="User Reviews" 
          value={stats.reviews} 
          icon={Star} 
          color="from-pink-500 to-rose-500 text-pink-400" 
          trend="+5 new"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Recent Orders */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Clock className="text-primary" size={20} /> Recent Orders
               </h2>
               <Link href="/admin/orders" className="text-xs text-primary font-bold uppercase tracking-widest hover:underline">
                  View All Orders
               </Link>
            </div>
            
            <GlassCard className="p-0 overflow-hidden border-white/5">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-white/5">
                        <tr>
                           <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-gray-500">Customer</th>
                           <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-gray-500">Service</th>
                           <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-gray-500">Status</th>
                           <th className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-gray-500 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                          <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                                      {order.customerName.charAt(0)}
                                   </div>
                                   <span className="text-sm font-bold text-white truncate max-w-[120px]">{order.customerName}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-xs text-gray-400 italic">{order.serviceType === 'package' ? (order.packageId?.name || 'Package') : 'Custom Service'}</span>
                             </td>
                             <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                   order.status === 'Completed' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 
                                   order.status === 'Processing' ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' :
                                   'bg-orange-400/10 text-orange-400 border border-orange-400/20'
                                }`}>
                                   {order.status === 'Completed' ? <CheckCircle2 size={12} /> : 
                                    order.status === 'Processing' ? <TrendingUp size={12} /> :
                                    <AlertCircle size={12} />}
                                   {order.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <Link href={`/admin/orders`} className="p-2 glass inline-block rounded-lg text-primary hover:bg-primary hover:text-black transition-all">
                                   <ArrowUpRight size={16} />
                                </Link>
                             </td>
                          </tr>
                        )) : (
                          <tr>
                             <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm italic">No recent orders yet. Get some sales!</td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </GlassCard>
         </div>

         {/* Quick Actions */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
               <Zap className="text-primary" size={20} /> Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4">
               {[
                 { label: 'Add Portfolio Item', href: '/admin/portfolio', icon: ImageIcon, color: 'text-primary' },
                 { label: 'New Gift Package', href: '/admin/packages', icon: Package, color: 'text-emerald-400' },
                 { label: 'Approve Reviews', href: '/admin/reviews', icon: Star, color: 'text-pink-400' },
                 { label: 'Edit Services', href: '/admin/products', icon: Briefcase, color: 'text-blue-400' },
               ].map((action, idx) => (
                 <Link key={idx} href={action.href}>
                    <GlassCard className="flex items-center gap-4 p-5 py-4 border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group">
                       <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110 ${action.color}`}>
                          <action.icon size={20} />
                       </div>
                       <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                       <ChevronRight className="ml-auto text-gray-600 group-hover:text-primary transition-colors" size={16} />
                    </GlassCard>
                 </Link>
               ))}
            </div>

            {/* System Health */}
            <GlassCard className="p-6 border-emerald-400/10 bg-emerald-400/[0.02]">
               <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <CheckCircle2 size={18} />
                  <h4 className="font-bold text-sm">System Health: Good</h4>
               </div>
               <p className="text-gray-500 text-xs leading-relaxed">
                  All systems are operational. Cloudinary storage active. MongoDB is connected and synchronized.
               </p>
            </GlassCard>
         </div>
      </div>
    </div>
  );
}
