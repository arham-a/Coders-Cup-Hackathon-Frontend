'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  color?: 'orange' | 'red' | 'green' | 'purple';
  delay?: number;
}

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'orange',
  delay = 0
}: AdminStatCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'orange':
        return 'text-orange-500';
      case 'red':
        return 'text-red-500';
      case 'green':
        return 'text-green-500';
      case 'purple':
        return 'text-purple-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2 break-words">{value}</p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">{subtitle}</p>
          )}
        </div>
        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${getColorClasses()} flex-shrink-0 ml-2`} />
      </div>
    </motion.div>
  );
}
