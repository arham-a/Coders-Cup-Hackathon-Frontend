import { apiClient } from '@/lib/api-client';
import { User, UserStatus } from '@/lib/types/user';
import { Loan, LoanStatus } from '@/lib/types/loan';
import { Installment, InstallmentStatus } from '@/lib/types/installment';
import { RiskProfile, RiskLevel } from '@/lib/types/risk';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
    };
  };
}

export interface DashboardStats {
  users: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  loans: {
    total: number;
    active: number;
    completed: number;
    defaulted: number;
    totalDisbursed: number;
    totalCollected: number;
    totalOutstanding: number;
  };
  installments: {
    pending: number;
    overdue: number;
    defaulted: number;
    dueThisMonth: number;
    expectedCollection: number;
  };
  risk: {
    lowRisk: number;
    mediumRisk: number;
    highRisk: number;
    aiPredictedDefaults: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface LoanRequest {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  requestedAmount: number;
  requestedTenure: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  rejectionReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  loanId?: string;
  createdAt: string;
}

export interface CreateLoanData {
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  startDate: string;
  notes?: string;
}

export interface ApproveRequestData {
  interestRate: number;
  startDate?: string;
  notes?: string;
}

export interface UserWithRisk extends User {
  riskLevel?: RiskLevel;
}

export interface LoanWithUser extends Loan {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface InstallmentWithDetails extends Installment {
  loan: {
    id: string;
    principalAmount: number;
  };
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface DefaultedLoan {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    riskLevel: RiskLevel;
  };
  principalAmount: number;
  outstandingBalance: number;
  totalFines: number;
  defaultedAt: string;
  daysInDefault: number;
  missedInstallments: number;
  aiPredictedDefault: boolean;
  recoveryProbability?: number;
}

export interface RiskProfileDetail {
  userId: string;
  user: {
    fullName: string;
    email: string;
    city: string;
    monthlyIncome: number;
    employmentType: string;
  };
  riskProfile: RiskProfile;
  loanHistory: Array<{
    loanId: string;
    amount: number;
    status: LoanStatus;
    onTimePayments: number;
    latePayments: number;
    missedPayments: number;
  }>;
}

// ============================================
// ADMIN SERVICE
// ============================================

export const adminService = {
  // ============================================
  // USER MANAGEMENT
  // ============================================

  /**
   * Get all users with optional filters
   * GET /api/admin/users
   */
  async getUsers(params?: {
    status?: UserStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<UserWithRisk>> {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Get user by ID with loans and risk profile
   * GET /api/admin/users/:userId
   */
  async getUserById(userId: string): Promise<{
    success: boolean;
    data: {
      user: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        cnic: string;
        address: string;
        city: string;
        province: string;
        monthlyIncome: number;
        employmentType: string;
        employerName?: string;
        status: UserStatus;
        role: string;
        createdAt: string;
        updatedAt: string;
      };
      loanStats: {
        total: number;
        active: number;
        completed: number;
        defaulted: number;
        totalBorrowed: number;
        totalOutstanding: number;
        totalRepaid: number;
        totalFines: number;
      };
      loans: Array<{
        id: string;
        principalAmount: number;
        interestRate: number;
        tenureMonths: number;
        monthlyInstallment: number;
        totalAmount: number;
        outstandingBalance: number;
        totalRepaid: number;
        totalFines: number;
        status: string;
        nextInstallmentDate: string;
        createdAt: string;
      }>;
      installmentStats: {
        total: number;
        paid: number;
        pending: number;
        overdue: number;
        defaulted: number;
      };
      paymentBehavior: {
        totalPayments: number;
        onTimePayments: number;
        latePayments: number;
        missedPayments: number;
        onTimeRate: number;
      };
      riskProfile: {
        riskLevel: string;
        riskScore: number;
        defaultProbability: number;
        recommendedMaxLoan: number;
        recommendedTenure: number;
        riskReasons: string[];
        lastUpdated: string;
      } | null;
      recentPayments: Array<{
        id: string;
        amount: number;
        type: string;
        status: string;
        loanId: string;
        loanAmount: number;
        createdAt: string;
      }>;
    };
  }> {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Approve a pending user
   * PATCH /api/admin/users/:id/approve
   */
  async approveUser(userId: string): Promise<{
    success: boolean;
    message: string;
    data: {
      userId: string;
      status: UserStatus;
      approvedAt: string;
    };
  }> {
    const response = await apiClient.patch(`/admin/users/${userId}/approve`);
    return response.data;
  },

  /**
   * Reject a pending user
   * PATCH /api/admin/users/:id/reject
   */
  async rejectUser(
    userId: string,
    reason: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      userId: string;
      status: UserStatus;
      rejectionReason: string;
    };
  }> {
    const response = await apiClient.patch(`/admin/users/${userId}/reject`, {
      reason,
    });
    return response.data;
  },

  // ============================================
  // RISK ASSESSMENT
  // ============================================

  /**
   * Trigger risk score calculation for a user
   * POST /api/admin/risk-score/:userId
   */
  async calculateRiskScore(
    userId: string,
    recalculate?: boolean
  ): Promise<{
    success: boolean;
    message: string;
    data: RiskProfile;
  }> {
    const response = await apiClient.post(`/admin/risk-score/${userId}`, {
      recalculate,
    });
    return response.data;
  },

  /**
   * Get user risk profile
   * GET /api/admin/risk-profile/:userId
   */
  async getRiskProfile(userId: string): Promise<{
    success: boolean;
    data: RiskProfileDetail;
  }> {
    const response = await apiClient.get(`/admin/risk-profile/${userId}`);
    return response.data;
  },

  // ============================================
  // LOAN MANAGEMENT
  // ============================================

  /**
   * Create loan for a user
   * POST /api/admin/loans/:userId
   */
  async createLoan(
    userId: string,
    loanData: CreateLoanData
  ): Promise<{
    success: boolean;
    message: string;
    data: Loan & {
      installmentSchedule: Array<{
        month: number;
        dueDate: string;
        amount: number;
        gracePeriodEndDate: string;
      }>;
    };
  }> {
    const response = await apiClient.post(`/admin/loans/${userId}`, loanData);
    return response.data;
  },

  /**
   * Update loan
   * PUT /api/admin/loans/:loanId
   */
  async updateLoan(
    loanId: string,
    updates: {
      notes?: string;
      status?: LoanStatus;
    }
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      loanId: string;
      updatedFields: string[];
    };
  }> {
    const response = await apiClient.put(`/admin/loans/${loanId}`, updates);
    return response.data;
  },

  /**
   * Get loan by ID with detailed information
   * GET /api/admin/loans/:loanId
   */
  async getLoanById(loanId: string): Promise<{
    success: boolean;
    data: {
      loan: {
        id: string;
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
        notes?: string;
        createdAt: string;
      };
      user: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
        city: string;
        province: string;
        monthlyIncome: number;
        employmentType: string;
      };
      installmentStats: {
        total: number;
        paid: number;
        pending: number;
        overdue: number;
        defaulted: number;
      };
      installments: Installment[];
      paymentHistory: {
        onTimePayments: number;
        latePayments: number;
        missedPayments: number;
      };
      riskAnalysis: {
        userRiskProfile: {
          riskLevel: RiskLevel;
          riskScore: number;
          defaultProbability?: number;
          lastCalculated: string;
        } | null;
        loanPerformance: {
          paymentSuccessRate: number;
          onTimePaymentRate: string;
          missedPaymentCount: number;
        };
        loanHealthScore: number;
      };
    };
  }> {
    const response = await apiClient.get(`/admin/loans/${loanId}`);
    return response.data;
  },

  /**
   * Get all loans with optional filters
   * GET /api/admin/loans
   */
  async getLoans(params?: {
    status?: LoanStatus;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<LoanWithUser>> {
    const response = await apiClient.get('/admin/loans', { params });
    return response.data;
  },

  // ============================================
  // LOAN REQUEST MANAGEMENT
  // ============================================

  /**
   * Get all loan requests
   * GET /api/admin/loan-requests
   */
  async getLoanRequests(params?: {
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<LoanRequest>> {
    const response = await apiClient.get('/admin/loan-requests', { params });
    return response.data;
  },

  /**
   * Approve a loan request
   * POST /api/admin/loan-requests/:requestId/approve
   */
  async approveLoanRequest(
    requestId: string,
    data: ApproveRequestData
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      requestId: string;
      loanId: string;
      userId: string;
      principalAmount: number;
      interestRate: number;
      tenureMonths: number;
      monthlyInstallment: number;
      totalAmount: number;
      startDate: string;
      endDate: string;
      installmentsCreated: number;
    };
  }> {
    const response = await apiClient.post(
      `/admin/loan-requests/${requestId}/approve`,
      data
    );
    return response.data;
  },

  /**
   * Reject a loan request
   * POST /api/admin/loan-requests/:requestId/reject
   */
  async rejectLoanRequest(
    requestId: string,
    reason: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      requestId: string;
      status: string;
      rejectionReason: string;
    };
  }> {
    const response = await apiClient.post(
      `/admin/loan-requests/${requestId}/reject`,
      { reason }
    );
    return response.data;
  },

  // ============================================
  // INSTALLMENT MANAGEMENT
  // ============================================

  /**
   * Get all installments with optional filters
   * GET /api/admin/installments
   */
  async getInstallments(params?: {
    status?: InstallmentStatus;
    userId?: string;
    loanId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<InstallmentWithDetails>> {
    const response = await apiClient.get('/admin/installments', { params });
    return response.data;
  },

  /**
   * Waive fine for an installment
   * POST /api/admin/waive-fine/:installmentId
   */
  async waiveFine(
    installmentId: string,
    reason: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      installmentId: string;
      oldFineAmount: number;
      newFineAmount: number;
      waivedBy: string;
      reason: string;
    };
  }> {
    const response = await apiClient.post(
      `/admin/waive-fine/${installmentId}`,
      { reason }
    );
    return response.data;
  },

  // ============================================
  // DEFAULT MANAGEMENT
  // ============================================

  /**
   * Get defaulted loans
   * GET /api/admin/defaults
   */
  async getDefaultedLoans(): Promise<{
    success: boolean;
    data: {
      defaultedLoans: DefaultedLoan[];
      summary: {
        totalDefaulted: number;
        totalOutstanding: number;
        averageDefaultTime: number;
      };
    };
  }> {
    const response = await apiClient.get('/admin/defaults');
    return response.data;
  },

  // ============================================
  // DASHBOARD & ANALYTICS
  // ============================================

  /**
   * Get dashboard statistics
   * GET /api/admin/dashboard/stats
   */
  async getDashboardStats(): Promise<{
    success: boolean;
    data: DashboardStats;
  }> {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data;
  },

  // ============================================
  // REMINDER SYSTEM
  // ============================================

  /**
   * Trigger installment reminders
   * POST /api/admin/reminders/installments
   */
  async triggerInstallmentReminders(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post('/admin/reminders/installments');
    return response.data;
  },

  /**
   * Trigger overdue notices
   * POST /api/admin/reminders/overdue
   */
  async triggerOverdueNotices(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await apiClient.post('/admin/reminders/overdue');
    return response.data;
  },

  // ============================================
  // ANALYTICS
  // ============================================

  /**
   * Get analytics data
   * GET /api/admin/analytics
   */
  async getAnalytics(): Promise<{
    success: boolean;
    data: {
      insights: {
        avgDaysToDefault: number;
        collectionEfficiency: number;
        avgLoanToIncome: number;
        earlyDefaultRate: number;
      };
      defaultRateByTenure: Array<{
        tenure: string;
        defaultRate: number;
        totalLoans: number;
      }>;
      loanSizeDistribution: Array<{
        range: string;
        count: number;
      }>;
      repaymentTrend: Array<{
        month: string;
        collected: number;
        expected: number;
      }>;
      incomeVsDefault: Array<{
        income: number;
        loanAmount: number;
        defaulted: boolean;
      }>;
      paymentBehavior: Array<{
        name: string;
        value: number;
        color: string;
      }>;
    };
  }> {
    const response = await apiClient.get('/admin/analytics');
    return response.data;
  },
};
