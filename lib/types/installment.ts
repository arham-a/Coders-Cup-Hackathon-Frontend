// src/types/installment.ts
export enum InstallmentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  DEFAULTED = 'DEFAULTED'
}

export interface Installment {
  id: string;
  loanId: string;
  installmentNumber: number;
  amount: number;
  fineAmount: number;
  totalDue: number;
  dueDate: string;
  paidDate?: string;
  status: InstallmentStatus;
  daysOverdue: number;
  gracePeriodEndDate: string;
  stripeSessionId?: string;
  paymentLink?: string;
}
