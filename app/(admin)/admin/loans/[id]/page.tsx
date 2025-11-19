'use client';

import { use, useEffect, useState } from 'react';
import { mockLoans, getUserById, getInstallmentsByLoanId } from '@/lib/mock/adminMockData';
import { DollarSign, Calendar, TrendingUp, AlertCircle, ArrowLeft, User, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AdminStatCard } from '@/components/dashboard/AdminStatCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { LoanDetailCard } from '@/components/admin/LoanDetailCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ProgressBar } from '@/components/admin/ProgressBar';
import { InstallmentDetailCard } from '@/components/admin/InstallmentDetailCard';
import { adminService } from '@/lib/services/adminService';

export default function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loanData, setLoanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);
        const response = await adminService.getLoanById(id);
        setLoanData(response.data);
      } catch (error) {
        console.error('Failed to fetch loan details, using mock data:', error);
        const loan = mockLoans.find(l => l.id === id);
        if (loan) {
          const installments = getInstallmentsByLoanId(loan.id);
          const user = getUserById(loan.userId);
          setLoanData({
            loan,
            user,
            installments,
            installmentStats: {
              total: installments.length,
              paid: installments.filter(i => i.status === 'PAID').length,
              pending: installments.filter(i => i.status === 'PENDING').length,
              overdue: installments.filter(i => i.status === 'OVERDUE').length,
              defaulted: installments.filter(i => i.status === 'DEFAULTED').length,
            },
            paymentHistory: {
              onTimePayments: installments.filter(i => i.status === 'PAID' && i.daysOverdue === 0).length,
              latePayments: installments.filter(i => i.status === 'PAID' && i.daysOverdue > 0).length,
              missedPayments: installments.filter(i => i.status === 'OVERDUE' || i.status === 'DEFAULTED').length,
            },
            riskAnalysis: {
              userRiskProfile: null,
              loanPerformance: {
                paymentSuccessRate: 85,
                onTimePaymentRate: '75',
                missedPaymentCount: 2,
              },
              loanHealthScore: 75,
            },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading loan details...</p>
        </div>
      </div>
    );
  }

  if (!loanData || !loanData.loan || !loanData.user) {

    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Loan not found</p>
        <Link href="/admin/loans" className="text-orange-500 hover:text-orange-600 mt-4 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="h-4 w-4" />
          Back to Loans
        </Link>
      </div>
    );
  }

  const { loan, user, installments, installmentStats, paymentHistory, riskAnalysis } = loanData;

  const installmentColumns: Column[] = [
    { header: '#', accessor: (i: any) => <p className="text-sm text-gray-900">#{i.installmentNumber}</p> },
    { header: 'Amount', accessor: (i: any) => <p className="text-sm text-gray-900">PKR {i.amount.toLocaleString()}</p> },
    { header: 'Fine', accessor: (i: any) => <p className="text-sm text-red-600">PKR {i.fineAmount.toLocaleString()}</p> },
    { header: 'Total Due', accessor: (i: any) => <p className="text-sm font-medium text-gray-900">PKR {i.totalDue.toLocaleString()}</p> },
    { header: 'Due Date', accessor: (i: any) => <p className="text-sm text-gray-900">{new Date(i.dueDate).toLocaleDateString()}</p> },
    { header: 'Paid Date', accessor: (i: any) => <p className="text-sm text-gray-900">{i.paidDate ? new Date(i.paidDate).toLocaleDateString() : '-'}</p> },
    { header: 'Status', accessor: (i: any) => <StatusBadge status={i.status} size="sm" /> }
  ];

  const borrowerItems = [
    { label: 'Name', value: user.fullName },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone }
  ];

  const loanDetailItems = [
    { label: 'Interest Rate', value: `${loan.interestRate}% per annum` },
    { label: 'Tenure', value: `${loan.tenureMonths} months` },
    { label: 'Total Amount', value: `PKR ${loan.totalAmount.toLocaleString()}` },
    { label: 'Start Date', value: new Date(loan.startDate).toLocaleDateString() },
    { label: 'End Date', value: new Date(loan.endDate).toLocaleDateString() },
    { label: 'Total Fines', value: `PKR ${loan.totalFines.toLocaleString()}`, highlight: 'red' as const }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/admin/loans" className="text-orange-500 hover:text-orange-600 text-sm mb-3 inline-flex items-center gap-2 font-medium hover:gap-3 transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back to Loans
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mt-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Loan Details</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">Loan ID: {loan.id}</p>
          </div>
          <div className="self-start sm:self-auto">
            <StatusBadge status={loan.status} size="md" />
          </div>
        </div>
      </motion.div>

      {/* Borrower Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }} 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-orange-500" />
          Borrower Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {borrowerItems.map((item, index) => (
            <div key={index}>
              <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
              <p className="font-medium text-gray-900 mt-1 text-sm sm:text-base break-words">{item.value}</p>
            </div>
          ))}
        </div>
        <Link 
          href={`/admin/users/${user.id}`} 
          className="text-sm text-orange-500 hover:text-orange-600 mt-4 inline-flex items-center gap-1 font-medium group"
        >
          View Full Profile 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </motion.div>

      {/* Loan Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <AdminStatCard 
          title="Principal Amount" 
          value={`PKR ${loan.principalAmount.toLocaleString()}`} 
          icon={DollarSign} 
          color="orange" 
          delay={0.2} 
        />
        <AdminStatCard 
          title="Total Repaid" 
          value={`PKR ${loan.totalRepaid.toLocaleString()}`} 
          icon={TrendingUp} 
          color="green" 
          delay={0.3} 
        />
        <AdminStatCard 
          title="Outstanding" 
          value={`PKR ${loan.outstandingBalance.toLocaleString()}`} 
          icon={AlertCircle} 
          color="red" 
          delay={0.4} 
        />
        <AdminStatCard 
          title="Monthly Installment" 
          value={`PKR ${loan.monthlyInstallment.toLocaleString()}`} 
          icon={Calendar} 
          color="purple" 
          delay={0.5} 
        />
      </div>

      {/* Loan Details */}
      <LoanDetailCard 
        title="Loan Details" 
        items={loanDetailItems} 
        delay={0.6}
      >
        <ProgressBar 
          label="Repayment Progress" 
          value={loan.totalRepaid} 
          max={loan.totalAmount}
          color="orange"
        />
      </LoanDetailCard>

      {/* Installment Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.7 }} 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Installment Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{installmentStats.total}</p>
            <p className="text-xs text-gray-600 mt-1">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{installmentStats.paid}</p>
            <p className="text-xs text-gray-600 mt-1">Paid</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{installmentStats.pending}</p>
            <p className="text-xs text-gray-600 mt-1">Pending</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{installmentStats.overdue}</p>
            <p className="text-xs text-gray-600 mt-1">Overdue</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{installmentStats.defaulted}</p>
            <p className="text-xs text-gray-600 mt-1">Defaulted</p>
          </div>
        </div>
      </motion.div>

      {/* Risk Analysis */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.8 }} 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Risk Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Risk Profile */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">User Risk Profile</h3>
            {riskAnalysis.userRiskProfile ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <span className={`text-sm font-bold ${
                    riskAnalysis.userRiskProfile.riskLevel === 'LOW' ? 'text-green-600' :
                    riskAnalysis.userRiskProfile.riskLevel === 'MEDIUM' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {riskAnalysis.userRiskProfile.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risk Score:</span>
                  <span className="text-sm font-medium text-gray-900">{riskAnalysis.userRiskProfile.riskScore}/100</span>
                </div>
                {riskAnalysis.userRiskProfile.defaultProbability !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Default Probability:</span>
                    <span className="text-sm font-medium text-gray-900">{(riskAnalysis.userRiskProfile.defaultProbability * 100).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No risk profile available</p>
            )}
          </div>

          {/* Loan Performance */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Loan Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Success Rate:</span>
                <span className="text-sm font-bold text-green-600">{riskAnalysis.loanPerformance.paymentSuccessRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">On-Time Payment Rate:</span>
                <span className="text-sm font-medium text-gray-900">{riskAnalysis.loanPerformance.onTimePaymentRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Missed Payments:</span>
                <span className="text-sm font-medium text-red-600">{riskAnalysis.loanPerformance.missedPaymentCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loan Health Score */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-900">Loan Health Score</h3>
            <span className={`text-2xl font-bold ${
              riskAnalysis.loanHealthScore >= 80 ? 'text-green-600' :
              riskAnalysis.loanHealthScore >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {riskAnalysis.loanHealthScore}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                riskAnalysis.loanHealthScore >= 80 ? 'bg-green-500' :
                riskAnalysis.loanHealthScore >= 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${riskAnalysis.loanHealthScore}%` }}
            />
          </div>
        </div>

        {/* Payment History */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Payment History</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{paymentHistory.onTimePayments}</p>
                <p className="text-xs text-gray-500">On-Time</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{paymentHistory.latePayments}</p>
                <p className="text-xs text-gray-500">Late</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{paymentHistory.missedPayments}</p>
                <p className="text-xs text-gray-500">Missed</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Installments */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.9 }} 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Installment Schedule</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {installments.length} installment{installments.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Table View (Desktop) */}
        <div className="hidden lg:block overflow-x-auto">
          <DataTable columns={installmentColumns} data={installments} />
        </div>

        {/* Card View (Mobile/Tablet) */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {installments.map((installment, index) => (
            <InstallmentDetailCard
              key={installment.id}
              installment={installment}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
