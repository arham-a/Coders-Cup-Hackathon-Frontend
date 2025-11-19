'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loan } from '@/lib/types/loan';
import { User } from '@/lib/types/user';
import { RiskLevel } from '@/lib/types/risk';
import { StatusBadge } from './StatusBadge';
import { DefaultedLoan } from '@/lib/services/adminService';
import { Modal } from '../ui/Modal';

interface RiskProfile {
  userId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskReasons: string[];
  recommendedMaxLoan: number;
  recommendedTenure: number;
  defaultProbability: number;
  lastCalculated: string;
}

interface DefaultedLoanCardProps {
  loan: Loan | DefaultedLoan | any;
  user: User | any;
  riskProfile?: RiskProfile;
  defaultedCount: number;
  index: number;
}

export function DefaultedLoanCard({ loan, user, riskProfile, defaultedCount, index }: DefaultedLoanCardProps) {
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [sendingNotice, setSendingNotice] = React.useState(false);

  const handleSendLegalNotice = async () => {
    if (!confirm(`Send legal notice to ${user?.fullName || 'this user'}?`)) return;

    try {
      setSendingNotice(true);
      // Call API to send legal notice
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/send-legal-notice/${loan.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to send legal notice');

      alert('Legal notice sent successfully!');
    } catch (error) {
      console.error('Failed to send legal notice:', error);
      alert('Failed to send legal notice. Please try again.');
    } finally {
      setSendingNotice(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-sm border border-red-300 p-4 sm:p-6 hover:shadow-md transition-shadow"
      >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user?.fullName || 'N/A'}</h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.email || 'N/A'}</p>
          <p className="text-xs sm:text-sm text-gray-500">{user?.phone || 'N/A'}</p>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <StatusBadge status={loan?.status || 'DEFAULTED'} size="sm" />
          {riskProfile && (
            <p className="text-xs text-gray-500 mt-1">
              Risk: {riskProfile.riskLevel}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Principal</p>
          <p className="font-medium text-gray-900 text-sm sm:text-base">PKR {(loan?.principalAmount || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Outstanding</p>
          <p className="font-bold text-red-600 text-sm sm:text-base">PKR {(loan?.outstandingBalance || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Repaid</p>
          <p className="font-medium text-green-600 text-sm sm:text-base">PKR {(loan?.totalRepaid || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Total Fines</p>
          <p className="font-medium text-orange-600 text-sm sm:text-base">PKR {(loan?.totalFines || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Defaulted Installments</p>
          <p className="font-bold text-red-600 text-sm sm:text-base">{defaultedCount || 0}</p>
        </div>
      </div>

      {riskProfile && riskProfile.riskReasons.length > 0 && (
        <div className="bg-red-50 rounded-lg p-3 sm:p-4 mb-4">
          <p className="text-xs sm:text-sm font-semibold text-red-900 mb-2">AI Risk Factors:</p>
          <ul className="space-y-1">
            {riskProfile.riskReasons.slice(0, 3).map((reason: string, idx: number) => (
              <li key={idx} className="text-xs sm:text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">•</span>
                <span className="break-words">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-4 border-t border-gray-200">
        <button 
          onClick={() => setShowContactModal(true)}
          className="px-3 sm:px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
        >
          Contact User
        </button>
        <button 
          onClick={handleSendLegalNotice}
          disabled={sendingNotice}
          className="px-3 sm:px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sendingNotice ? 'Sending...' : 'Send Legal Notice'}
        </button>
      </div>
    </motion.div>

    {/* Contact Details Modal */}
    <Modal
      isOpen={showContactModal}
      onClose={() => setShowContactModal(false)}
      title="Contact Details"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700">Full Name</label>
          <p className="text-base text-gray-900 mt-1">{user?.fullName || 'N/A'}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Email</label>
          <p className="text-base text-gray-900 mt-1">{user?.email || 'N/A'}</p>
          {user?.email && (
            <a
              href={`mailto:${user.email}`}
              className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
            >
              Send Email
            </a>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Phone</label>
          <p className="text-base text-gray-900 mt-1">{user?.phone || 'N/A'}</p>
          {user?.phone && (
            <a
              href={`tel:${user.phone}`}
              className="text-sm text-blue-600 hover:text-blue-700 mt-1 inline-block"
            >
              Call Now
            </a>
          )}
        </div>

        {user?.address && (
          <div>
            <label className="text-sm font-semibold text-gray-700">Address</label>
            <p className="text-base text-gray-900 mt-1">{user.address}</p>
          </div>
        )}

        {user?.city && (
          <div>
            <label className="text-sm font-semibold text-gray-700">City</label>
            <p className="text-base text-gray-900 mt-1">{user.city}, {user?.province || ''}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <label className="text-sm font-semibold text-gray-700">Loan Status</label>
          <p className="text-base text-red-600 font-semibold mt-1">DEFAULTED</p>
          <p className="text-sm text-gray-600 mt-1">
            Outstanding: PKR {(loan?.outstandingBalance || 0).toLocaleString()}
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowContactModal(false)}
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  </>
  );
}
