'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User } from '@/lib/types/user';
import { UserCircle } from 'lucide-react';

interface AdminPendingApprovalsProps {
  users: User[] | any[];
}

export function AdminPendingApprovals({ users }: AdminPendingApprovalsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Pending Approvals</h3>
        <Link 
          href="/admin/users/pending" 
          className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="space-y-3">
        {users.length > 0 ? (
          users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center justify-between gap-3 p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{user.fullName}</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</p>
              </div>
              <Link 
                href={`/admin/users/${user.id}`}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs sm:text-sm rounded-lg hover:from-orange-500 hover:to-amber-600 transition-all font-medium whitespace-nowrap"
              >
                Review
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <UserCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No pending approvals</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
