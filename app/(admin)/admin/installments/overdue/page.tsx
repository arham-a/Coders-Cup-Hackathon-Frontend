'use client';

import { useState, useEffect } from 'react';
import { mockAllInstallments, mockLoans, getUserById } from '@/lib/mock/adminMockData';
import { InstallmentStatus } from '@/lib/types/installment';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { OverdueInstallmentCard } from '@/components/admin/OverdueInstallmentCard';
import { EmptyState } from '@/components/admin/EmptyState';
import { adminService, InstallmentWithDetails } from '@/lib/services/adminService';

export default function OverdueInstallmentsPage() {
  const [overdueInstallments, setOverdueInstallments] = useState<InstallmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverdueInstallments = async () => {
      try {
        setLoading(true);
        const response = await adminService.getInstallments({
          status: InstallmentStatus.OVERDUE,
          limit: 100,
        });
        setOverdueInstallments(response.data.installments);
      } catch (error) {
        console.error('Failed to fetch overdue installments, using mock data:', error);
        setOverdueInstallments(mockAllInstallments.filter(
          i => i.status === InstallmentStatus.OVERDUE
        ) as any);
      } finally {
        setLoading(false);
      }
    };

    fetchOverdueInstallments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading overdue installments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Overdue Installments</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Monitor and manage overdue payments</p>
      </motion.div>

      {/* Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-xl sm:text-2xl font-bold text-red-900">{overdueInstallments.length}</p>
            <p className="text-xs sm:text-sm text-red-700">Overdue installments requiring attention</p>
          </div>
        </div>
      </motion.div>

      {/* Overdue List */}
      <div className="space-y-3 sm:space-y-4">
        {overdueInstallments.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="All Clear!"
            description="No overdue installments at the moment."
            iconColor="text-green-500"
          />
        ) : (
          overdueInstallments.map((installment, index) => {
            const user = installment.user || (() => {
              const loan = mockLoans.find(l => l.id === installment.loanId);
              return loan ? getUserById(loan.userId) : null;
            })();

            if (!user) return null;

            return (
              <OverdueInstallmentCard
                key={installment.id}
                installment={installment}
                user={user}
                index={index}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

