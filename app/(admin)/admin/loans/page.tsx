'use client';

import { useState, useMemo } from 'react';
import { mockLoans, getUserById } from '@/lib/mock/adminMockData';
import { LoanStatus } from '@/lib/types/loan';
import { DollarSign, Eye } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { TableActionsMenu } from '@/components/admin/TableActionsMenu';
import { LoanCard } from '@/components/admin/LoanCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Pagination } from '@/components/admin/Pagination';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 10;

export default function LoansPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredLoans = useMemo(() => {
    return mockLoans.filter(loan => {
      const user = getUserById(loan.userId);
      const matchesSearch = user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           loan.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Paginated loans for cards (mobile/tablet)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLoansForCards = filteredLoans.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const filterOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: LoanStatus.ACTIVE, label: 'Active' },
    { value: LoanStatus.COMPLETED, label: 'Completed' },
    { value: LoanStatus.DEFAULTED, label: 'Defaulted' }
  ];

  const activeCount = mockLoans.filter(l => l.status === LoanStatus.ACTIVE).length;
  const completedCount = mockLoans.filter(l => l.status === LoanStatus.COMPLETED).length;
  const defaultedCount = mockLoans.filter(l => l.status === LoanStatus.DEFAULTED).length;



  const columns: Column[] = [
    {
      header: 'Borrower',
      accessor: (loan: any) => {
        const user = getUserById(loan.userId);
        return (
          <div>
            <p className="font-medium text-gray-900 text-sm">{user?.fullName}</p>
            <p className="text-xs sm:text-sm text-gray-500">{user?.email}</p>
          </div>
        );
      }
    },
    {
      header: 'Principal',
      accessor: (loan: any) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">PKR {loan.principalAmount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{loan.interestRate}% interest</p>
        </div>
      )
    },
    {
      header: 'Tenure',
      accessor: (loan: any) => <p className="text-sm text-gray-900">{loan.tenureMonths} months</p>
    },
    {
      header: 'Outstanding',
      accessor: (loan: any) => <p className="font-medium text-orange-600 text-sm">PKR {loan.outstandingBalance.toLocaleString()}</p>
    },
    {
      header: 'Repaid',
      accessor: (loan: any) => <p className="font-medium text-green-600 text-sm">PKR {loan.totalRepaid.toLocaleString()}</p>
    },
    {
      header: 'Status',
      accessor: (loan: any) => <StatusBadge status={loan.status} size="sm" />
    },
    {
      header: 'Actions',
      accessor: (loan: any) => (
        <TableActionsMenu
          actions={[
            {
              label: 'View Details',
              icon: Eye,
              onClick: () => router.push(`/admin/loans/${loan.id}`)
            }
          ]}
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Loans Management" description="Monitor and manage all loans" />
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterValue={statusFilter}
        onFilterChange={(value) => setStatusFilter(value as LoanStatus | 'ALL')}
        filterOptions={filterOptions}
        searchPlaceholder="Search by user name or loan ID..."
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatsCard label="Active" value={activeCount} color="green" delay={0.3} />
        <StatsCard label="Completed" value={completedCount} color="blue" delay={0.4} />
        <StatsCard label="Defaulted" value={defaultedCount} color="red" delay={0.5} />
      </motion.div>
      {filteredLoans.length > 0 ? (
        <>
          {/* Table View (Desktop) */}
          <DataTable 
            columns={columns} 
            data={filteredLoans}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {/* Card View (Mobile/Tablet) */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedLoansForCards.map((loan, index) => {
              const user = getUserById(loan.userId);
              if (!user) return null;
              return (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  user={user}
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
            totalItems={filteredLoans.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <DollarSign className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base sm:text-lg">No loans found matching your criteria</p>
        </motion.div>
      )}
    </div>
  );
}
