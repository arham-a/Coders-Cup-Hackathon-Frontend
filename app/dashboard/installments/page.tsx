'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Search
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Installment, InstallmentStatus } from '@/lib/types/installment';
import { ClickableStatCard } from '@/components/dashboard/ClickableStatCard';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

export default function InstallmentsPage() {
  const router = useRouter();
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InstallmentStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        try {
          const response = await apiClient.get('/user/installments');
          setInstallments(response.data.data.installments || []);
        } catch (apiError) {
          console.log('API not available, using mock data');
          // Use mock data if API fails
          const { mockInstallments } = await import('@/lib/mock/mockData');
          setInstallments(mockInstallments);
        }
      } catch (error) {
        console.error('Failed to fetch installments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstallments();
  }, []);

  const getStatusConfig = (status: InstallmentStatus) => {
    switch (status) {
      case InstallmentStatus.PAID:
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'Paid',
        };
      case InstallmentStatus.PENDING:
        return {
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'Pending',
        };
      case InstallmentStatus.OVERDUE:
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          label: 'Overdue',
        };
      case InstallmentStatus.DEFAULTED:
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'Defaulted',
        };
    }
  };

  const filteredInstallments = installments.filter(inst => {
    const matchesFilter = filter === 'ALL' || inst.status === filter;
    const matchesSearch = searchTerm === '' || 
      inst.installmentNumber.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: installments.length,
    paid: installments.filter(i => i.status === InstallmentStatus.PAID).length,
    pending: installments.filter(i => i.status === InstallmentStatus.PENDING).length,
    overdue: installments.filter(i => i.status === InstallmentStatus.OVERDUE).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading installments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Installments</h1>
        <p className="text-gray-600">Track and manage your loan installments</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <ClickableStatCard
          title="Total"
          value={stats.total}
          icon={Calendar}
          color="indigo"
          delay={0.1}
        />

        <ClickableStatCard
          title="Paid"
          value={stats.paid}
          icon={CheckCircle}
          color="green"
          delay={0.2}
        />

        <ClickableStatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="blue"
          delay={0.3}
        />

        <ClickableStatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertCircle}
          color="yellow"
          delay={0.4}
        />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by installment number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="w-full sm:w-48">
            <CustomDropdown
              options={[
                { value: 'ALL', label: 'All Status' },
                { value: InstallmentStatus.PAID, label: 'Paid' },
                { value: InstallmentStatus.PENDING, label: 'Pending' },
                { value: InstallmentStatus.OVERDUE, label: 'Overdue' },
                { value: InstallmentStatus.DEFAULTED, label: 'Defaulted' },
              ]}
              value={filter}
              onChange={(value) => setFilter(value as InstallmentStatus | 'ALL')}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </motion.div>

      {/* Installments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {filteredInstallments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Installments Found</h3>
            <p className="text-gray-500">
              {filter !== 'ALL' 
                ? `No installments with status "${filter}"`
                : 'You don\'t have any installments yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredInstallments.map((installment, index) => {
              const statusConfig = getStatusConfig(installment.status);
              const StatusIcon = statusConfig.icon;
              const dueDate = new Date(installment.dueDate);
              const hasPaymentLink = (installment.status === InstallmentStatus.PENDING || 
                                     installment.status === InstallmentStatus.OVERDUE) && 
                                     installment.paymentLink;

              return (
                <motion.div
                  key={installment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/dashboard/installments/${installment.id}`)}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Status Icon */}
                    <div className="flex items-center justify-center flex-shrink-0">
                      <StatusIcon className={`h-8 w-8 sm:h-10 sm:w-10 ${statusConfig.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Installment #{installment.installmentNumber}
                          </h3>
                          <span className={`text-xs px-2 sm:px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.color} font-medium whitespace-nowrap`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        
                        {/* Amount - Desktop */}
                        <div className="hidden sm:block text-right">
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            PKR {installment.totalDue.toLocaleString()}
                          </p>
                          {installment.fineAmount > 0 && (
                            <p className="text-xs sm:text-sm text-red-600">
                              +PKR {installment.fineAmount.toLocaleString()} fine
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          Due: {dueDate.toLocaleDateString()}
                        </span>
                        {installment.paidDate && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            Paid: {new Date(installment.paidDate).toLocaleDateString()}
                          </span>
                        )}
                        {installment.daysOverdue > 0 && (
                          <span className="flex items-center gap-1 text-red-600 font-medium">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            {installment.daysOverdue} days overdue
                          </span>
                        )}
                      </div>

                      {/* Amount - Mobile */}
                      <div className="sm:hidden mt-3 flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            PKR {installment.totalDue.toLocaleString()}
                          </p>
                          {installment.fineAmount > 0 && (
                            <p className="text-xs text-red-600">
                              +PKR {installment.fineAmount.toLocaleString()} fine
                            </p>
                          )}
                        </div>
                        
                        {/* Pay Now Button - Mobile */}
                        {hasPaymentLink && (
                          <a
                            href={installment.paymentLink}
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm ${
                              installment.status === InstallmentStatus.OVERDUE
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            Pay Now
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Pay Now Button - Desktop */}
                    {hasPaymentLink && (
                      <a
                        href={installment.paymentLink}
                        onClick={(e) => e.stopPropagation()}
                        className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors font-medium text-sm flex-shrink-0 ${
                          installment.status === InstallmentStatus.OVERDUE
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        Pay Now
                        <span className={installment.status === InstallmentStatus.OVERDUE ? 'text-red-200' : 'text-green-200'}>
                          →
                        </span>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
