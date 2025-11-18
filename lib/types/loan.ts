// src/types/loan.ts
export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DEFAULTED = 'DEFAULTED',
  CANCELLED = 'CANCELLED'
}

export interface InstallmentScheduleItem {
  month: number;
  dueDate: string;
  amount: number;
}

export interface Loan {
  id: string;
  userId: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyInstallment: number;
  totalAmount: number;
  outstandingBalance: number;
  totalRepaid: number;
  totalFines: number;
  startDate: string;
  endDate: string;
  status: LoanStatus;
  installmentSchedule: InstallmentScheduleItem[];
  createdAt: string;
}
