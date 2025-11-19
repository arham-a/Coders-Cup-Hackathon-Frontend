'use client';

import { motion } from 'framer-motion';
import { Installment, InstallmentStatus } from '@/lib/types/installment';
import { User } from '@/lib/types/user';
import { Calendar, DollarSign, AlertCircle, User as UserIcon, Send } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { adminService } from '@/lib/services/adminService';
import { useState } from 'react';

interface InstallmentCardListProps {
  installment: Installment;
  user: User | any;
  index: number;
  onPaymentLinkSent?: () => void;
}

export function InstallmentCardList({ installment, user, index, onPaymentLinkSent }: InstallmentCardListProps) {
  const [sending, setSending] = useState(false);

  const handleSendPaymentLink = async () => {
    if (!confirm(`Send payment link to ${user.fullName}?`)) return;

    try {
      setSending(true);
      await adminService.sendPaymentLink(installment.id);
      alert('Payment link sent successfully!');
      onPaymentLinkSent?.();
    } catch (error) {
      console.error('Failed to send payment link:', error);
      alert('Failed to send payment link. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const canSendPaymentLink = installment.status !== InstallmentStatus.PAID && installment.status !== InstallmentStatus.WAIVED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <UserIcon className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-gray-900 truncate">{user.fullName}</h3>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <StatusBadge status={installment.status} size="sm" />
      </div>

      {/* Installment Number */}
      <div className="mb-3 pb-3 border-b border-gray-100">
        <p className="text-sm text-gray-600">
          Installment <span className="font-semibold text-gray-900">#{installment.installmentNumber}</span>
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Amount</p>
            <p className="text-sm font-semibold text-gray-900">PKR {installment.amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Fine</p>
            <p className="text-sm font-semibold text-red-600">PKR {installment.fineAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <DollarSign className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Total Due</p>
            <p className="text-sm font-bold text-gray-900">PKR {installment.totalDue.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Due Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(installment.dueDate).toLocaleDateString()}
            </p>
            {installment.daysOverdue > 0 && (
              <p className="text-xs text-red-600 font-medium">{installment.daysOverdue} days overdue</p>
            )}
          </div>
        </div>
      </div>

      {/* Send Payment Link Button */}
      {canSendPaymentLink && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={handleSendPaymentLink}
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            {sending ? 'Sending...' : 'Send Payment Link'}
          </button>
        </div>
      )}
    </motion.div>
  );
}
