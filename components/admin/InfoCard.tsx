'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
  delay?: number;
}

export function InfoCard({ title, items, delay = 0 }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <Icon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                <p className="font-medium text-gray-900 mt-1 break-words">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
