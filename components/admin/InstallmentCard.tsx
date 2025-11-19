'use client';

import { motion } from 'framer-motion';
import { User, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { Installment, InstallmentStatus } from '@/lib/types/installment';

interface InstallmentCardProps {
  installment: Installment;
  userName: string;
  userEmail: string;
  index: number;
}

export function InstallmentCard({ installment, userName, userEmail, index }: InstallmentCardProps) {
  const getStatusColor = (status: InstallmentStatus) => {
    const styles = {
      [InstallmentStatus.PENDING]: 'text-yellow-600',
      [InstallmentStatus.PAID]: 'text-green-600',
      [InstallmentStatus.OVERDUE]: 'text-red-600',
      [InstallmentStatus.DEFAULTED]: 'text-purple-600'
    };
    return styles[status];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{userName}</h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{userEmail}</p>
        </div>
        <span className={`text-xs font-bold whitespace-nowrap ml-2 ${getStatusColor(installment.status)}`}>
          {installment.status}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-600">Installment #{installment.installmentNumber}</span>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-900">{new Date(installment.dueDate).toLocaleDateString()}</span>
          </div>
        </div>

        {installment.daysOverdue > 0 && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{installment.daysOverdue} days overdue</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Amount</p>
            <p className="font-semibold text-gray-900 text-sm mt-1">
              PKR {installment.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Fine</p>
            <p className="font-semibold text-red-600 text-sm mt-1">
              PKR {installment.fineAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Due</p>
            <p className="font-bold text-orange-600 text-sm mt-1">
              PKR {installment.totalDue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
