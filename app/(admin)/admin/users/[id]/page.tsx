'use client';

import { use, useState, useEffect } from 'react';
import { getUserById, getLoansByUserId, getRiskProfileByUserId } from '@/lib/mock/adminMockData';
import { adminService } from '@/lib/services/adminService';
import { UserStatus } from '@/lib/types/user';
import { LoanStatus } from '@/lib/types/loan';
import { 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Plus, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Building,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { InfoCard } from '@/components/admin/InfoCard';
import { RiskProfileCard } from '@/components/admin/RiskProfileCard';
import { Modal } from '@/components/ui/Modal';
import { CreateLoanForm } from '@/components/admin/CreateLoanForm';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  
  // Fallback to mock data
  const mockUser = getUserById(id);
  const mockLoans = getLoansByUserId(id);
  const mockRiskProfile = getRiskProfileByUserId(id);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await adminService.getUserById(id);
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        // Using mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const user = userData?.user || mockUser;
  const userLoans = userData?.loans || mockLoans;
  const riskProfile = userData?.riskProfile || mockRiskProfile;
  const loanStats = userData?.loanStats;
  const installmentStats = userData?.installmentStats;
  const paymentBehavior = userData?.paymentBehavior;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
        <p className="text-gray-600 mt-4">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">User not found</p>
        <Link 
          href="/admin/users" 
          className="text-orange-500 hover:text-orange-600 mt-4 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      await adminService.approveUser(id);
      alert('User approved successfully!');
      router.push('/admin/users/pending');
    } catch (error) {
      console.error('Failed to approve user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await adminService.rejectUser(id, reason);
        alert('User rejected successfully!');
        router.push('/admin/users/pending');
      } catch (error) {
        console.error('Failed to reject user:', error);
        alert('Failed to reject user. Please try again.');
      }
    }
  };

  const handleCreateLoan = async (data: any) => {
    try {
      await adminService.createLoan(id, data);
      alert('Loan created successfully!');
      setIsLoanModalOpen(false);
      // Refresh user data
      const response = await adminService.getUserById(id);
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to create loan:', error);
      alert('Failed to create loan. Please try again.');
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const styles = {
      [UserStatus.PENDING]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      [UserStatus.APPROVED]: 'bg-green-100 text-green-700 border-green-200',
      [UserStatus.REJECTED]: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status];
  };

  const userInfo = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone },
    { icon: MapPin, label: 'Address', value: user.address },
    { icon: MapPin, label: 'City', value: user.city },
    { icon: MapPin, label: 'Province', value: user.province },
    { icon: DollarSign, label: 'Monthly Income', value: `PKR ${user.monthlyIncome.toLocaleString()}` },
    { icon: Briefcase, label: 'Employment Type', value: user.employmentType },
    ...(user.employerName ? [{ icon: Building, label: 'Employer', value: user.employerName }] : []),
    { icon: Calendar, label: 'Registered On', value: new Date(user.createdAt).toLocaleDateString() }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          href="/admin/users" 
          className="text-orange-500 hover:text-orange-600 text-sm mb-3 inline-flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.fullName}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">User Profile & Loan Management</p>
          </div>
          <span className={`px-4 py-2 rounded-lg text-sm font-medium border self-start ${getStatusBadge(user.status)}`}>
            {user.status}
          </span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {user.status === UserStatus.PENDING && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 sm:p-6"
        >
          <p className="text-yellow-800 mb-4 font-medium">⏳ This user is awaiting approval</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleApprove}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all font-medium"
            >
              <CheckCircle className="h-4 w-4" />
              Approve User
            </button>
            <button
              onClick={handleReject}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-lg hover:from-red-500 hover:to-rose-600 transition-all font-medium"
            >
              <XCircle className="h-4 w-4" />
              Reject User
            </button>
          </div>
        </motion.div>
      )}

      {/* User Information */}
      <InfoCard title="Personal Information" items={userInfo} delay={0.2} />

      {/* Overview Stats */}
      {loanStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-900">{loanStats.total}</span>
            </div>
            <p className="text-sm text-blue-700 font-medium">Total Loans</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-900">{loanStats.active}</span>
            </div>
            <p className="text-sm text-green-700 font-medium">Active Loans</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-900">{loanStats.completed}</span>
            </div>
            <p className="text-sm text-purple-700 font-medium">Completed</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-900">{loanStats.defaulted}</span>
            </div>
            <p className="text-sm text-red-700 font-medium">Defaulted</p>
          </div>
        </motion.div>
      )}

      {/* Financial Overview */}
      {loanStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Borrowed</p>
              <p className="text-xl font-bold text-gray-900">PKR {loanStats.totalBorrowed.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Outstanding</p>
              <p className="text-xl font-bold text-orange-600">PKR {loanStats.totalOutstanding.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Repaid</p>
              <p className="text-xl font-bold text-green-600">PKR {loanStats.totalRepaid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Fines</p>
              <p className="text-xl font-bold text-red-600">PKR {loanStats.totalFines.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Behavior */}
      {paymentBehavior && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Behavior</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">On-Time Payment Rate</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    style={{ width: `${paymentBehavior.onTimeRate}%` }}
                  />
                </div>
                <span className="font-bold text-green-600">{paymentBehavior.onTimeRate}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{paymentBehavior.totalPayments}</p>
                <p className="text-sm text-gray-600 mt-1">Total Payments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{paymentBehavior.onTimePayments}</p>
                <p className="text-sm text-gray-600 mt-1">On-Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{paymentBehavior.latePayments}</p>
                <p className="text-sm text-gray-600 mt-1">Late</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{paymentBehavior.missedPayments}</p>
                <p className="text-sm text-gray-600 mt-1">Missed</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Installment Stats */}
      {installmentStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Installment Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">{installmentStats.total}</p>
              <p className="text-sm text-gray-600 mt-2">Total</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{installmentStats.paid}</p>
              <p className="text-sm text-gray-600 mt-2">Paid</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{installmentStats.pending}</p>
              <p className="text-sm text-gray-600 mt-2">Pending</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">{installmentStats.overdue}</p>
              <p className="text-sm text-gray-600 mt-2">Overdue</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{installmentStats.defaulted}</p>
              <p className="text-sm text-gray-600 mt-2">Defaulted</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Risk Profile */}
      {riskProfile && (
        <RiskProfileCard
          riskLevel={riskProfile.riskLevel}
          riskScore={riskProfile.riskScore}
          defaultProbability={riskProfile.defaultProbability || 0}
          recommendedMaxLoan={riskProfile.recommendedMaxLoan || 0}
          riskReasons={riskProfile.riskReasons}
          delay={0.45}
        />
      )}

      {/* Loans Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Loan History</h2>
          {user.status === UserStatus.APPROVED && (
            <button
              onClick={() => setIsLoanModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg hover:from-orange-500 hover:to-amber-600 transition-all font-medium text-sm"
            >
              <Plus className="h-4 w-4" />
              Create New Loan
            </button>
          )}
        </div>

        {userLoans.length > 0 ? (
          <div className="space-y-4">
            {userLoans.map((loan, index) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:border-orange-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      PKR {loan.principalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {loan.tenureMonths} months @ {loan.interestRate}% interest
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-lg border font-medium self-start ${
                    loan.status === LoanStatus.ACTIVE ? 'bg-green-100 text-green-700 border-green-200' :
                    loan.status === LoanStatus.COMPLETED ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    loan.status === LoanStatus.DEFAULTED ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {loan.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Outstanding</p>
                    <p className="font-medium text-gray-900 mt-1">
                      PKR {loan.outstandingBalance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Repaid</p>
                    <p className="font-medium text-gray-900 mt-1">
                      PKR {loan.totalRepaid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fines</p>
                    <p className="font-medium text-red-600 mt-1">
                      PKR {loan.totalFines.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/loans/${loan.id}`}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1"
                >
                  View Details
                  <span>→</span>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <DollarSign className="h-16 w-16 mx-auto mb-3 text-gray-300" />
            <p className="text-base sm:text-lg font-medium">No loans found for this user</p>
            {user.status === UserStatus.APPROVED && (
              <button
                onClick={() => setIsLoanModalOpen(true)}
                className="text-orange-500 hover:text-orange-600 mt-3 inline-flex items-center gap-2 font-medium"
              >
                Create their first loan
                <span>→</span>
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Recent Payments */}
      {userData?.recentPayments && userData.recentPayments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Recent Payments</h2>
          <div className="space-y-3">
            {userData.recentPayments.map((payment: any, index: number) => (
              <div 
                key={payment.id} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    payment.status === 'COMPLETED' ? 'bg-green-100' :
                    payment.status === 'PENDING' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <DollarSign className={`h-4 w-4 ${
                      payment.status === 'COMPLETED' ? 'text-green-600' :
                      payment.status === 'PENDING' ? 'text-yellow-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">PKR {payment.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{payment.type} • {new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-lg font-medium ${
                  payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Create Loan Modal */}
      <Modal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        title="Create New Loan"
        size="lg"
      >
        <CreateLoanForm
          userId={user.id}
          userName={user.fullName}
          riskProfile={riskProfile ? {
            riskLevel: riskProfile.riskLevel,
            recommendedMaxLoan: riskProfile.recommendedMaxLoan,
            recommendedTenure: riskProfile.recommendedTenure
          } : undefined}
          onSubmit={handleCreateLoan}
          onCancel={() => setIsLoanModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
