// Admin Mock Data for testing admin dashboard without backend API
import { User, UserStatus, UserRole, EmploymentType } from '@/lib/types/user';
import { Loan, LoanStatus } from '@/lib/types/loan';
import { Installment, InstallmentStatus } from '@/lib/types/installment';
import { RiskLevel } from '@/lib/types/risk';

// MOCK USERS (Mix of pending, approved, rejected)
export const mockUsers: User[] = [
  {
    id: 'user-001',
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
  },
  {
    id: 'user-002',
    fullName: 'Fatima Khan',
    email: 'fatima.khan@example.com',
    phone: '+923012345678',
    address: 'Flat 5B, Gulberg Heights, Lahore',
    city: 'Lahore',
    province: 'Punjab',
    monthlyIncome: 45000,
    employmentType: EmploymentType.SELF_EMPLOYED,
    status: UserStatus.PENDING,
    role: UserRole.USER,
    createdAt: '2024-11-15T14:20:00.000Z'
  },
  {
    id: 'user-003',
    fullName: 'Ali Raza',
    email: 'ali.raza@example.com',
    phone: '+923023456789',
    address: 'Shop #45, Saddar Market, Karachi',
    city: 'Karachi',
    province: 'Sindh',
    monthlyIncome: 35000,
    employmentType: EmploymentType.BUSINESS_OWNER,
    employerName: 'Ali Electronics',
    status: UserStatus.APPROVED,
    role: UserRole.USER,
    createdAt: '2024-08-10T09:15:00.000Z',
    lastLoginAt: '2024-11-17T16:30:00.000Z'
  },
  {
    id: 'user-004',
    fullName: 'Sara Malik',
    email: 'sara.malik@example.com',
    phone: '+923034567890',
    address: 'House #78, Model Town, Faisalabad',
    city: 'Faisalabad',
    province: 'Punjab',
    monthlyIncome: 28000,
    employmentType: EmploymentType.DAILY_WAGE,
    status: UserStatus.REJECTED,
    role: UserRole.USER,
    createdAt: '2024-10-05T11:45:00.000Z'
  },
  {
    id: 'user-005',
    fullName: 'Usman Tariq',
    email: 'usman.tariq@example.com',
    phone: '+923045678901',
    address: 'Apartment 12C, Bahria Town, Rawalpindi',
    city: 'Rawalpindi',
    province: 'Punjab',
    monthlyIncome: 95000,
    employmentType: EmploymentType.SALARIED,
    employerName: 'National Bank of Pakistan',
    status: UserStatus.APPROVED,
    role: UserRole.USER,
    createdAt: '2024-07-20T13:00:00.000Z',
    lastLoginAt: '2024-11-18T10:00:00.000Z'
  },
  {
    id: 'user-006',
    fullName: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@example.com',
    phone: '+923056789012',
    address: 'House #234, DHA Phase 5, Karachi',
    city: 'Karachi',
    province: 'Sindh',
    monthlyIncome: 52000,
    employmentType: EmploymentType.SELF_EMPLOYED,
    status: UserStatus.PENDING,
    role: UserRole.USER,
    createdAt: '2024-11-17T16:30:00.000Z'
  },
  {
    id: 'user-007',
    fullName: 'Hassan Ali',
    email: 'hassan.ali@example.com',
    phone: '+923067890123',
    address: 'Shop #12, Anarkali Bazaar, Lahore',
    city: 'Lahore',
    province: 'Punjab',
    monthlyIncome: 38000,
    employmentType: EmploymentType.BUSINESS_OWNER,
    employerName: 'Hassan Textiles',
    status: UserStatus.APPROVED,
    role: UserRole.USER,
    createdAt: '2024-09-05T10:20:00.000Z',
    lastLoginAt: '2024-11-16T14:45:00.000Z'
  },
  {
    id: 'user-008',
    fullName: 'Zainab Ahmed',
    email: 'zainab.ahmed@example.com',
    phone: '+923078901234',
    address: 'House #567, Satellite Town, Quetta',
    city: 'Quetta',
    province: 'Balochistan',
    monthlyIncome: 42000,
    employmentType: EmploymentType.SALARIED,
    employerName: 'Provincial Education Dept',
    status: UserStatus.PENDING,
    role: UserRole.USER,
    createdAt: '2024-11-18T09:00:00.000Z'
  }
];

