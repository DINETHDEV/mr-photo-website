'use client';

import { useState, useEffect } from 'react';
import { 
  Star, 
  Trash2, 
  CheckCircle, 
  XSquare, 
  Loader2, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  X,
  AlertCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '@/components/GlassCard';
import { fetchAdminData, putAdminData, deleteAdminData } from '@/utils/adminApi';

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Pending, Approved

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await fetchAdminData('reviews/all');
      setReviews(data || []);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load reviews");
      setLoading(false);
    }
  };

  const toggleApproval = async (id, currentStatus) => {
    try {
      await putAdminData(`reviews/${id}/approve`, { approved: !currentStatus });
      toast.success(currentStatus ? "Review hidden" : "Review approved & visible");
      loadReviews();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this review?")) {
      try {
        await deleteAdminData(`reviews/${id}`);
        toast.success("Review deleted");
        loadReviews();
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'Approved') return r.approved;
    if (filter === 'Pending') return !r.approved;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
               <Star className="text-primary" size={32} /> 
               Customer <span className="text-primary italic">Reviews</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage and approve testimonials for your landing page.</p>
         </div>

         <div className="flex flex-wrap gap-2 glass p-1.5 rounded-2xl">
            {['All', 'Pending', 'Approved'].map(f => (
               <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                     filter === f ? 'bg-primary text-black shadow-neon' : 'text-gray-400 hover:text-white'
                  }`}
               >
                  {f}
               </button>
            ))}
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {filteredReviews.length > 0 ? filteredReviews.map((review) => (
            <GlassCard key={review._id} className={`flex flex-col h-full border-white/5 hover:border-primary/20 group relative overflow-hidden ${!review.approved ? 'border-orange-500/20 bg-orange-500/[0.02]' : ''}`}>
               {!review.approved && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 rounded-bl-2xl">
                     <Clock size={12} /> Pending Approval
                  </div>
               )}

               <div className="flex gap-4 mb-6 pt-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-primary group-hover:scale-110 transition-transform">
                     {review.image ? <img src={review.image} className="w-full h-full object-cover rounded-2xl" /> : <User size={24}/>}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{review.name}</h3>
                    <div className="flex gap-0.5 text-primary mt-1">
                       {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-gray-700'} />
                       ))}
                    </div>
                  </div>
               </div>

               <div className="flex-grow space-y-4">
                  <p className="text-gray-400 text-sm leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                  <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2 pt-2 border-t border-white/5">
                     <Calendar size={12} /> {new Date(review.createdAt).toLocaleDateString()}
                  </div>
               </div>

               <div className="mt-8 flex gap-3 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => toggleApproval(review._id, review.approved)}
                    className={`flex-grow flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       review.approved ? 'glass text-orange-400 hover:bg-orange-500/20' : 'bg-emerald-500 text-black shadow-neon hover:scale-105'
                    }`}
                  >
                     {review.approved ? <ThumbsDown size={14} /> : <ThumbsUp size={14} />}
                     {review.approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => handleDelete(review._id)}
                    className="p-3 glass rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                     <Trash2 size={16} />
                  </button>
               </div>
            </GlassCard>
         )) : (
            <div className="col-span-full text-center py-40 glass rounded-[40px] border-dashed border-white/10">
               <AlertCircle size={48} className="mx-auto text-gray-800 mb-6" />
               <p className="text-gray-500 text-lg">No reviews found in this category.</p>
            </div>
         )}
      </div>
    </div>
  );
}

// Fix missing Lucide import
const ThumbsUp = ({ size, className }) => <CheckCircle2 className={className} size={size} />;
const ThumbsDown = ({ size, className }) => <XSquare className={className} size={size} />;
const Calendar = ({ size, className }) => <Clock className={className} size={size} />;
