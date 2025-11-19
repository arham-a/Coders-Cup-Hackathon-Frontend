'use client';

import { Installment } from '@/lib/types/installment';
import { Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface InstallmentDetailCardProps {
  installment: Installment;
  index: number;
}

export function InstallmentDetailCard({ installment, index }: InstallmentDetailCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-900">
          Installment #{installment.installmentNumber}
        </span>
        <StatusBadge status={installment.status} size="sm" />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Amount</p>
            <p className="text-sm font-semibold text-gray-900">PKR {installment.amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Fine</p>
            <p className="text-sm font-semibold text-red-600">PKR {installment.fineAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Total Due</p>
            <p className="text-sm font-bold text-gray-900">PKR {installment.totalDue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Due Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(installment.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Paid Date */}
      {installment.paidDate && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">Paid on: {new Date(installment.paidDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
