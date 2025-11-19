'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, XCircle, Eye, Mail, Phone, MapPin, DollarSign, Briefcase, Building } from 'lucide-react';
import { User } from '@/lib/types/user';

interface PendingUserCardProps {
  user: User;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  index: number;
}

export function PendingUserCard({ user, onApprove, onReject, index }: PendingUserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xl sm:text-2xl font-bold text-white">
            {user.fullName.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{user.fullName}</h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Registered on {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-900 text-sm break-words">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium text-gray-900 text-sm">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-medium text-gray-900 text-sm">{user.city}, {user.province}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Monthly Income</p>
              <p className="font-medium text-gray-900 text-sm">PKR {user.monthlyIncome.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Briefcase className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-500">Employment Type</p>
              <p className="font-medium text-gray-900 text-sm">{user.employmentType}</p>
            </div>
          </div>
          {user.employerName && (
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Employer</p>
                <p className="font-medium text-gray-900 text-sm">{user.employerName}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
        <Link
          href={`/admin/users/${user.id}`}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Link>
        <button
          onClick={() => onApprove(user.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all text-sm font-medium"
        >
          <CheckCircle className="h-4 w-4" />
          Approve
        </button>
        <button
          onClick={() => onReject(user.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-lg hover:from-red-500 hover:to-rose-600 transition-all text-sm font-medium"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </button>
      </div>
    </motion.div>
  );
}
