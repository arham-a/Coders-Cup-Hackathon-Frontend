'use client';

import { motion } from 'framer-motion';
import { Loan } from '@/lib/types/loan';
import { User } from '@/lib/types/user';
import { Eye, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import Link from 'next/link';

interface LoanCardProps {
  loan: Loan;
  user: User;
  index: number;
}

export function LoanCard({ loan, user, index }: LoanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{user.fullName}</h3>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
        <StatusBadge status={loan.status} size="sm" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Principal</p>
            <p className="text-sm font-semibold text-gray-900">PKR {loan.principalAmount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{loan.interestRate}% interest</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Tenure</p>
            <p className="text-sm font-semibold text-gray-900">{loan.tenureMonths} months</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Repaid</p>
            <p className="text-sm font-semibold text-green-600">PKR {loan.totalRepaid.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Outstanding</p>
            <p className="text-sm font-semibold text-orange-600">PKR {loan.outstandingBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-gray-100">
        <Link
          href={`/admin/loans/${loan.id}`}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