// MOCK LOANS (Various statuses)
export const mockLoans: Loan[] = [
  {
    id: 'loan-001',
    userId: 'user-001',
    principalAmount: 100000,
    interestRate: 12,
    tenureMonths: 12,
    monthlyInstallment: 8884,
    totalAmount: 106608,
    outstandingBalance: 71072,
    totalRepaid: 35536,
    totalFines: 200,
    startDate: '2024-06-01T00:00:00.000Z',
    endDate: '2025-06-01T00:00:00.000Z',
    status: LoanStatus.ACTIVE,
    installmentSchedule: Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      dueDate: new Date(2024, 6 + i, 1).toISOString(),
      amount: 8884
    })),
    createdAt: '2024-06-01T00:00:00.000Z'
  },
  {
    id: 'loan-002',
    userId: 'user-003',
    principalAmount: 50000,
    interestRate: 15,
    tenureMonths: 6,
    monthlyInstallment: 8721,
    totalAmount: 52326,
    outstandingBalance: 26163,
    totalRepaid: 26163,
    totalFines: 0,
    startDate: '2024-08-15T00:00:00.000Z',
    endDate: '2025-02-15T00:00:00.000Z',
    status: LoanStatus.ACTIVE,
    installmentSchedule: Array.from({ length: 6 }, (_, i) => ({
      month: i + 1,
      dueDate: new Date(2024, 8 + i, 15).toISOString(),
      amount: 8721
    })),
    createdAt: '2024-08-15T00:00:00.000Z'
  },
  {
    id: 'loan-003',
    userId: 'user-005',
    principalAmount: 200000,
    interestRate: 10,
    tenureMonths: 24,
    monthlyInstallment: 9201,
    totalAmount: 220824,
    outstandingBalance: 0,
    totalRepaid: 220824,
    totalFines: 0,
    startDate: '2023-07-01T00:00:00.000Z',
    endDate: '2025-07-01T00:00:00.000Z',
    status: LoanStatus.COMPLETED,
    installmentSchedule: Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      dueDate: new Date(2023, 6 + i, 1).toISOString(),
      amount: 9201
    })),
    createdAt: '2023-07-01T00:00:00.000Z'
  },
  {
    id: 'loan-004',
    userId: 'user-007',
    principalAmount: 75000,
    interestRate: 14,
    tenureMonths: 9,
    monthlyInstallment: 8756,
    totalAmount: 78804,
    outstandingBalance: 52536,
    totalRepaid: 26268,
    totalFines: 1500,
    startDate: '2024-09-10T00:00:00.000Z',
    endDate: '2025-06-10T00:00:00.000Z',
    status: LoanStatus.DEFAULTED,
    installmentSchedule: Array.from({ length: 9 }, (_, i) => ({
      month: i + 1,
      dueDate: new Date(2024, 9 + i, 10).toISOString(),
      amount: 8756
    })),
    createdAt: '2024-09-10T00:00:00.000Z'
  }
];

