'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { User, UserStatus } from '@/lib/types/user';

interface UserCardProps {
  user: User;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  index: number;
}

export function UserCard({ user, riskLevel, index }: UserCardProps) {
  const getStatusColor = (status: UserStatus) => {
    const styles = {
      [UserStatus.PENDING]: 'text-yellow-600',
      [UserStatus.APPROVED]: 'text-green-600',
      [UserStatus.REJECTED]: 'text-red-600'
    };
    return styles[status];
  };

  const getRiskColor = () => {
    if (!riskLevel) return null;
    
    const styles = {
      LOW: 'text-green-600',
      MEDIUM: 'text-yellow-600',
      HIGH: 'text-red-600'
    };
    return styles[riskLevel];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{user.fullName}</h3>
          <p className="text-xs sm:text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="flex flex-col gap-1 items-end ml-2">
          <span className={`text-xs font-bold whitespace-nowrap ${getStatusColor(user.status)}`}>
            {user.status}
          </span>
          {riskLevel && (
            <span className={`text-xs font-bold whitespace-nowrap ${getRiskColor()}`}>
              {riskLevel} Risk
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span className="truncate">{user.employmentType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span className="truncate">{user.city}, {user.province}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span className="font-medium">PKR {user.monthlyIncome.toLocaleString()}/mo</span>
        </div>
      </div>

      {/* Action */}
      <Link
        href={`/admin/users/${user.id}`}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-sm rounded-lg hover:from-orange-500 hover:to-amber-600 transition-all font-medium"
      >
        <Eye className="h-4 w-4" />
        View Details
      </Link>
    </motion.div>
  );
}
