'use client';

import { motion } from 'framer-motion';
import { Loan } from '@/lib/types/loan';
import { User } from '@/lib/types/user';
import { RiskLevel } from '@/lib/types/risk';
import { StatusBadge } from './StatusBadge';

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
  loan: Loan;
  user: User;
  riskProfile?: RiskProfile;
  defaultedCount: number;
  index: number;
}

export function DefaultedLoanCard({ loan, user, riskProfile, defaultedCount, index }: DefaultedLoanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-red-300 p-4 sm:p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.fullName}</h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
          <p className="text-xs sm:text-sm text-gray-500">{user.phone}</p>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <StatusBadge status={loan.status} size="sm" />
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
          <p className="font-medium text-gray-900 text-sm sm:text-base">PKR {loan.principalAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Outstanding</p>
          <p className="font-bold text-red-600 text-sm sm:text-base">PKR {loan.outstandingBalance.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Repaid</p>
          <p className="font-medium text-green-600 text-sm sm:text-base">PKR {loan.totalRepaid.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Total Fines</p>
          <p className="font-medium text-orange-600 text-sm sm:text-base">PKR {loan.totalFines.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-gray-500">Defaulted Installments</p>
          <p className="font-bold text-red-600 text-sm sm:text-base">{defaultedCount}</p>
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
        <button className="px-3 sm:px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
          Contact User
        </button>
        <button className="px-3 sm:px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
          Legal Action
        </button>
        <button className="px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
          Settlement Plan
        </button>
      </div>
    </motion.div>
  );
}
