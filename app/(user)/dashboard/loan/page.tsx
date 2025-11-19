'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Loan, LoanStatus } from '@/lib/types/loan';

export default function LoanPage() {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        // IMPORTANT: Correct real backend API route
        const response = await apiClient.get('/users/loan');
        setLoan(response.data.data);
      } catch (error) {
        console.error('Failed to fetch loan:', error);
        setLoan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Active Loan</h2>
          <p className="text-gray-600 mb-6">
            You don't have any active loans at the moment.
          </p>
          <p className="text-sm text-gray-500">
            Contact your administrator to apply for a new loan based on your risk profile.
          </p>
        </div>
      </motion.div>
    );
  }

  const progressPercentage = ((loan.totalRepaid / loan.totalAmount) * 100).toFixed(1);
  const remainingMonths = loan.installmentSchedule.filter(
    s => new Date(s.dueDate) > new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Details</h1>
        <p className="text-gray-600">Complete overview of your active loan</p>
      </motion.div>

      {/* Loan Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-green-100 text-sm mb-2">Principal Amount</p>
              <h2 className="text-4xl font-bold">
                PKR {loan.principalAmount.toLocaleString()}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{loan.status}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-green-100">Repayment Progress</span>
              <span className="font-semibold">{progressPercentage}%</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-green-300 to-green-100 rounded-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-green-100 mb-1">Total Amount</p>
              <p className="text-lg font-bold">PKR {loan.totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-green-100 mb-1">Outstanding</p>
              <p className="text-lg font-bold">PKR {loan.outstandingBalance.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-green-100 mb-1">Total Repaid</p>
              <p className="text-lg font-bold">PKR {loan.totalRepaid.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-green-100 mb-1">Total Fines</p>
              <p className="text-lg font-bold">PKR {loan.totalFines.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Loan Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Payment Information
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Monthly Installment</span>
              <span className="font-semibold text-gray-900">
                PKR {loan.monthlyInstallment.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Interest Rate</span>
              <span className="font-semibold text-gray-900">{loan.interestRate}% per annum</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Tenure</span>
              <span className="font-semibold text-gray-900">{loan.tenureMonths} months</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Remaining Months</span>
              <span className="font-semibold text-green-600">{remainingMonths} months</span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Timeline
          </h3>
          <div className="space-y-4">
            {/* Start */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Start Date</span>
              <span className="font-semibold text-gray-900">
                {new Date(loan.startDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* End */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">End Date</span>
              <span className="font-semibold text-gray-900">
                {new Date(loan.endDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Created */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Created On</span>
              <span className="font-semibold text-gray-900">
                {new Date(loan.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  loan.status === LoanStatus.ACTIVE
                    ? 'bg-green-100 text-green-700'
                    : loan.status === LoanStatus.COMPLETED
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {loan.status}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Installment Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Installment Schedule
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loan.installmentSchedule.map((schedule, index) => {
                const isPast = new Date(schedule.dueDate) < new Date();
                const isCurrent =
                  new Date(schedule.dueDate).getMonth() === new Date().getMonth();

                return (
                  <tr key={index} className={isCurrent ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Month {schedule.month}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(schedule.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      PKR {schedule.amount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {isPast ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </span>
                      ) : isCurrent ? (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <Clock className="h-4 w-4" />
                          Current
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-4 w-4" />
                          Upcoming
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
