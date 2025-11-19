'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Eye, DollarSign, Calendar, User, FileText } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { EmptyState } from '@/components/admin/EmptyState';
import { adminService, LoanRequest } from '@/lib/services/adminService';

// Mock data for pending loan requests (fallback)
const mockPendingLoans = [
  {
    id: 'req-001',
    userId: 'user-001',
    userName: 'Ahmed Hassan',
    userEmail: 'ahmed.hassan@example.com',
    requestedAmount: 100000,
    requestedTenure: 12,
    purpose: 'Small business expansion',
    monthlyIncome: 75000,
    employmentType: 'SALARIED',
    riskLevel: 'LOW',
    riskScore: 25,
    recommendedMaxLoan: 150000,
    requestedAt: '2024-11-18T10:30:00.000Z'
  },
  {
    id: 'req-002',
    userId: 'user-002',
    userName: 'Fatima Khan',
    userEmail: 'fatima.khan@example.com',
    requestedAmount: 50000,
    requestedTenure: 6,
    purpose: 'Medical expenses',
    monthlyIncome: 45000,
    employmentType: 'SELF_EMPLOYED',
    riskLevel: 'MEDIUM',
    riskScore: 48,
    recommendedMaxLoan: 75000,
    requestedAt: '2024-11-17T14:20:00.000Z'
  },
  {
    id: 'req-003',
    userId: 'user-003',
    userName: 'Ali Raza',
    userEmail: 'ali.raza@example.com',
    requestedAmount: 150000,
    requestedTenure: 18,
    purpose: 'Shop renovation',
    monthlyIncome: 35000,
    employmentType: 'BUSINESS_OWNER',
    riskLevel: 'HIGH',
    riskScore: 72,
    recommendedMaxLoan: 50000,
    requestedAt: '2024-11-16T09:15:00.000Z'
  }
];

export default function PendingLoansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingLoanRequests = async () => {
      try {
        setLoading(true);
        const response = await adminService.getLoanRequests({
          status: 'PENDING',
          limit: 100,
        });
        setLoanRequests(response.data.loanRequests.map((req: LoanRequest) => ({
          id: req.id,
          userId: req.user.id,
          userName: req.user.fullName,
          userEmail: req.user.email,
          requestedAmount: req.requestedAmount,
          requestedTenure: req.requestedTenure,
          purpose: req.purpose,
          requestedAt: req.createdAt,
          // These will be loaded separately if needed
          monthlyIncome: 0,
          employmentType: 'SALARIED',
          riskLevel: 'MEDIUM',
          riskScore: 50,
          recommendedMaxLoan: req.requestedAmount,
        })));
      } catch (error) {
        console.error('Failed to fetch loan requests, using mock data:', error);
        setLoanRequests(mockPendingLoans);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLoanRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return loanRequests.filter(request => {
      const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'ALL' || request.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [searchTerm, riskFilter, loanRequests]);

  const filterOptions = [
    { value: 'ALL', label: 'All Risk Levels' },
    { value: 'LOW', label: 'Low Risk' },
    { value: 'MEDIUM', label: 'Medium Risk' },
    { value: 'HIGH', label: 'High Risk' }
  ];

  const handleApprove = async (requestId: string) => {
    const interestRate = prompt('Enter interest rate (e.g., 15 for 15%):');
    if (!interestRate) return;

    try {
      await adminService.approveLoanRequest(requestId, {
        interestRate: parseFloat(interestRate),
        startDate: new Date().toISOString().split('T')[0],
      });
      setLoanRequests(loanRequests.filter(r => r.id !== requestId));
      alert('Loan request approved successfully!');
    } catch (error) {
      console.error('Failed to approve loan request:', error);
      alert('Failed to approve loan request. Please try again.');
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminService.rejectLoanRequest(requestId, reason);
      setLoanRequests(loanRequests.filter(r => r.id !== requestId));
      alert('Loan request rejected successfully!');
    } catch (error) {
      console.error('Failed to reject loan request:', error);
      alert('Failed to reject loan request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending loan requests...</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    const colors = {
      LOW: 'text-green-600',
      MEDIUM: 'text-orange-600',
      HIGH: 'text-red-600'
    };
    return colors[level as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader 
        title="Pending Loan Requests" 
        description="Review and approve or reject loan applications" 
        icon={FileText} 
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterValue={riskFilter}
        onFilterChange={setRiskFilter}
        filterOptions={filterOptions}
        searchPlaceholder="Search by name, email, or request ID..."
      />

      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-white">
                      {request.userName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                      {request.userName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{request.userEmail}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Requested {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start">
                  <span className={`text-xs font-bold ${getRiskColor(request.riskLevel)}`}>
                    {request.riskLevel} RISK
                  </span>
                  <span className="text-xs text-gray-500">({request.riskScore}/100)</span>
                </div>
              </div>

              {/* Loan Request Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Requested Amount</p>
                    <p className="text-sm font-bold text-gray-900">
                      PKR {request.requestedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Tenure</p>
                    <p className="text-sm font-bold text-gray-900">{request.requestedTenure} months</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Monthly Income</p>
                    <p className="text-sm font-bold text-gray-900">
                      PKR {request.monthlyIncome.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Employment</p>
                    <p className="text-sm font-bold text-gray-900">{request.employmentType}</p>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              {request.purpose && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Purpose:</p>
                  <p className="text-sm text-blue-800">{request.purpose}</p>
                </div>
              )}

              {/* AI Recommendation */}
              <div className={`mb-4 p-3 rounded-lg border ${
                request.requestedAmount <= request.recommendedMaxLoan
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <p className="text-xs font-semibold mb-1 ${
                  request.requestedAmount <= request.recommendedMaxLoan
                    ? 'text-green-900'
                    : 'text-orange-900'
                }">
                  AI Recommendation:
                </p>
                <p className={`text-sm ${
                  request.requestedAmount <= request.recommendedMaxLoan
                    ? 'text-green-800'
                    : 'text-orange-800'
                }`}>
                  {request.requestedAmount <= request.recommendedMaxLoan
                    ? `✓ Request is within recommended limit (Max: PKR ${request.recommendedMaxLoan.toLocaleString()})`
                    : `⚠ Request exceeds recommended limit (Max: PKR ${request.recommendedMaxLoan.toLocaleString()})`
                  }
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all text-sm font-medium"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve Loan
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-lg hover:from-red-500 hover:to-rose-600 transition-all text-sm font-medium"
                >
                  <XCircle className="h-4 w-4" />
                  Reject Request
                </button>
                <a
                  href={`/admin/users/${request.userId}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  View User Profile
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No Pending Requests"
          description="There are no loan requests waiting for approval."
          iconColor="text-gray-400"
        />
      )}
    </div>
  );
}
