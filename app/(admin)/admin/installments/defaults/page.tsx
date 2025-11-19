'use client';

import { mockAllInstallments, mockLoans, getUserById, getRiskProfileByUserId } from '@/lib/mock/adminMockData';
import { InstallmentStatus } from '@/lib/types/installment';
import { LoanStatus } from '@/lib/types/loan';
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminStatCard } from '@/components/dashboard/AdminStatCard';
import { DefaultedLoanCard } from '@/components/admin/DefaultedLoanCard';
import { EmptyState } from '@/components/admin/EmptyState';

export default function DefaultedLoansPage() {
  const defaultedInstallments = mockAllInstallments.filter(
    i => i.status === InstallmentStatus.DEFAULTED
  );
  
  const defaultedLoans = mockLoans.filter(l => l.status === LoanStatus.DEFAULTED);

  const totalOutstanding = defaultedLoans.reduce((sum, l) => sum + l.outstandingBalance, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Defaulted Loans</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Critical cases requiring immediate action</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <AdminStatCard
          title="Defaulted Loans"
          value={defaultedLoans.length.toString()}
          icon={AlertTriangle}
          color="red"
          delay={0.1}
        />
        <AdminStatCard
          title="Total Outstanding"
          value={`PKR ${totalOutstanding.toLocaleString()}`}
          icon={TrendingDown}
          color="purple"
          delay={0.2}
        />
        <AdminStatCard
          title="Defaulted Installments"
          value={defaultedInstallments.length.toString()}
          icon={Shield}
          color="orange"
          delay={0.3}
        />
      </div>

      {/* Defaulted Loans List */}
      <div className="space-y-3 sm:space-y-4">
        {defaultedLoans.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No Defaults!"
            description="All loans are performing well."
            iconColor="text-green-500"
          />
        ) : (
          defaultedLoans.map((loan, index) => {
            const user = getUserById(loan.userId);
            const riskProfile = getRiskProfileByUserId(loan.userId);
            const loanInstallments = mockAllInstallments.filter(i => i.loanId === loan.id);
            const defaultedCount = loanInstallments.filter(i => i.status === InstallmentStatus.DEFAULTED).length;

            if (!user) return null;

            return (
              <DefaultedLoanCard
                key={loan.id}
                loan={loan}
                user={user}
                riskProfile={riskProfile}
                defaultedCount={defaultedCount}
                index={index}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

