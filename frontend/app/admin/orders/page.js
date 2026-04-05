'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  ExternalLink,
  Clock,
  Eye,
  Calendar,
  Phone,
  User,
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageCircle,
  CheckCircle2,
  XCircle,
  X,
  Inbox,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import { fetchAdminData, putAdminData } from '@/utils/adminApi';

const STATUS_STYLES = {
  Pending:    'bg-amber-500/10 text-amber-400 border border-amber-400/20',
  Processing: 'bg-blue-500/10 text-blue-400 border border-blue-400/20',
  Completed:  'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20',
  Cancelled:  'bg-red-500/10 text-red-400 border border-red-400/20',
};

const ALL_STATUSES = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminData('orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await putAdminData(`orders/${id}/status`, { status: newStatus });
      toast.success(`Marked as ${newStatus}`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      setSelectedOrder(prev => prev?._id === id ? { ...prev, status: newStatus } : prev);
    } catch {
      toast.error('Update failed');
    }
  };

  const filtered = orders.filter(o => {
    const matchStatus = activeStatus === 'All' || o.status === activeStatus;
    const term = searchTerm.toLowerCase();
    const matchSearch = !term ||
      o.customerName?.toLowerCase().includes(term) ||
      o.phone?.includes(term) ||
      o.packageId?.name?.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShoppingBag className="text-primary" size={32} />
            Orders <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage all customer orders in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="p-3 glass rounded-xl text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-1.5 glass p-1.5 rounded-2xl">
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeStatus === s
                    ? 'bg-primary text-black shadow-neon'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search by customer name or phone..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white focus:border-primary/50 focus:bg-white/10 outline-none transition-all"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        /* ── EMPTY STATE ── */
        <GlassCard className="flex flex-col items-center justify-center py-32 border-dashed border-white/10 gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Inbox size={44} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">No Orders Yet</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              Orders placed by customers will appear here. Share your services to get started!
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-6 py-3 btn-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-neon"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Orders List */}
          <div className={`lg:col-span-7 flex flex-col gap-4 ${selectedOrder ? 'hidden lg:flex' : 'flex'}`}>
            {filtered.length === 0 ? (
              <GlassCard className="flex flex-col items-center justify-center py-24 border-dashed border-white/10 gap-4">
                <ShoppingBag size={40} className="text-gray-700" />
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No orders match your filter.</p>
              </GlassCard>
            ) : filtered.map(order => (
              <GlassCard
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`p-5 flex items-center gap-5 cursor-pointer border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group ${
                  selectedOrder?._id === order._id ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-black text-lg">
                  {order.customerName?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="text-white font-bold text-base truncate">{order.customerName}</h3>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Phone size={10} /> {order.phone}
                  </p>
                  <p className="text-[10px] text-primary uppercase font-black tracking-[2px] mt-1">
                    {order.serviceType === 'package' ? (order.packageId?.name || 'Gift Package') : 'Custom Service'}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}>
                    {order.status}
                  </span>
                  <span className="text-[9px] text-gray-600 font-bold uppercase flex items-center gap-1">
                    <Calendar size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Eye size={16} className="text-gray-700 group-hover:text-primary shrink-0 hidden sm:block transition-colors" />
              </GlassCard>
            ))}
          </div>

          {/* Order Detail Panel */}
          <div className={`lg:col-span-5 ${selectedOrder ? 'block' : 'hidden lg:block'}`}>
            {selectedOrder ? (
              <GlassCard className="sticky top-10 p-8 space-y-8 border-primary/10">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] text-primary font-black uppercase tracking-[3px]">Order Detail</span>
                    <h2 className="text-2xl font-black text-white mt-1">{selectedOrder.customerName}</h2>
                    <span className="text-xs text-gray-600 font-mono">#{selectedOrder._id?.slice(-8).toUpperCase()}</span>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 glass rounded-xl text-gray-500 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Current status badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${STATUS_STYLES[selectedOrder.status] || STATUS_STYLES.Pending}`}>
                  <Clock size={12} /> {selectedOrder.status}
                </div>

                {/* Status Actions */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Update Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Processing', 'Completed'].map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedOrder._id, s)}
                        disabled={selectedOrder.status === s}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                          s === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-500 hover:text-white hover:border-transparent'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-400/20 hover:bg-blue-500 hover:text-white hover:border-transparent'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => updateStatus(selectedOrder._id, 'Cancelled')}
                      disabled={selectedOrder.status === 'Cancelled'}
                      className="col-span-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-400/20 hover:bg-red-500 hover:text-white hover:border-transparent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex gap-3">
                    <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Address</span>
                      <p className="text-sm text-gray-300 leading-relaxed">{selectedOrder.address || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MessageSquare size={16} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Message</span>
                      <p className="text-sm text-gray-300 italic">&ldquo;{selectedOrder.message || 'No instructions.'}&rdquo;</p>
                    </div>
                  </div>
                </div>

                {/* Uploaded Image */}
                {selectedOrder.uploadedImage ? (
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Customer Upload</span>
                    <div className="relative aspect-video rounded-2xl overflow-hidden group border border-white/10">
                      <img src={selectedOrder.uploadedImage} className="w-full h-full object-cover" alt="Customer upload" />
                      <a
                        href={selectedOrder.uploadedImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <ExternalLink size={22} className="text-white" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 glass rounded-xl border-dashed border-white/10 text-gray-600">
                    <ImageIcon size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">No photo attached</span>
                  </div>
                )}

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${selectedOrder.phone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-[3px] shadow-neon hover:scale-105 transition-transform"
                >
                  <MessageCircle size={18} /> Contact on WhatsApp
                </a>
              </GlassCard>
            ) : (
              <GlassCard className="flex flex-col items-center justify-center py-24 border-dashed border-white/10 gap-4 text-center">
                <Eye size={40} className="text-gray-800" />
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-[3px]">
                  Select an order to view details
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
