'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Loan, LoanStatus } from '@/lib/types/loan';
import { User } from '@/lib/types/user';
import { DollarSign } from 'lucide-react';

interface AdminRecentLoansProps {
  loans: Loan[] | any[];
  users?: User[];
}

export function AdminRecentLoans({ loans, users = [] }: AdminRecentLoansProps) {
  const getStatusColor = (status: LoanStatus | string) => {
    switch (status) {
      case LoanStatus.ACTIVE:
      case 'ACTIVE':
        return 'text-green-600';
      case LoanStatus.COMPLETED:
      case 'COMPLETED':
        return 'text-blue-600';
      case LoanStatus.DEFAULTED:
      case 'DEFAULTED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Recent Loans</h3>
        <Link 
          href="/admin/loans" 
          className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="space-y-3">
        {loans.length > 0 ? (
          loans.map((loan, index) => {
            // Handle both API format (loan.user) and mock format (loan.userId)
            const userName = loan.user?.fullName || users.find(u => u.id === loan.userId)?.fullName || 'Unknown User';
            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center justify-between gap-3 p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{userName}</p>
                  <p className="text-xs sm:text-sm text-gray-600">PKR {loan.principalAmount.toLocaleString()}</p>
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${getStatusColor(loan.status)}`}>
                  {loan.status}
                </span>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent loans</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
