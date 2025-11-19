'use client';

import { useState, useMemo } from 'react';
import { mockAllInstallments, mockLoans, getUserById } from '@/lib/mock/adminMockData';
import { InstallmentStatus } from '@/lib/types/installment';
import { Receipt } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { SearchFilter } from '@/components/admin/SearchFilter';
import { StatsCard } from '@/components/admin/StatsCard';
import { DataTable, Column } from '@/components/admin/DataTable';
import { InstallmentCardList } from '@/components/admin/InstallmentCardList';
import { Pagination } from '@/components/admin/Pagination';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

export default function InstallmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InstallmentStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInstallments = useMemo(() => {
    return mockAllInstallments.filter(installment => {
      const loan = mockLoans.find(l => l.id === installment.loanId);
      const user = loan ? getUserById(loan.userId) : null;
      const matchesSearch = user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           installment.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || installment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredInstallments.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Paginated installments for cards (mobile/tablet)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInstallmentsForCards = filteredInstallments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const filterOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: InstallmentStatus.PENDING, label: 'Pending' },
    { value: InstallmentStatus.PAID, label: 'Paid' },
    { value: InstallmentStatus.OVERDUE, label: 'Overdue' },
    { value: InstallmentStatus.DEFAULTED, label: 'Defaulted' }
  ];

  const pendingCount = mockAllInstallments.filter(i => i.status === InstallmentStatus.PENDING).length;
  const paidCount = mockAllInstallments.filter(i => i.status === InstallmentStatus.PAID).length;
  const overdueCount = mockAllInstallments.filter(i => i.status === InstallmentStatus.OVERDUE).length;



  const columns: Column[] = [
    {
      header: 'User',
      accessor: (installment: any) => {
        const loan = mockLoans.find(l => l.id === installment.loanId);
        const user = loan ? getUserById(loan.userId) : null;
        return (
          <div>
            <p className="font-medium text-gray-900 text-sm">{user?.fullName}</p>
            <p className="text-xs sm:text-sm text-gray-500">{user?.email}</p>
          </div>
        );
      }
    },
    {
      header: 'Installment #',
      accessor: (installment: any) => <p className="text-sm text-gray-900">#{installment.installmentNumber}</p>
    },
    {
      header: 'Amount',
      accessor: (installment: any) => <p className="font-medium text-gray-900 text-sm">PKR {installment.amount.toLocaleString()}</p>
    },
    {
      header: 'Fine',
      accessor: (installment: any) => <p className="font-medium text-red-600 text-sm">PKR {installment.fineAmount.toLocaleString()}</p>
    },
    {
      header: 'Total Due',
      accessor: (installment: any) => <p className="font-bold text-gray-900 text-sm">PKR {installment.totalDue.toLocaleString()}</p>
    },
    {
      header: 'Due Date',
      accessor: (installment: any) => (
        <div>
          <p className="text-sm text-gray-900">{new Date(installment.dueDate).toLocaleDateString()}</p>
          {installment.daysOverdue > 0 && <p className="text-xs text-red-600">{installment.daysOverdue} days overdue</p>}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (installment: any) => <StatusBadge status={installment.status} size="sm" />
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="All Installments" description="Monitor all loan installments"/>
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterValue={statusFilter}
        onFilterChange={(value) => setStatusFilter(value as InstallmentStatus | 'ALL')}
        filterOptions={filterOptions}
        searchPlaceholder="Search by user name or installment ID..."
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatsCard label="Pending" value={pendingCount} color="orange" delay={0.3} />
        <StatsCard label="Paid" value={paidCount} color="green" delay={0.4} />
        <StatsCard label="Overdue" value={overdueCount} color="red" delay={0.5} />
      </motion.div>
      {filteredInstallments.length > 0 ? (
        <>
          {/* Table View (Desktop) */}
          <DataTable 
            columns={columns} 
            data={filteredInstallments}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {/* Card View (Mobile/Tablet) */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedInstallmentsForCards.map((installment, index) => {
              const loan = mockLoans.find(l => l.id === installment.loanId);
              const user = loan ? getUserById(loan.userId) : null;
              if (!user) return null;
              return (
                <InstallmentCardList
                  key={installment.id}
                  installment={installment}
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
            totalItems={filteredInstallments.length}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <Receipt className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base sm:text-lg">No installments found matching your criteria</p>
        </motion.div>
      )}
    </div>
  );
}
