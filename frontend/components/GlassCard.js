'use client';

import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', animate = true }) {
  const content = (
    <div className={`glass-card p-6 border border-white/5 shadow-glass ${className}`}>
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {content}
    </motion.div>
  );
}
