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
  MessageSquare,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageCircle,
  RefreshCw,
  Trash2,
  X,
  Inbox,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Hourglass,
} from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '@/components/GlassCard';
import { fetchAdminData, putAdminData, deleteAdminData } from '@/utils/adminApi';

const ALL_STATUSES = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

const STATUS_STYLES = {
  Pending:    { pill: 'bg-amber-500/10 text-amber-400 border border-amber-400/20',   icon: Hourglass,     btn: 'bg-amber-500/10 text-amber-400 border border-amber-400/20 hover:bg-amber-500 hover:text-black hover:border-transparent' },
  Processing: { pill: 'bg-blue-500/10 text-blue-400 border border-blue-400/20',      icon: Clock,         btn: 'bg-blue-500/10 text-blue-400 border border-blue-400/20 hover:bg-blue-500 hover:text-white hover:border-transparent' },
  Completed:  { pill: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20', icon: CheckCircle2, btn: 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 hover:bg-emerald-500 hover:text-white hover:border-transparent' },
  Cancelled:  { pill: 'bg-red-500/10 text-red-400 border border-red-400/20',         icon: XCircle,       btn: 'bg-red-500/10 text-red-400 border border-red-400/20 hover:bg-red-500 hover:text-white hover:border-transparent' },
};

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  // Update order status
  const updateStatus = async (id, newStatus) => {
    setUpdatingStatus(true);
    try {
      await putAdminData(`orders/${id}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
      setSelectedOrder(prev => prev?._id === id ? { ...prev, status: newStatus } : prev);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteAdminData(`orders/${id}`);
      toast.success('Order deleted');
      setOrders(prev => prev.filter(o => o._id !== id));
      if (selectedOrder?._id === id) setSelectedOrder(null);
    } catch {
      toast.error('Failed to delete order');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = orders.filter(o => {
    const matchStatus = activeFilter === 'All' || o.status === activeFilter;
    const term = searchTerm.toLowerCase();
    const matchSearch = !term ||
      o.customerName?.toLowerCase().includes(term) ||
      o.phone?.includes(term);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8 pb-20">

      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShoppingBag className="text-primary" size={32} />
            Orders <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length} total order{orders.length !== 1 ? 's' : ''} · Track and update customer orders.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-gray-400 hover:text-primary hover:border-primary/30 transition-all text-xs font-black uppercase tracking-widest"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      {/* ── Status Filter Pills ── */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map(s => {
          const count = s === 'All' ? orders.length : orders.filter(o => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeFilter === s
                  ? 'bg-primary text-black border-primary shadow-neon'
                  : 'glass text-gray-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
            >
              {s}
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                activeFilter === s ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search ── */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white focus:border-primary/50 focus:bg-white/10 outline-none transition-all"
        />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <GlassCard className="flex flex-col items-center justify-center py-32 border-dashed border-white/10 gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Inbox size={44} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">No Orders Yet</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              Customer orders will appear here once they start placing them.
            </p>
          </div>
          <button onClick={loadOrders} className="flex items-center gap-2 px-6 py-3 btn-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-neon">
            <RefreshCw size={16} /> Refresh
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Orders List ── */}
          <div className={`lg:col-span-7 flex flex-col gap-3 ${selectedOrder ? 'hidden lg:flex' : 'flex'}`}>
            {filtered.length === 0 ? (
              <GlassCard className="flex flex-col items-center justify-center py-20 border-dashed border-white/10 gap-4">
                <AlertCircle size={40} className="text-gray-700" />
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest">No orders match your filter.</p>
              </GlassCard>
            ) : filtered.map(order => {
              const style = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;
              const Icon = style.icon;
              return (
                <GlassCard
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-5 flex items-center gap-4 cursor-pointer border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group ${
                    selectedOrder?._id === order._id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-black text-lg">
                    {order.customerName?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{order.customerName}</h3>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Phone size={9} /> {order.phone}
                    </p>
                  </div>

                  {/* Status + Date */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${style.pill}`}>
                      <Icon size={9} /> {order.status}
                    </span>
                    <span className="text-[9px] text-gray-600 font-bold flex items-center gap-1">
                      <Calendar size={9} /> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Delete btn */}
                  <button
                    onClick={e => { e.stopPropagation(); deleteOrder(order._id); }}
                    disabled={deletingId === order._id}
                    className="ml-1 p-2 glass rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all shrink-0 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title="Delete order"
                  >
                    {deletingId === order._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>

                  <Eye size={14} className="text-gray-700 group-hover:text-primary shrink-0 transition-colors hidden sm:block" />
                </GlassCard>
              );
            })}
          </div>

          {/* ── Detail Panel ── */}
          <div className={`lg:col-span-5 ${selectedOrder ? 'block' : 'hidden lg:block'}`}>
            {selectedOrder ? (
              <GlassCard className="sticky top-10 p-8 space-y-7 border-primary/10">

                {/* Top bar */}
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
                {(() => {
                  const style = STATUS_STYLES[selectedOrder.status] || STATUS_STYLES.Pending;
                  const Icon = style.icon;
                  return (
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${style.pill}`}>
                      <Icon size={12} /> {selectedOrder.status}
                    </span>
                  );
                })()}

                {/* ── Status Selector ── */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[3px] border-b border-white/5 pb-2">
                    Change Status
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Pending', 'Processing', 'Completed', 'Cancelled'].map(s => {
                      const isActive = selectedOrder.status === s;
                      const style = STATUS_STYLES[s];
                      const Icon = style.icon;
                      return (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedOrder._id, s)}
                          disabled={isActive || updatingStatus}
                          className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                            isActive
                              ? style.pill + ' cursor-default opacity-100 ring-2 ring-offset-1 ring-offset-transparent'
                              : style.btn
                          } disabled:cursor-not-allowed`}
                        >
                          {updatingStatus && !isActive
                            ? <Loader2 size={12} className="animate-spin" />
                            : <Icon size={12} />
                          }
                          {s}
                          {isActive && <span className="ml-1 text-[8px] opacity-60">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <div className="flex gap-3">
                    <Phone size={15} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Phone</span>
                      <p className="text-sm text-gray-300">{selectedOrder.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Address</span>
                      <p className="text-sm text-gray-300 leading-relaxed">{selectedOrder.address || 'Not provided'}</p>
                    </div>
                  </div>
                  {selectedOrder.message && (
                    <div className="flex gap-3">
                      <MessageSquare size={15} className="text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest block mb-0.5">Message</span>
                        <p className="text-sm text-gray-300 italic leading-relaxed">&ldquo;{selectedOrder.message}&rdquo;</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Uploaded Image */}
                {selectedOrder.uploadedImage ? (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Customer Photo</span>
                    <div className="relative aspect-video rounded-2xl overflow-hidden group border border-white/10">
                      <img src={selectedOrder.uploadedImage} className="w-full h-full object-cover" alt="Upload" />
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
                    <ImageIcon size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">No photo attached</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
                  <a
                    href={`https://wa.me/${selectedOrder.phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase tracking-[3px] hover:scale-105 transition-transform shadow-neon"
                  >
                    <MessageCircle size={18} /> Contact on WhatsApp
                  </a>
                  <button
                    onClick={() => deleteOrder(selectedOrder._id)}
                    disabled={deletingId === selectedOrder._id}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-400/20 font-black text-xs uppercase tracking-[3px] hover:bg-red-500 hover:text-white hover:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === selectedOrder._id
                      ? <Loader2 size={16} className="animate-spin" />
                      : <Trash2 size={16} />
                    }
                    Delete Order
                  </button>
                </div>

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
