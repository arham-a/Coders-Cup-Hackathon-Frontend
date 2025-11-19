'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface DetailItem {
  label: string;
  value: string;
  highlight?: 'red' | 'green' | 'orange';
}

interface LoanDetailCardProps {
  title: string;
  icon?: LucideIcon;
  items: DetailItem[];
  delay?: number;
  children?: React.ReactNode;
}

export function LoanDetailCard({ title, icon: Icon, items, delay = 0, children }: LoanDetailCardProps) {
  const getHighlightClass = (highlight?: 'red' | 'green' | 'orange') => {
    if (!highlight) return 'text-gray-900';
    const classes = {
      red: 'text-red-600',
      green: 'text-green-600',
      orange: 'text-orange-600'
    };
    return classes[highlight];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-orange-500" />}
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
            <p className={`font-medium mt-1 text-sm sm:text-base break-words ${getHighlightClass(item.highlight)}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
      {children}
    </motion.div>
  );
}
