'use client';

import { mockLoans, mockAllInstallments } from '@/lib/mock/adminMockData';
import { TrendingDown, Clock, Target, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoanStatus } from '@/lib/types/loan';
import { InstallmentStatus } from '@/lib/types/installment';
import { DefaultRateByTenureChart } from '@/components/admin/charts/DefaultRateByTenureChart';
import { LoanSizeDistributionChart } from '@/components/admin/charts/LoanSizeDistributionChart';
import { RepaymentTrendChart } from '@/components/admin/charts/RepaymentTrendChart';
import { IncomeVsDefaultChart } from '@/components/admin/charts/IncomeVsDefaultChart';
import { PaymentBehaviorChart } from '@/components/admin/charts/PaymentBehaviorChart';
import { InsightCard } from '@/components/admin/InsightCard';

export default function AnalyticsPage() {
  // Calculate default rate by tenure
  const tenureGroups = [
    { range: '6 months', min: 0, max: 6 },
    { range: '12 months', min: 7, max: 12 },
    { range: '18 months', min: 13, max: 18 },
    { range: '24 months', min: 19, max: 30 }
  ];

  const defaultRateByTenure = tenureGroups.map(group => {
    const loansInRange = mockLoans.filter(l => l.tenureMonths >= group.min && l.tenureMonths <= group.max);
    const defaultedInRange = loansInRange.filter(l => l.status === LoanStatus.DEFAULTED).length;
    return {
      tenure: group.range,
      defaultRate: loansInRange.length > 0 ? (defaultedInRange / loansInRange.length) * 100 : 0,
      totalLoans: loansInRange.length
    };
  });

  // Calculate loan size distribution
  const sizeRanges = [
    { range: '< 50K', min: 0, max: 50000 },
    { range: '50K-100K', min: 50000, max: 100000 },
    { range: '100K-150K', min: 100000, max: 150000 },
    { range: '> 150K', min: 150000, max: Infinity }
  ];

  const loanSizeDistribution = sizeRanges.map(range => ({
    range: range.range,
    count: mockLoans.filter(l => l.principalAmount >= range.min && l.principalAmount < range.max).length
  }));

  // Calculate repayment trend (last 6 months based on actual installment data)
  const getMonthName = (monthIndex: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthIndex];
  };

  const now = new Date();
  const repaymentTrend = Array.from({ length: 6 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthIndex = monthDate.getMonth();
    const year = monthDate.getFullYear();

    // Get installments for this month
    const monthInstallments = mockAllInstallments.filter(inst => {
      const dueDate = new Date(inst.dueDate);
      return dueDate.getMonth() === monthIndex && dueDate.getFullYear() === year;
    });

    const collected = monthInstallments
      .filter(i => i.status === InstallmentStatus.PAID)
      .reduce((sum, i) => sum + i.amount, 0);

    const expected = monthInstallments.reduce((sum, i) => sum + i.amount, 0);

    return {
      month: getMonthName(monthIndex),
      collected,
      expected
    };
  });

  // Income vs Default analysis (using actual user income from loans)
  const incomeVsDefault = mockLoans.map(loan => {
    // Calculate estimated income based on loan amount and tenure (typical lending ratio)
    const estimatedIncome = loan.principalAmount / (loan.tenureMonths * 0.3); // 30% of monthly income rule
    return {
      income: estimatedIncome,
      loanAmount: loan.principalAmount,
      defaulted: loan.status === LoanStatus.DEFAULTED
    };
  });

  // Payment behavior
  const onTimePayments = mockAllInstallments.filter(i => 
    i.status === InstallmentStatus.PAID && i.daysOverdue === 0
  ).length;
  const latePayments = mockAllInstallments.filter(i => 
    i.status === InstallmentStatus.PAID && i.daysOverdue > 0
  ).length;
  const overduePayments = mockAllInstallments.filter(i => 
    i.status === InstallmentStatus.OVERDUE
  ).length;
  const defaultedPayments = mockAllInstallments.filter(i => 
    i.status === InstallmentStatus.DEFAULTED
  ).length;

  const paymentBehavior = [
    { name: 'On-Time', value: onTimePayments, color: '#10b981' },
    { name: 'Late Paid', value: latePayments, color: '#f59e0b' },
    { name: 'Overdue', value: overduePayments, color: '#ef4444' },
    { name: 'Defaulted', value: defaultedPayments, color: '#7c3aed' }
  ];

  // Calculate insights
  const avgDaysToDefault = mockAllInstallments
    .filter(i => i.status === InstallmentStatus.DEFAULTED)
    .reduce((sum, i) => sum + i.daysOverdue, 0) / 
    mockAllInstallments.filter(i => i.status === InstallmentStatus.DEFAULTED).length || 0;

  const collectionEfficiency = repaymentTrend.length > 0
    ? (repaymentTrend.reduce((sum, m) => sum + m.collected, 0) / 
       repaymentTrend.reduce((sum, m) => sum + m.expected, 0) * 100)
    : 0;

  // Calculate average loan-to-income ratio based on estimated income
  const avgLoanToIncome = mockLoans.reduce((sum, l) => {
    const estimatedIncome = l.principalAmount / (l.tenureMonths * 0.3);
    return sum + (l.principalAmount / estimatedIncome);
  }, 0) / mockLoans.length;

  const earlyDefaultRate = mockLoans.filter(l => 
    l.status === LoanStatus.DEFAULTED && l.tenureMonths <= 12
  ).length / mockLoans.filter(l => l.tenureMonths <= 12).length * 100 || 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Deep insights into loan performance and risk patterns</p>
      </motion.div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <InsightCard
          title="Avg Days to Default"
          value={`${avgDaysToDefault.toFixed(0)} days`}
          insight="Average time before payment defaults"
          icon={Clock}
          trend="down"
          delay={0.1}
        />
        <InsightCard
          title="Collection Efficiency"
          value={`${collectionEfficiency.toFixed(1)}%`}
          insight="Actual vs expected collections"
          icon={Target}
          trend={collectionEfficiency >= 95 ? 'up' : 'neutral'}
          delay={0.15}
        />
        <InsightCard
          title="Loan-to-Income Ratio"
          value={`${avgLoanToIncome.toFixed(1)}x`}
          insight="Average loan size vs monthly income"
          icon={TrendingDown}
          trend="neutral"
          delay={0.2}
        />
        <InsightCard
          title="Early Default Rate"
          value={`${earlyDefaultRate.toFixed(1)}%`}
          insight="Defaults within first 12 months"
          icon={AlertCircle}
          trend="down"
          delay={0.25}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <RepaymentTrendChart data={repaymentTrend} />
        <LoanSizeDistributionChart data={loanSizeDistribution} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DefaultRateByTenureChart data={defaultRateByTenure} />
        <PaymentBehaviorChart data={paymentBehavior} />
      </div>

      {/* Full Width Chart */}
      <IncomeVsDefaultChart data={incomeVsDefault} />
    </div>
  );
}

