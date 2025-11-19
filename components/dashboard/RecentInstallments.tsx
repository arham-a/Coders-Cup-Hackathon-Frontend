'use client';

import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Installment, InstallmentStatus } from '@/lib/types/installment';

interface RecentInstallmentsProps {
  installments: Installment[];
}

export function RecentInstallments({ installments }: RecentInstallmentsProps) {
  const getStatusConfig = (status: InstallmentStatus) => {
    switch (status) {
      case InstallmentStatus.PAID:
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'Paid',
        };
      case InstallmentStatus.PENDING:
        return {
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'Pending',
        };
      case InstallmentStatus.OVERDUE:
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          label: 'Overdue',
        };
      case InstallmentStatus.DEFAULTED:
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'Defaulted',
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          label: status,
        };
    }
  };

  if (installments.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Installments</h3>
        <p className="text-sm text-gray-500">
          You don't have any installments yet.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Installments</h3>
          <Link
            href="/dashboard/installments"
            className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            View All →
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {installments.slice(0, 5).map((installment, index) => {
          const statusConfig = getStatusConfig(installment.status);
          const StatusIcon = statusConfig.icon;
          const dueDate = new Date(installment.dueDate);
          const isUpcoming = installment.status === InstallmentStatus.PENDING && 
            dueDate > new Date();

          return (
            <motion.div
              key={installment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${statusConfig.bg} ${statusConfig.border} border flex items-center justify-center flex-shrink-0`}>
                  <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      Installment #{installment.installmentNumber}
                    </h4>
                    <span className={`text-xs font-bold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Due: {dueDate.toLocaleDateString()}
                    </span>
                    {installment.daysOverdue > 0 && (
                      <span className="text-red-600 font-medium">
                        {installment.daysOverdue} days overdue
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="text-blue-600 font-medium">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    PKR {installment.totalDue.toLocaleString()}
                  </p>
                  {installment.fineAmount > 0 && (
                    <p className="text-xs text-red-600">
                      +PKR {installment.fineAmount.toLocaleString()} fine
                    </p>
                  )}
                </div>
              </div>

              {installment.status === InstallmentStatus.PENDING && installment.paymentLink && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={installment.paymentLink}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Pay Now
                    <span className="text-green-200">→</span>
                  </Link>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
