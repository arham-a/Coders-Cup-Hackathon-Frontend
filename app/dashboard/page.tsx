'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { LoanSummary } from '@/components/dashboard/LoanSummary';
import { RecentInstallments } from '@/components/dashboard/RecentInstallments';
import { ClickableStatCard } from '@/components/dashboard/ClickableStatCard';
import { DollarSign, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Loan } from '@/lib/types/loan';
import { Installment } from '@/lib/types/installment';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch loan data from API
        try {
          const loanResponse = await apiClient.get('/user/loan');
          setLoan(loanResponse.data.data);
        } catch (apiError) {
          console.log('API not available, using mock data');
          // Use mock data if API fails
          const { mockLoan } = await import('@/lib/mock/mockData');
          setLoan(mockLoan);
        }

        // Try to fetch installments from API
        try {
          const installmentsResponse = await apiClient.get('/user/installments', {
            params: { limit: 5 }
          });
          setInstallments(installmentsResponse.data.data.installments || []);
        } catch (apiError) {
          console.log('API not available, using mock data');
          // Use mock data if API fails
          const { mockInstallments } = await import('@/lib/mock/mockData');
          setInstallments(mockInstallments.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const pendingInstallments = installments.filter(i => i.status === 'PENDING').length;
  const overdueInstallments = installments.filter(i => i.status === 'OVERDUE').length;
  const nextPaymentDue = installments.find(i => i.status === 'PENDING');

  // Stats card configuration with navigation
  const overdueColor: 'red' | 'green' = overdueInstallments > 0 ? 'red' : 'green';
  
  const statsCards = [
    {
      title: 'Outstanding Balance',
      value: loan ? `PKR ${loan.outstandingBalance.toLocaleString()}` : 'N/A',
      icon: DollarSign,
      description: loan ? 'Remaining loan amount' : 'No active loan',
      color: 'green' as 'green',
      link: '/dashboard/loan'
    },
    {
      title: 'Monthly Payment',
      value: loan ? `PKR ${loan.monthlyInstallment.toLocaleString()}` : 'N/A',
      icon: Calendar,
      description: loan ? 'Due every month' : 'No active loan',
      color: 'blue' as 'blue',
      link: '/dashboard/loan'
    },
    {
      title: 'Pending Payments',
      value: pendingInstallments,
      icon: TrendingUp,
      description: `${pendingInstallments} installment${pendingInstallments !== 1 ? 's' : ''} pending`,
      color: 'yellow' as 'yellow',
      link: '/dashboard/installments'
    },
    {
      title: 'Overdue',
      value: overdueInstallments,
      icon: AlertCircle,
      description: overdueInstallments > 0 ? 'Requires immediate attention' : 'All payments on track',
      color: overdueColor,
      link: '/dashboard/installments'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Banner */}
      <WelcomeBanner userName={user?.fullName || 'User'} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((card, index) => (
          <ClickableStatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={card.description}
            color={card.color}
            link={card.link}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Loan Summary - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <LoanSummary loan={loan} />
        </div>

        {/* Next Payment Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Next Payment</h3>
          {nextPaymentDue ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Due Date</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {new Date(nextPaymentDue.dueDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  PKR {nextPaymentDue.totalDue.toLocaleString()}
                </p>
              </div>
              {nextPaymentDue.paymentLink && (
                <a
                  href={nextPaymentDue.paymentLink}
                  className="block w-full text-center px-4 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Pay Now
                </a>
              )}
              <button
                onClick={() => router.push('/dashboard/installments')}
                className="block w-full text-center px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
              >
                View All Installments
              </button>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-xs sm:text-sm text-gray-500">No upcoming payments</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Installments */}
      <RecentInstallments installments={installments} />
    </div>
  );
}
