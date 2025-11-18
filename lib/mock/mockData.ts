// Mock data for testing dashboard without backend API
import { Loan, LoanStatus } from '@/lib/types/loan';
import { Installment, InstallmentStatus } from '@/lib/types/installment';
import { User, UserStatus, UserRole, EmploymentType } from '@/lib/types/user';

export const mockLoan: Loan = {
  id: 'loan-123',
  userId: 'user-123',
  principalAmount: 100000,
  interestRate: 12,
  tenureMonths: 12,
  monthlyInstallment: 8884,
  totalAmount: 106608,
  outstandingBalance: 71072,
  totalRepaid: 35536,
  totalFines: 500,
  startDate: '2024-06-01T00:00:00.000Z',
  endDate: '2025-06-01T00:00:00.000Z',
  status: LoanStatus.ACTIVE,
  installmentSchedule: [
    { month: 1, dueDate: '2024-07-01T00:00:00.000Z', amount: 8884 },
    { month: 2, dueDate: '2024-08-01T00:00:00.000Z', amount: 8884 },
    { month: 3, dueDate: '2024-09-01T00:00:00.000Z', amount: 8884 },
    { month: 4, dueDate: '2024-10-01T00:00:00.000Z', amount: 8884 },
    { month: 5, dueDate: '2024-11-01T00:00:00.000Z', amount: 8884 },
    { month: 6, dueDate: '2024-12-01T00:00:00.000Z', amount: 8884 },
    { month: 7, dueDate: '2025-01-01T00:00:00.000Z', amount: 8884 },
    { month: 8, dueDate: '2025-02-01T00:00:00.000Z', amount: 8884 },
    { month: 9, dueDate: '2025-03-01T00:00:00.000Z', amount: 8884 },
    { month: 10, dueDate: '2025-04-01T00:00:00.000Z', amount: 8884 },
    { month: 11, dueDate: '2025-05-01T00:00:00.000Z', amount: 8884 },
    { month: 12, dueDate: '2025-06-01T00:00:00.000Z', amount: 8884 },
  ],
  createdAt: '2024-06-01T00:00:00.000Z',
};

export const mockInstallments: Installment[] = [
  {
    id: 'inst-1',
    loanId: 'loan-123',
    installmentNumber: 1,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2024-07-01T00:00:00.000Z',
    paidDate: '2024-07-01T10:30:00.000Z',
    status: InstallmentStatus.PAID,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-07-03T00:00:00.000Z',
  },
  {
    id: 'inst-2',
    loanId: 'loan-123',
    installmentNumber: 2,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2024-08-01T00:00:00.000Z',
    paidDate: '2024-08-02T14:20:00.000Z',
    status: InstallmentStatus.PAID,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-08-03T00:00:00.000Z',
  },
  {
    id: 'inst-3',
    loanId: 'loan-123',
    installmentNumber: 3,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2024-09-01T00:00:00.000Z',
    paidDate: '2024-09-01T09:15:00.000Z',
    status: InstallmentStatus.PAID,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-09-03T00:00:00.000Z',
  },
  {
    id: 'inst-4',
    loanId: 'loan-123',
    installmentNumber: 4,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2024-10-01T00:00:00.000Z',
    paidDate: '2024-10-03T16:45:00.000Z',
    status: InstallmentStatus.PAID,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-10-03T00:00:00.000Z',
  },
  {
    id: 'inst-5',
    loanId: 'loan-123',
    installmentNumber: 5,
    amount: 8884,
    fineAmount: 200,
    totalDue: 9084,
    dueDate: '2024-11-01T00:00:00.000Z',
    status: InstallmentStatus.OVERDUE,
    daysOverdue: 17,
    gracePeriodEndDate: '2024-11-03T00:00:00.000Z',
    paymentLink: 'https://checkout.stripe.com/mock-session-5',
  },
  {
    id: 'inst-6',
    loanId: 'loan-123',
    installmentNumber: 6,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2024-12-01T00:00:00.000Z',
    status: InstallmentStatus.PENDING,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-12-03T00:00:00.000Z',
    // No paymentLink yet - will be generated when due
  },
  {
    id: 'inst-7',
    loanId: 'loan-123',
    installmentNumber: 7,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2025-01-01T00:00:00.000Z',
    status: InstallmentStatus.PENDING,
    daysOverdue: 0,
    gracePeriodEndDate: '2025-01-03T00:00:00.000Z',
  },
];

// LOW RISK PROFILE (Default)
export const mockRiskProfile = {
  userId: 'user-123',
  riskLevel: 'LOW' as const,
  riskScore: 25,
  riskReasons: [
    'Consistent on-time payment history',
    'Stable monthly income of PKR 50,000',
    'Low debt-to-income ratio',
    'Good employment stability (Salaried)',
    'No previous defaults or late payments'
  ],
  recommendedMaxLoan: 150000,
  recommendedTenure: 18,
  defaultProbability: 0.08,
  lastCalculated: '2024-11-15T10:30:00.000Z'
};

// MEDIUM RISK PROFILE (For testing)
export const mockRiskProfileMedium = {
  userId: 'user-123',
  riskLevel: 'MEDIUM' as const,
  riskScore: 55,
  riskReasons: [
    'Occasional late payments (2-3 days delay)',
    'Moderate income stability',
    'Average debt-to-income ratio',
    'Self-employed with variable income',
    'One missed payment in last 6 months',
    'Limited credit history (less than 2 years)'
  ],
  recommendedMaxLoan: 75000,
  recommendedTenure: 12,
  defaultProbability: 0.25,
  lastCalculated: '2024-11-15T10:30:00.000Z'
};

// HIGH RISK PROFILE (For testing)
export const mockRiskProfileHigh = {
  userId: 'user-123',
  riskLevel: 'HIGH' as const,
  riskScore: 82,
  riskReasons: [
    'Multiple late payments (5+ days overdue)',
    'Unstable income with frequent gaps',
    'High debt-to-income ratio (>60%)',
    'Previous loan default in last 12 months',
    'Irregular employment history',
    'Multiple missed payments',
    'Low monthly income relative to expenses',
    'No collateral or guarantor available'
  ],
  recommendedMaxLoan: 30000,
  recommendedTenure: 6,
  defaultProbability: 0.68,
  lastCalculated: '2024-11-15T10:30:00.000Z'
};

// Switch between risk profiles for testing
// Change this to test different scenarios: mockRiskProfile, mockRiskProfileMedium, mockRiskProfileHigh
export const activeRiskProfile = mockRiskProfileHigh;

// MOCK USER PROFILE
export const mockUser: User = {
  id: 'user-123',
  fullName: 'Ahmed Hassan',
  email: 'ahmed.hassan@example.com',
  phone: '+923001234567',
  address: 'House #123, Street 45, F-10 Markaz',
  city: 'Islamabad',
  province: 'Islamabad Capital Territory',
  monthlyIncome: 75000,
  employmentType: EmploymentType.SALARIED,
  employerName: 'Tech Solutions Pvt Ltd',
  status: UserStatus.APPROVED,
  role: UserRole.USER,
  createdAt: '2024-06-01T10:30:00.000Z',
  lastLoginAt: '2024-11-18T08:15:00.000Z'
};
