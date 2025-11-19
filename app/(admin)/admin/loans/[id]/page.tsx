'use client';

import { use } from 'react';
import { mockLoans, getUserById, getInstallmentsByLoanId } from '@/lib/mock/adminMockData';
import { DollarSign, Calendar, TrendingUp, AlertCircle, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AdminStatCard } from '@/components/dashboard/AdminStatCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { LoanDetailCard } from '@/components/admin/LoanDetailCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ProgressBar } from '@/components/admin/ProgressBar';
import { InstallmentDetailCard } from '@/components/admin/InstallmentDetailCard';

export default function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const loan = mockLoans.find(l => l.id === id);
  const installments = loan ? getInstallmentsByLoanId(loan.id) : [];
  const user = loan ? getUserById(loan.userId) : null;

  if (!loan || !user) {
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

      {/* Installments */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.7 }} 
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