// MOCK INSTALLMENTS (All loans combined)
export const mockAllInstallments: Installment[] = [
  // Loan 001 installments
  {
    id: 'inst-001-1',
    loanId: 'loan-001',
    installmentNumber: 1,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2024-07-01T00:00:00.000Z',
    paidDate: '2024-07-01T10:30:00.000Z',
    status: InstallmentStatus.PAID,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-07-03T00:00:00.000Z'
  },
  {
    id: 'inst-001-2',
    loanId: 'loan-001',
    installmentNumber: 2,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2024-08-01T00:00:00.000Z',
    paidDate: '2024-08-02T14:20:00.000Z',
    status: InstallmentStatus.PAID,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-08-03T00:00:00.000Z'
  },
  {
    id: 'inst-001-5',
    loanId: 'loan-001',
    installmentNumber: 5,
    amount: 8884,
    fineAmount: 200,
    totalDue: 9084,
    dueDate: '2024-11-01T00:00:00.000Z',
    status: InstallmentStatus.OVERDUE,
    daysOverdue: 17,
    gracePeriodEndDate: '2024-11-03T00:00:00.000Z',
    paymentLink: 'https://checkout.stripe.com/mock-session-5'
  },
  {
    id: 'inst-001-6',
    loanId: 'loan-001',
    installmentNumber: 6,
    amount: 8884,
    fineAmount: 0,
    totalDue: 8884,
    dueDate: '2024-12-01T00:00:00.000Z',
    status: InstallmentStatus.PENDING,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-12-03T00:00:00.000Z'
  },
  // Loan 002 installments
  {
    id: 'inst-002-1',
    loanId: 'loan-002',
    installmentNumber: 1,
    amount: 8721,
    fineAmount: 0,
    totalDue: 8721,
    dueDate: '2024-09-15T00:00:00.000Z',
    paidDate: '2024-09-15T09:00:00.000Z',
    status: InstallmentStatus.PAID,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-09-17T00:00:00.000Z'
  },
  {
    id: 'inst-002-3',
    loanId: 'loan-002',
    installmentNumber: 3,
    amount: 8721,
    fineAmount: 0,
    totalDue: 8721,
    dueDate: '2024-11-15T00:00:00.000Z',
    status: InstallmentStatus.PENDING,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-11-17T00:00:00.000Z'
  },
  // Loan 004 (Defaulted) installments
  {
    id: 'inst-004-3',
    loanId: 'loan-004',
    installmentNumber: 3,
    amount: 8756,
    fineAmount: 500,
    totalDue: 9256,
    dueDate: '2024-11-10T00:00:00.000Z',
    status: InstallmentStatus.DEFAULTED,
    daysOverdue: 8,
    gracePeriodEndDate: '2024-11-12T00:00:00.000Z'
  },
  {
    id: 'inst-004-4',
    loanId: 'loan-004',
    installmentNumber: 4,
    amount: 8756,
    fineAmount: 1000,
    totalDue: 9756,
    dueDate: '2024-12-10T00:00:00.000Z',
    status: InstallmentStatus.DEFAULTED,
    daysOverdue: 0,
    gracePeriodEndDate: '2024-12-12T00:00:00.000Z'
  }
];

// MOCK RISK PROFILES
export const mockRiskProfiles = [
  {
    userId: 'user-001',
    riskLevel: RiskLevel.LOW,
    riskScore: 25,
    riskReasons: [
      'Consistent on-time payment history',
      'Stable monthly income of PKR 75,000',
      'Low debt-to-income ratio',
      'Good employment stability (Salaried)'
    ],
    recommendedMaxLoan: 150000,
    recommendedTenure: 18,
    defaultProbability: 0.08,
    lastCalculated: '2024-11-15T10:30:00.000Z'
  },
  {
    userId: 'user-003',
    riskLevel: RiskLevel.MEDIUM,
    riskScore: 48,
    riskReasons: [
      'Moderate income stability',
      'Self-employed with variable income',
      'Average payment history',
      'Limited credit history'
    ],
    recommendedMaxLoan: 75000,
    recommendedTenure: 12,
    defaultProbability: 0.22,
    lastCalculated: '2024-11-10T14:20:00.000Z'
  },
  {
    userId: 'user-007',
    riskLevel: RiskLevel.HIGH,
    riskScore: 78,
    riskReasons: [
      'Current loan in default status',
      'Multiple late payments',
      'High debt-to-income ratio',
      'Unstable business income'
    ],
    recommendedMaxLoan: 30000,
    recommendedTenure: 6,
    defaultProbability: 0.65,
    lastCalculated: '2024-11-18T09:00:00.000Z'
  }
];

