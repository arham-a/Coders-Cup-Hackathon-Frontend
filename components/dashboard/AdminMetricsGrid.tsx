'use client';

import { motion } from 'framer-motion';
import { Receipt, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface InstallmentMetrics {
  pending: number;
  overdue: number;
  defaulted: number;
  expectedCollection: number;
}

interface AdminMetricsGridProps {
  metrics: InstallmentMetrics;
}

export function AdminMetricsGrid({ metrics }: AdminMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Pending Installments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Pending Installments</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{metrics.pending}</p>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          Expected: PKR {(metrics.expectedCollection / 1000).toFixed(0)}K
        </p>
      </motion.div>

      {/* Overdue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-red-200 p-4 sm:p-6 bg-red-50"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
          <h3 className="font-semibold text-red-900 text-sm sm:text-base">Overdue</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-red-900">{metrics.overdue}</p>
        <Link 
          href="/admin/installments/overdue" 
          className="text-xs sm:text-sm text-red-600 hover:text-red-700 mt-2 inline-block font-medium"
        >
          View Details →
        </Link>
      </motion.div>

      {/* Defaulted */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 sm:p-6 bg-orange-50 sm:col-span-2 md:col-span-1"
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
          <h3 className="font-semibold text-orange-800 text-sm sm:text-base">Defaulted</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-orange-800">{metrics.defaulted}</p>
        <Link 
          href="/admin/installments/defaults" 
          className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 mt-2 inline-block font-medium"
        >
          View Details →
        </Link>
      </motion.div>
    </div>
  );
}
