'use client';

import { motion } from 'framer-motion';

interface AdminWelcomeBannerProps {
  title: string;
  subtitle: string;
}

export function AdminWelcomeBanner({ title, subtitle }: AdminWelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-xl shadow-lg p-6 md:p-8 text-white relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-32 translate-x-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl translate-y-24 -translate-x-24 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">            
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              {title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-orange-50 text-sm md:text-base"
            >
              {subtitle}
            </motion.p>
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex items-center gap-4 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-200 rounded-full animate-pulse" />
            <span className="text-orange-50">System Active</span>
          </div>
          <div className="h-4 w-px bg-orange-300/30" />
          <span className="text-orange-50">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
