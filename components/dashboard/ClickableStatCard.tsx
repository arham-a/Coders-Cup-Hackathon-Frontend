'use client';

import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ClickableStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'indigo';
  link?: string;
  delay?: number;
}

export function ClickableStatCard({
  title,
  value,
  icon: Icon,
  description,
  color = 'green',
  link,
  delay = 0
}: ClickableStatCardProps) {
  const router = useRouter();

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600';
      case 'blue':
        return 'text-blue-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'red':
        return 'text-red-600';
      case 'purple':
        return 'text-purple-600';
      case 'indigo':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleClick = () => {
    if (link) {
      router.push(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 group ${
        link ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
            {value}
          </h3>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <Icon
          className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${getColorClasses(color)} group-hover:scale-110 transition-transform duration-200`}
        />
      </div>
      {link && (
        <div className="mt-3 flex items-center text-xs sm:text-sm text-gray-500 group-hover:text-green-600 transition-colors">
          <span>View details</span>
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </motion.div>
  );
}
