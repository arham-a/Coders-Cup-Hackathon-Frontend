'use client';

import { use, useState } from 'react';
import { getUserById, getLoansByUserId, getRiskProfileByUserId } from '@/lib/mock/adminMockData';
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
  Building
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
  
  const user = getUserById(id);
  const userLoans = getLoansByUserId(id);
  const riskProfile = getRiskProfileByUserId(id);

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

  const handleApprove = () => {
    alert('User approved successfully! (Mock action)');
    router.push('/admin/users/pending');
  };

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      alert('User rejected successfully! (Mock action)');
      router.push('/admin/users/pending');
    }
  };

  const handleCreateLoan = (data: any) => {
    console.log('Creating loan:', data);
    alert('Loan created successfully! (Mock action)');
    setIsLoanModalOpen(false);
    router.refresh();
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

      {/* Risk Profile */}
      {riskProfile && (
        <RiskProfileCard
          riskLevel={riskProfile.riskLevel}
          riskScore={riskProfile.riskScore}
          defaultProbability={riskProfile.defaultProbability || 0}
          recommendedMaxLoan={riskProfile.recommendedMaxLoan || 0}
          riskReasons={riskProfile.riskReasons}
          delay={0.3}
        />
      )}

      {/* Loans Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
