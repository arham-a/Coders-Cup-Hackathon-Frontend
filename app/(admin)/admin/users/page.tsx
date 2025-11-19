'use client';

import { useState, useMemo } from 'react';
import { mockUsers, mockRiskProfiles, getUserById, getRiskProfileByUserId } from '@/lib/mock/adminMockData';
import { UserStatus } from '@/lib/types/user';
import { Users } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatsCard } from '@/components/admin/StatsCard';
import { UserCard } from '@/components/admin/UserCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { UserActionsMenu } from '@/components/admin/UserActionsMenu';
import { Pagination } from '@/components/admin/Pagination';
import { Modal } from '@/components/ui/Modal';
import { CreateLoanForm } from '@/components/admin/CreateLoanForm';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.phone.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const filterOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: UserStatus.PENDING, label: 'Pending' },
    { value: UserStatus.APPROVED, label: 'Approved' },
    { value: UserStatus.REJECTED, label: 'Rejected' }
  ];

  const pendingCount = mockUsers.filter(u => u.status === UserStatus.PENDING).length;
  const approvedCount = mockUsers.filter(u => u.status === UserStatus.APPROVED).length;
  const rejectedCount = mockUsers.filter(u => u.status === UserStatus.REJECTED).length;

  // Create risk profiles map for table
  const riskProfilesMap = useMemo(() => {
    const map = new Map();
    mockRiskProfiles.forEach(profile => {
      map.set(profile.userId, profile.riskLevel);
    });
    return map;
  }, []);

  // Paginated users for cards (mobile/tablet)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsersForCards = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCreateLoan = (userId: string) => {
    setSelectedUserId(userId);
    setIsLoanModalOpen(true);
  };

  const handleLoanSubmit = (data: any) => {
    console.log('Creating loan:', data);
    alert('Loan created successfully! (Mock action)');
    setIsLoanModalOpen(false);
    setSelectedUserId(null);
  };

  const selectedUser = selectedUserId ? getUserById(selectedUserId) : null;
  const selectedUserRiskProfile = selectedUserId ? getRiskProfileByUserId(selectedUserId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Users Management"
        description="Manage and monitor all registered users"
      />

      {/* Search & Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterValue={statusFilter}
        onFilterChange={(value) => setStatusFilter(value as UserStatus | 'ALL')}
        filterOptions={filterOptions}
        searchPlaceholder="Search by name, email, or phone..."
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 sm:gap-4"
      >
        <StatsCard label="Pending" value={pendingCount} color="orange" delay={0.3} />
        <StatsCard label="Approved" value={approvedCount} color="green" delay={0.4} />
        <StatsCard label="Rejected" value={rejectedCount} color="red" delay={0.5} />
      </motion.div>

      {/* Content */}
      {filteredUsers.length > 0 ? (
        <>
          {/* Table View (Desktop) */}
          <DataTable
            columns={[
              {
                header: 'User',
                accessor: (user: any) => (
                  <div>
                    <p className="font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.employmentType}</p>
                  </div>
                )
              },
              {
                header: 'Contact',
                accessor: (user: any) => (
                  <div>
                    <p className="text-sm text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </div>
                )
              },
              {
                header: 'Location',
                accessor: (user: any) => (
                  <div>
                    <p className="text-sm text-gray-900">{user.city}</p>
                    <p className="text-sm text-gray-500">{user.province}</p>
                  </div>
                )
              },
              {
                header: 'Income',
                accessor: (user: any) => <p className="text-sm font-medium text-gray-900">PKR {user.monthlyIncome.toLocaleString()}</p>
              },
              {
                header: 'Status',
                accessor: (user: any) => {
                  const styles = {
                    PENDING: 'text-yellow-600',
                    APPROVED: 'text-green-600',
                    REJECTED: 'text-red-600'
                  };
                  return <span className={`text-xs font-bold ${styles[user.status as keyof typeof styles]}`}>{user.status}</span>;
                }
              },
              {
                header: 'Risk',
                accessor: (user: any) => {
                  const riskLevel = riskProfilesMap.get(user.id);
                  if (!riskLevel) return null;
                  const styles: Record<string, string> = {
                    LOW: 'text-green-600',
                    MEDIUM: 'text-yellow-600',
                    HIGH: 'text-red-600'
                  };
                  return <span className={`text-xs font-bold ${styles[riskLevel]}`}>{riskLevel} Risk</span>;
                }
              },
              {
                header: 'Actions',
                accessor: (user: any) => <UserActionsMenu userId={user.id} userStatus={user.status} onCreateLoan={handleCreateLoan} />
              }
            ]}
            data={filteredUsers}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {/* Card View (Mobile/Tablet) */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {paginatedUsersForCards.map((user, index) => {
              const risk = mockRiskProfiles.find(r => r.userId === user.id);
              return (
                <UserCard
                  key={user.id}
                  user={user}
                  riskLevel={risk?.riskLevel}
                  index={index}
                />
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
        >
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No users found matching your criteria</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Create Loan Modal */}
      {selectedUser && (
        <Modal
          isOpen={isLoanModalOpen}
          onClose={() => {
            setIsLoanModalOpen(false);
            setSelectedUserId(null);
          }}
          title="Create New Loan"
          size="lg"
        >
          <CreateLoanForm
            userId={selectedUser.id}
            userName={selectedUser.fullName}
            riskProfile={selectedUserRiskProfile ? {
              riskLevel: selectedUserRiskProfile.riskLevel,
              recommendedMaxLoan: selectedUserRiskProfile.recommendedMaxLoan,
              recommendedTenure: selectedUserRiskProfile.recommendedTenure
            } : undefined}
            onSubmit={handleLoanSubmit}
            onCancel={() => {
              setIsLoanModalOpen(false);
              setSelectedUserId(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
