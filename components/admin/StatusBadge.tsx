'use client';

import { LoanStatus } from '@/lib/types/loan';
import { InstallmentStatus } from '@/lib/types/installment';

interface StatusBadgeProps {
  status: LoanStatus | InstallmentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getLoanStatusStyle = (status: LoanStatus) => {
    const styles = {
      [LoanStatus.ACTIVE]: 'text-green-600',
      [LoanStatus.COMPLETED]: 'text-blue-600',
      [LoanStatus.DEFAULTED]: 'text-red-600',
      [LoanStatus.CANCELLED]: 'text-gray-600'
    };
    return styles[status] || 'text-gray-600';
  };

  const getInstallmentStatusStyle = (status: InstallmentStatus) => {
    const styles = {
      [InstallmentStatus.PENDING]: 'text-yellow-600',
      [InstallmentStatus.PAID]: 'text-green-600',
      [InstallmentStatus.OVERDUE]: 'text-red-600',
      [InstallmentStatus.DEFAULTED]: 'text-purple-600'
    };
    return styles[status] || 'text-gray-600';
  };

  const getSizeClass = () => {
    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    return sizes[size];
  };

  const isLoanStatus = Object.values(LoanStatus).includes(status as LoanStatus);
  const styleClass = isLoanStatus 
    ? getLoanStatusStyle(status as LoanStatus)
    : getInstallmentStatusStyle(status as InstallmentStatus);

  return (
    <span className={`font-bold ${getSizeClass()} ${styleClass}`}>
      {status}
    </span>
  );
}
