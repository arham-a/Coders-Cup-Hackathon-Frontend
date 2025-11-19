'use client';

import { useState, useEffect } from 'react';
import { mockUsers } from '@/lib/mock/adminMockData';
import { UserStatus } from '@/lib/types/user';
import { CheckCircle, Clock, UserCheck } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { PendingUserCard } from '@/components/admin/PendingUserCard';
import { motion } from 'framer-motion';
import { adminService, UserWithRisk } from '@/lib/services/adminService';

export default function PendingApprovalsPage() {
  const [users, setUsers] = useState<UserWithRisk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const response = await adminService.getUsers({
          status: UserStatus.PENDING,
          limit: 100, // Get all pending users
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch pending users, using mock data:', error);
        setUsers(mockUsers.filter(u => u.status === UserStatus.PENDING));
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await adminService.approveUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      alert('User approved successfully!');
    } catch (error) {
      console.error('Failed to approve user:', error);
      alert('Failed to approve user. Please try again.');
    }
  };

  const handleReject = async (userId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminService.rejectUser(userId, reason);
      setUsers(users.filter(u => u.id !== userId));
      alert('User rejected successfully!');
    } catch (error) {
      console.error('Failed to reject user:', error);
      alert('Failed to reject user. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Pending Approvals"
        description="Review and approve user registrations"
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 sm:p-6"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-900">{users.length}</p>
            <p className="text-xs sm:text-sm text-yellow-700 font-medium">Users awaiting approval</p>
          </div>
        </div>
      </motion.div>

      {/* Pending Users List */}
      {users.length > 0 ? (
        <div className="space-y-4">
          {users.map((user, index) => (
            <PendingUserCard
              key={user.id}
              user={user}
              onApprove={handleApprove}
              onReject={handleReject}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-sm sm:text-base text-gray-600">There are no pending user approvals at the moment.</p>
        </motion.div>
      )}
    </div>
  );
}
