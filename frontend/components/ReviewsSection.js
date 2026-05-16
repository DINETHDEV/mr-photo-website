'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Send, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, X, User } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mr-photo-api.onrender.com';

// ─── Star Rating Component ────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false, size = 20 }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? 'button' : 'button'}
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-all duration-150 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
        >
          <Star
            size={size}
            className={`transition-colors duration-150 ${
              star <= (hovered || value)
                ? 'text-primary fill-primary'
                : 'text-white/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Single Review Card ───────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="glass border-white/5 hover:border-primary/20 transition-all duration-300 rounded-3xl p-7 flex flex-col gap-5 h-full min-w-[300px] max-w-[360px] flex-shrink-0 group">
      {/* Quote icon */}
      <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Quote size={18} className="text-primary" />
      </div>

      {/* Comment */}
      <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-4">
        "{review.comment}"
      </p>

      {/* Stars */}
      <StarRating value={review.rating} readonly size={16} />

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        {review.image ? (
          <img
            src={review.image}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover border border-primary/20"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-primary" />
          </div>
        )}
        <div>
          <p className="text-white font-bold text-sm">{review.name}</p>
          <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black">
            Verified Customer
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Submit Review Modal ───────────────────────────────────────────────────────
function ReviewModal({ onClose }) {
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="glass border-primary/20 rounded-3xl p-8 w-full max-w-md relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>

        {success ? (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white">Thank You!</h3>
            <p className="text-gray-400 text-sm">
              Your review has been submitted and is pending approval. We appreciate your feedback!
            </p>
            <button onClick={onClose} className="btn-primary px-8 py-3 rounded-2xl w-full mt-2">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-black text-white mb-1">Leave a Review</h3>
              <p className="text-gray-500 text-sm">Share your experience with MR Photo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kasun Perera"
                  className="w-full glass border-white/10 focus:border-primary/40 bg-transparent text-white placeholder:text-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Rating</label>
                <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} size={24} />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Review</label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="w-full glass border-white/10 focus:border-primary/40 bg-transparent text-white placeholder:text-gray-600 px-4 py-3 rounded-xl text-sm outline-none transition-colors resize-none"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-neon disabled:opacity-60 disabled:scale-100"
              >
                {loading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                ) : (
                  <Send size={16} />
                )}
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Reviews Section ─────────────────────────────────────────────────────
export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Fetch approved reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (reviews.length <= 1) return;
    autoScrollRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(autoScrollRef.current);
  }, [reviews]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (dir) => {
    clearInterval(autoScrollRef.current);
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  // Calculate average rating
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h2 className="text-xs font-black text-primary uppercase tracking-[5px]">
                Testimonials
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter">
                What Our <span className="text-primary">Clients</span> Say.
              </h3>
              {avgRating && (
                <div className="flex items-center gap-3 pt-2">
                  <StarRating value={Math.round(avgRating)} readonly size={18} />
                  <span className="text-white font-black text-lg">{avgRating}</span>
                  <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
                </div>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => setShowModal(true)}
              className="btn-primary px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-neon flex items-center gap-2 shrink-0"
            >
              <Star size={16} />
              Write a Review
            </motion.button>
          </div>

          {/* Reviews Carousel */}
          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-3xl p-7 min-w-[300px] max-w-[360px] flex-shrink-0 animate-pulse space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5" />
                  <div className="space-y-2">
                    <div className="h-3 bg-white/5 rounded-full w-full" />
                    <div className="h-3 bg-white/5 rounded-full w-4/5" />
                    <div className="h-3 bg-white/5 rounded-full w-3/5" />
                  </div>
                  <div className="h-4 bg-white/5 rounded-full w-24" />
                  <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-white/5" />
                    <div className="space-y-1">
                      <div className="h-3 bg-white/5 rounded-full w-24" />
                      <div className="h-2 bg-white/5 rounded-full w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-16 text-center border-white/5"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Star size={28} className="text-primary" />
              </div>
              <h4 className="text-white font-black text-xl mb-2">No Reviews Yet</h4>
              <p className="text-gray-500 text-sm mb-6">Be the first to share your experience!</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                Write First Review
              </button>
            </motion.div>
          ) : (
            <div className="relative">
              {/* Left arrow */}
              {canScrollLeft && (
                <button
                  onClick={() => scroll('left')}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass border-white/10 hover:border-primary/30 flex items-center justify-center transition-all hover:scale-110"
                >
                  <ChevronLeft size={18} className="text-white" />
                </button>
              )}

              {/* Scrollable track */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {reviews.map((review, i) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}
              </div>

              {/* Right arrow */}
              {canScrollRight && (
                <button
                  onClick={() => scroll('right')}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full glass border-white/10 hover:border-primary/30 flex items-center justify-center transition-all hover:scale-110"
                >
                  <ChevronRight size={18} className="text-white" />
                </button>
              )}

              {/* Fade edges */}
              <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      </section>

      {/* Submit Review Modal */}
      <AnimatePresence>
        {showModal && <ReviewModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}