// DASHBOARD STATS
export const mockDashboardStats = {
  users: {
    total: mockUsers.length,
    pending: mockUsers.filter(u => u.status === UserStatus.PENDING).length,
    approved: mockUsers.filter(u => u.status === UserStatus.APPROVED).length,
    rejected: mockUsers.filter(u => u.status === UserStatus.REJECTED).length
  },
  loans: {
    total: mockLoans.length,
    active: mockLoans.filter(l => l.status === LoanStatus.ACTIVE).length,
    completed: mockLoans.filter(l => l.status === LoanStatus.COMPLETED).length,
    defaulted: mockLoans.filter(l => l.status === LoanStatus.DEFAULTED).length,
    totalDisbursed: mockLoans.reduce((sum, l) => sum + l.principalAmount, 0),
    totalCollected: mockLoans.reduce((sum, l) => sum + l.totalRepaid, 0),
    totalOutstanding: mockLoans.reduce((sum, l) => sum + l.outstandingBalance, 0)
  },
  installments: {
    pending: mockAllInstallments.filter(i => i.status === InstallmentStatus.PENDING).length,
    overdue: mockAllInstallments.filter(i => i.status === InstallmentStatus.OVERDUE).length,
    defaulted: mockAllInstallments.filter(i => i.status === InstallmentStatus.DEFAULTED).length,
    dueThisMonth: mockAllInstallments.filter(i => {
      const dueDate = new Date(i.dueDate);
      const now = new Date();
      return dueDate.getMonth() === now.getMonth() && 
             dueDate.getFullYear() === now.getFullYear() &&
             i.status === InstallmentStatus.PENDING;
    }).length,
    expectedCollection: mockAllInstallments
      .filter(i => i.status === InstallmentStatus.PENDING)
      .reduce((sum, i) => sum + i.totalDue, 0)
  },
  risk: {
    lowRisk: mockRiskProfiles.filter(r => r.riskLevel === RiskLevel.LOW).length,
    mediumRisk: mockRiskProfiles.filter(r => r.riskLevel === RiskLevel.MEDIUM).length,
    highRisk: mockRiskProfiles.filter(r => r.riskLevel === RiskLevel.HIGH).length,
    aiPredictedDefaults: mockRiskProfiles.filter(r => r.defaultProbability && r.defaultProbability > 0.5).length
  },
  recentActivity: [
    {
      type: 'user_approved',
      description: 'Ahmed Hassan was approved',
      timestamp: '2024-11-18T10:30:00.000Z'
    },
    {
      type: 'loan_created',
      description: 'New loan of PKR 100,000 created for Ahmed Hassan',
      timestamp: '2024-11-18T09:15:00.000Z'
    },
    {
      type: 'payment_received',
      description: 'Payment of PKR 8,884 received from Ali Raza',
      timestamp: '2024-11-17T16:45:00.000Z'
    },
    {
      type: 'installment_overdue',
      description: 'Installment overdue for loan-001',
      timestamp: '2024-11-17T14:20:00.000Z'
    },
    {
      type: 'user_pending',
      description: 'Zainab Ahmed submitted application',
      timestamp: '2024-11-17T09:00:00.000Z'
    }
  ]
};

// Helper function to get user by ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(u => u.id === userId);
};

// Helper function to get loans by user ID
export const getLoansByUserId = (userId: string): Loan[] => {
  return mockLoans.filter(l => l.userId === userId);
};

// Helper function to get installments by loan ID
export const getInstallmentsByLoanId = (loanId: string): Installment[] => {
  return mockAllInstallments.filter(i => i.loanId === loanId);
};

// Helper function to get risk profile by user ID
export const getRiskProfileByUserId = (userId: string) => {
  return mockRiskProfiles.find(r => r.userId === userId);
};
