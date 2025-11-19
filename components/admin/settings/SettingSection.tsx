'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SettingSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  delay?: number;
}

export function SettingSection({ 
  title, 
  icon: Icon, 
  iconColor = 'text-orange-600',
  children,
  delay = 0 
}: SettingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
