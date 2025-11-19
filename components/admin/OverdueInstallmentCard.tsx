'use client';

import { motion } from 'framer-motion';
import { Installment } from '@/lib/types/installment';
import { User } from '@/lib/types/user';
import { Mail, Phone } from 'lucide-react';

interface OverdueInstallmentCardProps {
  installment: Installment;
  user: User;
  index: number;
}

export function OverdueInstallmentCard({ installment, user, index }: OverdueInstallmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-red-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.fullName}</h3>
          <p className="text-xs sm:text-sm text-gray-500">Installment #{installment.installmentNumber}</p>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs sm:text-sm rounded-full font-medium self-start sm:self-auto whitespace-nowrap">
          {installment.daysOverdue} days overdue
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Original Amount</p>
          <p className="font-medium text-gray-900 text-sm sm:text-base">PKR {installment.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Fine Amount</p>
          <p className="font-medium text-red-600 text-sm sm:text-base">PKR {installment.fineAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Total Due</p>
          <p className="font-bold text-gray-900 text-sm sm:text-base">PKR {installment.totalDue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Due Date</p>
          <p className="font-medium text-gray-900 text-sm sm:text-base">
            {new Date(installment.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-4 border-t border-gray-200">
        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
          <Mail className="h-4 w-4" />
          Send Reminder
        </button>
        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
          <Phone className="h-4 w-4" />
          Call User
        </button>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto">
          <a
            href={`mailto:${user.email}`}
            className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 truncate"
          >
            {user.email}
          </a>
          <a
            href={`tel:${user.phone}`}
            className="text-xs sm:text-sm text-orange-600 hover:text-orange-700"
          >
            {user.phone}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
