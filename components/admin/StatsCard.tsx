'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: number;
  color?: 'orange' | 'green' | 'red' | 'blue';
  delay?: number;
}

export function StatsCard({ label, value, color = 'orange', delay = 0 }: StatsCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'orange':
        return 'text-orange-500 border-orange-200';
      case 'green':
        return 'text-green-500 border-green-200';
      case 'red':
        return 'text-red-500 border-red-200';
      case 'blue':
        return 'text-blue-500 border-blue-200';
      default:
        return 'text-gray-500 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`text-center p-4 bg-white rounded-lg border-2 ${getColorClasses()} hover:shadow-md transition-shadow`}
    >
      <p className="text-2xl sm:text-3xl font-bold">{value}</p>
      <p className="text-xs sm:text-sm text-gray-600 mt-1">{label}</p>
    </motion.div>
  );
}
