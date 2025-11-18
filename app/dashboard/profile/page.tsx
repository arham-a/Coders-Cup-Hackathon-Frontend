'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  Building2,
  Home,
  AlertCircle,
  MapPinned,
  IdCard
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { User, UserStatus, EmploymentType } from '@/lib/types/user';
import { mockUser } from '@/lib/mock/mockData';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/user/profile');
        setUser(response.data.data);
      } catch (apiError) {
        console.log('API not available, using mock data');
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({
      phone: user?.phone,
      address: user?.address,
      monthlyIncome: user?.monthlyIncome,
      employerName: user?.employerName,
    });
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({});
    setSuccessMessage('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      try {
        const response = await apiClient.put('/user/profile', editedUser);
        setUser(response.data.data);
        setSuccessMessage('Profile updated successfully!');
      } catch (apiError) {
        console.log('API not available, simulating update');
        setUser({ ...user!, ...editedUser });
        setSuccessMessage('Profile updated successfully! (Mock Mode)');
      }
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case UserStatus.APPROVED:
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'Approved',
        };
      case UserStatus.PENDING:
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          label: 'Pending Approval',
        };
      case UserStatus.REJECTED:
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'Rejected',
        };
    }
  };

  const getEmploymentLabel = (type: EmploymentType) => {
    const labels = {
      [EmploymentType.SALARIED]: 'Salaried Employee',
      [EmploymentType.SELF_EMPLOYED]: 'Self Employed',
      [EmploymentType.BUSINESS_OWNER]: 'Business Owner',
      [EmploymentType.DAILY_WAGE]: 'Daily Wage Worker',
      [EmploymentType.UNEMPLOYED]: 'Unemployed',
    };
    return labels[type];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-500">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(user.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">{successMessage}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${statusConfig.bg} ${statusConfig.border} border rounded-xl p-6`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full ${statusConfig.bg} ${statusConfig.border} border-2 flex items-center justify-center`}>
            <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${statusConfig.color} mb-1`}>
              Account Status: {statusConfig.label}
            </h3>
            <p className="text-gray-700">
              {user.status === UserStatus.APPROVED && 'Your account is active and you can access all features.'}
              {user.status === UserStatus.PENDING && 'Your account is pending admin approval.'}
              {user.status === UserStatus.REJECTED && 'Your account application was not approved.'}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white"
      >
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border-4 border-white/30">
            <UserIcon className="h-12 w-12 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{user.fullName}</h2>
            <div className="flex flex-wrap items-center gap-4 text-green-100">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {user.phone}
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            Personal Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-lg font-semibold text-gray-900">{user.fullName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Phone</p>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedUser.phone || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">City</p>
              <p className="text-lg font-semibold text-gray-900">{user.city}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              {isEditing ? (
                <textarea
                  value={editedUser.address || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">{user.address}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Employment Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Employment Type</p>
              <p className="text-lg font-semibold text-gray-900">{getEmploymentLabel(user.employmentType)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Monthly Income</p>
              {isEditing ? (
                <input
                  type="number"
                  value={editedUser.monthlyIncome || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, monthlyIncome: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min="0"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900">PKR {user.monthlyIncome.toLocaleString()}</p>
              )}
            </div>
            {user.employerName && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-gray-500">Employer Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.employerName || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, employerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="text-lg font-semibold text-gray-900">{user.employerName}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
