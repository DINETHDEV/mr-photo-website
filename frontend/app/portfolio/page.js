'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Layers, Filter, Search, RotateCcw } from 'lucide-react';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';
import GlassCard from '@/components/GlassCard';
import { fetchData } from '@/utils/api';

const categories = ['All', 'Photo Restoration', 'Photo Design', 'Frames', 'Printing'];

// Mock data in case DB is empty
const mockPortfolio = [
  {
    _id: '1',
    title: 'Vintage Portrait Restoration',
    category: 'Photo Restoration',
    beforeImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
    afterImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
    isBeforeAfter: true,
  },
  {
    _id: '2',
    title: 'Modern Abstract Frame',
    category: 'Frames',
    beforeImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600',
    isBeforeAfter: false,
  },
  {
    _id: '3',
    title: 'Family Reunion Edit',
    category: 'Photo Design',
    beforeImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
    afterImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&q=80&w=600',
    isBeforeAfter: true,
  },
  {
    _id: '4',
    title: 'Canvas Print - Nature',
    category: 'Printing',
    beforeImage: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600',
    isBeforeAfter: false,
  },
];

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchData('portfolio');
      const finalData = data && data.length > 0 ? data : mockPortfolio;
      setItems(finalData);
      setFilteredItems(finalData);
      setLoading(false);
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, items]);

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-3 text-primary mb-4 font-bold tracking-widest uppercase text-xs">
            <Layers size={16} />
            <span>Showcase</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white">Our Masterpieces</h1>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 glass p-2 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-black shadow-neon' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-80 glass rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <GlassCard className="overflow-hidden p-0 h-full flex flex-col group">
                  <div className="relative aspect-video overflow-hidden bg-black/40">
                    {item.isBeforeAfter && item.afterImage ? (
                      <div className="h-full w-full before-after-container">
                        <ReactBeforeSliderComponent
                          firstImage={{ imageUrl: item.afterImage }}
                          secondImage={{ imageUrl: item.beforeImage }}
                          delimiterColor="#ffaa00"
                        />
                        <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none z-10">
                          <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">Before</span>
                          <span className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-black border border-primary/20">After</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full relative">
                         <img 
                          src={item.beforeImage} 
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                         <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white uppercase font-bold tracking-widest border border-white/10">
                          {item.category}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex justify-between items-center bg-gradient-to-t from-black/20 to-transparent">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-gray-500 text-xs uppercase tracking-widest font-medium">{item.category}</p>
                    </div>
                    <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300">
                      <Camera size={20} />
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
          <RotateCcw size={48} className="mx-auto text-gray-600 mb-6 animate-spin-slow" />
          <p className="text-gray-400 text-lg">No masterpieces found in this category yet.</p>
        </div>
      )}
    </div>
  );
}
