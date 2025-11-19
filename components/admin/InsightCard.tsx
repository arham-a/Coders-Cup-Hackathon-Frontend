'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  insight: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
}

export function InsightCard({ title, value, insight, icon: Icon, trend = 'neutral', delay = 0 }: InsightCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendBg = () => {
    if (trend === 'up') return 'bg-green-50 border-green-200';
    if (trend === 'down') return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`rounded-xl shadow-sm border p-4 sm:p-6 ${getTrendBg()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${getTrendColor()}`} />
      </div>
      <p className={`text-2xl sm:text-3xl font-bold mb-1 ${getTrendColor()}`}>{value}</p>
      <p className="text-xs sm:text-sm font-medium text-gray-900 mb-2">{title}</p>
      <p className="text-xs text-gray-600">{insight}</p>
    </motion.div>
  );
}
