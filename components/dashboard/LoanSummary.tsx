'use client';

import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Loan } from '@/lib/types/loan';

interface LoanSummaryProps {
  loan: Loan | null;
}

export function LoanSummary({ loan }: LoanSummaryProps) {
  if (!loan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Loan</h3>
        <p className="text-sm text-gray-500 mb-4">
          You don't have any active loans at the moment.
        </p>
        <p className="text-xs text-gray-400">
          Contact admin to apply for a new loan
        </p>
      </motion.div>
    );
  }

  const progressPercentage = ((loan.totalRepaid / loan.totalAmount) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-green-100 text-sm mb-1">Active Loan</p>
            <h2 className="text-3xl font-bold">PKR {loan.principalAmount.toLocaleString()}</h2>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-100">Repayment Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-300 to-green-100 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* Loan Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-green-200" />
              <p className="text-xs text-green-100">Monthly Payment</p>
            </div>
            <p className="text-lg font-bold">PKR {loan.monthlyInstallment.toLocaleString()}</p>
          </div>

          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-green-200" />
              <p className="text-xs text-green-100">Tenure</p>
            </div>
            <p className="text-lg font-bold">{loan.tenureMonths} months</p>
          </div>

          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-200" />
              <p className="text-xs text-green-100">Outstanding</p>
            </div>
            <p className="text-lg font-bold">PKR {loan.outstandingBalance.toLocaleString()}</p>
          </div>

          <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-200" />
              <p className="text-xs text-green-100">Paid</p>
            </div>
            <p className="text-lg font-bold">PKR {loan.totalRepaid.toLocaleString()}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Active</span>
        </div>
      </div>
    </motion.div>
  );
}
