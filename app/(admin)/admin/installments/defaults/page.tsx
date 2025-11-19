'use client';

import { useState, useEffect } from 'react';
import { mockAllInstallments, mockLoans, getUserById, getRiskProfileByUserId } from '@/lib/mock/adminMockData';
import { InstallmentStatus } from '@/lib/types/installment';
import { LoanStatus } from '@/lib/types/loan';
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminStatCard } from '@/components/dashboard/AdminStatCard';
import { DefaultedLoanCard } from '@/components/admin/DefaultedLoanCard';
import { EmptyState } from '@/components/admin/EmptyState';
import { adminService, DefaultedLoan } from '@/lib/services/adminService';

export default function DefaultedLoansPage() {
  const [defaultedLoans, setDefaultedLoans] = useState<DefaultedLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalDefaulted: 0,
    totalOutstanding: 0,
    averageDefaultTime: 0,
  });

  useEffect(() => {
    const fetchDefaultedLoans = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDefaultedLoans();
        setDefaultedLoans(response.data.defaultedLoans);
        setSummary(response.data.summary);
      } catch (error) {
        console.error('Failed to fetch defaulted loans, using mock data:', error);
        const mockDefaultedLoans = mockLoans.filter(l => l.status === LoanStatus.DEFAULTED);
        const mockInstallments = mockAllInstallments.filter(
          i => i.status === InstallmentStatus.DEFAULTED
        );
        setDefaultedLoans(mockDefaultedLoans as any);
        setSummary({
          totalDefaulted: mockDefaultedLoans.length,
          totalOutstanding: mockDefaultedLoans.reduce((sum, l) => sum + l.outstandingBalance, 0),
          averageDefaultTime: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultedLoans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading defaulted loans...</p>
        </div>
      </div>
    );
  }

  const defaultedInstallments = mockAllInstallments.filter(
    i => i.status === InstallmentStatus.DEFAULTED
  );
  
  const totalOutstanding = summary.totalOutstanding;

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
          value={summary.totalDefaulted.toString()}
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
          title="Avg Days in Default"
          value={Math.round(summary.averageDefaultTime).toString()}
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

