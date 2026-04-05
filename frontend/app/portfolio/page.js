'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Layers, Briefcase, Star, Quote, Loader2, RotateCcw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import { fetchData } from '@/utils/api';

const categories = ['All', 'Restoration', 'Design', 'Frames', 'Printing'];

// Mock Work Data
const mockPortfolio = [
  {
    _id: '1',
    title: 'Vintage Portrait Restoration',
    category: 'Restoration',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: '2',
    title: 'Modern Abstract Frame',
    category: 'Frames',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: '3',
    title: 'Family Reunion Edit',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=800',
  },
  {
    _id: '4',
    title: 'Canvas Print - Nature',
    category: 'Printing',
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800',
  },
];

// Mock Reviews
const mockReviews = [
  {
    _id: 'r1',
    name: 'Sampath Perera',
    role: 'Verified Customer',
    rating: 5,
    comment: 'The restoration of my grandfather’s 40-year-old wedding photo is absolutely incredible. The detail is mind-blowing. Thank you Mr. Photo!',
    date: '2024-03-10'
  },
  {
    _id: 'r2',
    name: 'Dilrukshi Silva',
    role: 'Verified Customer',
    rating: 5,
    comment: 'Excellent service and high-quality frames. The colors are so vibrant. Will definitely order again!',
    date: '2024-03-22'
  },
  {
    _id: 'r3',
    name: 'Nuwan Jayasinghe',
    role: 'Product Designer',
    rating: 5,
    comment: 'Professional retouching and very fast delivery. Recommended for anyone looking for premium photo services in Kalutara.',
    date: '2024-04-01'
  }
];

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [portfolioData, reviewsData] = await Promise.all([
          fetchData('portfolio'),
          fetchData('reviews')
        ]);
        
        const finalPortfolio = portfolioData && portfolioData.length > 0 ? portfolioData : mockPortfolio;
        const finalReviews = reviewsData && reviewsData.length > 0 ? reviewsData : mockReviews;
        
        setItems(finalPortfolio);
        setFilteredItems(finalPortfolio);
        setReviews(finalReviews);
      } catch (error) {
        setItems(mockPortfolio);
        setFilteredItems(mockPortfolio);
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => 
        item.category.toLowerCase() === activeCategory.toLowerCase() ||
        (activeCategory === 'Restoration' && item.category === 'Photo Restoration') ||
        (activeCategory === 'Design' && item.category === 'Photo Design')
      ));
    }
  }, [activeCategory, items]);

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Previous Work Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[4px]">
              <Briefcase size={14} /> Masterpieces
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
              Previous <span className="text-primary underline underline-offset-[12px] decoration-primary/20">Work</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl italic">
              Explore our gallery of professional restorations, custom designs, and premium framing projects.
            </p>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 glass p-2 rounded-2xl border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-black shadow-neon' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 glass rounded-[40px] animate-pulse border-white/5" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <GlassCard className="p-0 h-full flex flex-col group overflow-hidden border-white/5 hover:border-primary/30 transition-all duration-500">
                    <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
                      <img 
                        src={item.afterImage || item.image || item.beforeImage} 
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[8px] text-white uppercase font-black tracking-[2px] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.category}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      <div className="absolute bottom-8 left-8 right-8 space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-xl font-black text-white italic tracking-tight">{item.title}</h3>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[3px]">{item.category}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-40 glass rounded-[40px] border-dashed border-white/10">
            <RotateCcw size={48} className="mx-auto text-gray-800 mb-6 animate-spin-slow" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No masterpieces in this category yet.</p>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="pt-24 border-t border-white/5 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] font-black uppercase tracking-[4px]">
                <Star size={14} /> Client Feedbacks
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
               Customer <span className="text-primary">Reviews</span>
             </h2>
             <p className="text-gray-400 text-lg italic">
               See what our clients say about our craftsmanship and commitment to quality.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-10 h-full relative group hover:border-primary/30 transition-all duration-500 border-white/5">
                   <Quote className="absolute top-8 right-8 text-white/5 w-16 h-16 group-hover:text-primary/5 transition-colors" />
                   
                   <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < (review.rating || 5) ? "fill-primary text-primary" : "text-gray-800"} />
                      ))}
                   </div>
                   
                   <p className="text-gray-300 text-lg leading-relaxed mb-8 italic font-medium relative z-10">
                     &ldquo;{review.comment}&rdquo;
                   </p>
                   
                   <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl italic">
                         {review.name.charAt(0)}
                      </div>
                      <div>
                         <h4 className="text-white font-black text-sm uppercase tracking-wider">{review.name}</h4>
                         <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{review.role || 'Verified Customer'}</span>
                      </div>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-8">
             <Link href="/contact" className="btn-primary inline-flex items-center gap-3 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-neon">
                Share Your Experience <ArrowRight size={18} />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
