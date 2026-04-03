'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ExternalLink, 
  Eye,
  Calendar,
  Phone,
  User,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  MapPin,
  CheckCircle2,
  Trash2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import { fetchAdminData, putAdminData } from '@/utils/adminApi';

const statuses = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (activeStatus !== 'All') {
      result = result.filter(o => o.status === activeStatus);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(o => 
        o.customerName.toLowerCase().includes(term) || 
        o.phone.includes(term) ||
        (o.packageId?.name && o.packageId.name.toLowerCase().includes(term))
      );
    }
    setFilteredOrders(result);
  }, [activeStatus, searchTerm, orders]);

  const loadOrders = async () => {
    try {
      const data = await fetchAdminData('orders');
      setOrders(data || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load orders");
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await putAdminData(`orders/${id}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus}`);
      loadOrders();
      if (selectedOrder?._id === id) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <ShoppingBag className="text-primary" size={32} /> 
               Orders <span className="text-primary italic">Management</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Track and manage your studio orders in real-time.</p>
         </div>

         <div className="flex flex-wrap gap-2 glass p-1.5 rounded-2xl">
            {statuses.map(s => (
               <button 
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                     activeStatus === s ? 'bg-primary text-black shadow-neon' : 'text-gray-400 hover:text-white'
                  }`}
               >
                  {s}
               </button>
            ))}
         </div>
      </header>

      {/* Search Bar */}
      <div className="relative group">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
         <input 
            type="text"
            placeholder="Search by name, phone or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 text-white focus:border-primary/50 focus:bg-white/10 transition-all outline-none"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Orders List */}
         <div className={`lg:col-span-8 flex flex-col gap-4 ${selectedOrder ? 'hidden md:flex' : 'flex'}`}>
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
               <GlassCard 
                  key={order._id}
                  className={`p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer border-white/5 hover:border-primary/20 transition-all group ${selectedOrder?._id === order._id ? 'border-primary shadow-neon-sm bg-primary/5' : ''}`}
                  onClick={() => setSelectedOrder(order)}
               >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-primary group-hover:bg-primary group-hover:text-black group-hover:border-none transition-all">
                     <User size={24} />
                  </div>
                  
                  <div className="flex-grow flex flex-col md:flex-row justify-between gap-4 w-full">
                     <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-white font-bold text-lg">{order.customerName}</h3>
                        <p className="text-xs text-gray-500 font-medium flex items-center justify-center md:justify-start gap-1">
                           <Phone size={12} /> {order.phone}
                        </p>
                        <p className="text-[10px] text-primary uppercase font-bold tracking-[2px] pt-1">
                           {order.serviceType === 'package' ? (order.packageId?.name || 'Gift Package') : 'Custom Service'}
                        </p>
                     </div>

                     <div className="flex flex-col items-center md:items-end justify-center gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           order.status === 'Completed' ? 'bg-emerald-400 text-black' : 
                           order.status === 'Processing' ? 'bg-blue-500 text-black' :
                           order.status === 'Cancelled' ? 'bg-red-500 text-black' :
                           'bg-white/10 text-white'
                        }`}>
                           {order.status}
                        </span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1">
                           <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                  </div>
                  
                  <div className="hidden md:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-3 glass rounded-xl text-primary hover:bg-primary hover:text-black transition-all">
                        <Eye size={16} />
                     </button>
                  </div>
               </GlassCard>
            )) : (
               <div className="text-center py-40 glass rounded-[40px] border-dashed border-white/10">
                  <ShoppingBag size={64} className="mx-auto text-gray-800 mb-6" />
                  <p className="text-gray-500 text-lg">No orders matching your criteria.</p>
               </div>
            )}
         </div>

         {/* Order Detail View */}
         <div className={`lg:col-span-4 ${selectedOrder ? 'block' : 'hidden lg:block lg:opacity-30'}`}>
            {selectedOrder ? (
               <GlassCard className="sticky top-10 border-primary/20 p-8 space-y-8">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <span className="text-[10px] text-primary font-black uppercase tracking-[3px]">Order Detail</span>
                        <h2 className="text-2xl font-black text-white">{selectedOrder.customerName}</h2>
                        <span className="text-xs text-gray-500 font-mono">#{selectedOrder._id.slice(-8).toUpperCase()}</span>
                     </div>
                     <button onClick={() => setSelectedOrder(null)} className="md:hidden p-2 glass rounded-lg">
                        <X size={18} />
                     </button>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-4">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Status Actions</h4>
                        <div className="grid grid-cols-2 gap-3">
                           <button 
                            onClick={() => updateStatus(selectedOrder._id, 'Processing')}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-400/20 hover:bg-blue-500 hover:text-white transition-all">
                              Process
                           </button>
                           <button 
                            onClick={() => updateStatus(selectedOrder._id, 'Completed')}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-500 hover:text-white transition-all">
                              Complete
                           </button>
                           <button 
                            onClick={() => updateStatus(selectedOrder._id, 'Cancelled')}
                             className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-400/20 hover:bg-red-500 hover:text-white transition-all col-span-2">
                              Cancel Order
                           </button>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-start gap-4">
                           <MapPin className="text-primary mt-1 shrink-0" size={18} />
                           <div>
                              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest block mb-1">Address</span>
                              <p className="text-sm text-gray-300 leading-relaxed font-medium">{selectedOrder.address}</p>
                           </div>
                        </div>

                        <div className="flex items-start gap-4">
                           <MessageSquare className="text-primary mt-1 shrink-0" size={18} />
                           <div>
                              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest block mb-1">Customer Message</span>
                              <p className="text-sm text-gray-300 italic leading-relaxed">&ldquo;{selectedOrder.message || 'No instructions provided.'}&rdquo;</p>
                           </div>
                        </div>
                     </div>

                     {/* Uploaded Image Preview */}
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Customer Upload</h4>
                        {selectedOrder.uploadedImage ? (
                           <div className="relative aspect-video rounded-2xl overflow-hidden glass border-white/10 group">
                              <img src={selectedOrder.uploadedImage} className="w-full h-full object-cover" alt="Upload" />
                              <a 
                                 href={selectedOrder.uploadedImage} 
                                 target="_blank" 
                                 className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                 <span className="p-3 glass rounded-full text-white"><ExternalLink size={20} /></span>
                              </a>
                           </div>
                        ) : (
                           <div className="flex items-center gap-3 p-4 glass rounded-2xl border-dashed border-white/10 text-gray-600">
                              <ImageIcon size={20} />
                              <span className="text-xs font-bold uppercase tracking-widest">No photo attached</span>
                           </div>
                        )}
                     </div>

                     {/* WhatsApp CTA */}
                     <div className="pt-4 border-t border-white/5">
                        <a 
                           href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`} 
                           target="_blank"
                           className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-[3px] hover:scale-105 transition-transform"
                        >
                           <Phone size={20} /> Contact on WhatsApp
                        </a>
                     </div>
                  </div>
               </GlassCard>
            ) : (
               <div className="text-center py-20 px-10 glass border-white/10 rounded-[30px] border-dashed">
                  <ShoppingBag size={48} className="mx-auto text-gray-800 mb-6" />
                  <p className="text-gray-600 text-xs font-black uppercase tracking-[3px]">Select an order to view full details and manage status</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
