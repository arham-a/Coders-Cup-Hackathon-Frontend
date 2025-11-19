'use client';

import { useEffect, useState } from 'react';
import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { mockDashboardStats, mockUsers, mockLoans } from '@/lib/mock/adminMockData';
import { UserStatus } from '@/lib/types/user';
import { AdminWelcomeBanner } from '@/components/dashboard/AdminWelcomeBanner';
import { AdminStatCard } from '@/components/dashboard/AdminStatCard';
import { AdminMetricsGrid } from '@/components/dashboard/AdminMetricsGrid';
import { AdminRiskDistribution } from '@/components/dashboard/AdminRiskDistribution';
import { AdminPendingApprovals } from '@/components/dashboard/AdminPendingApprovals';
import { AdminRecentLoans } from '@/components/dashboard/AdminRecentLoans';
import { adminService, DashboardStats } from '@/lib/services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardStats();
        console.log('Dashboard API Response:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats, using mock data:', error);
        setStats(mockDashboardStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // If stats not loaded yet, use mock
  const displayStats = stats || mockDashboardStats;
  const recentUsers = displayStats.pendingUsers || [];
  const recentLoans = displayStats.recentLoans || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <AdminWelcomeBanner 
        title="Admin Dashboard"
        subtitle="Overview of system performance and metrics"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Total Users"
          value={displayStats.users.total}
          icon={Users}
          subtitle={`${displayStats.users.pending} Pending • ${displayStats.users.approved} Approved`}
          color="orange"
          delay={0}
        />

        <AdminStatCard
          title="Active Loans"
          value={displayStats.loans.active}
          icon={DollarSign}
          subtitle={`${displayStats.loans.completed} Completed • ${displayStats.loans.defaulted} Defaulted`}
          color="green"
          delay={0.1}
        />

        <AdminStatCard
          title="Total Disbursed"
          value={`PKR ${(displayStats.loans.totalDisbursed / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          subtitle={`Collected: PKR ${(displayStats.loans.totalCollected / 1000).toFixed(0)}K`}
          color="purple"
          delay={0.2}
        />

        <AdminStatCard
          title="Outstanding"
          value={`PKR ${(displayStats.loans.totalOutstanding / 1000).toFixed(0)}K`}
          icon={TrendingDown}
          subtitle={`${displayStats.installments.overdue} Overdue Installments`}
          color="red"
          delay={0.3}
        />
      </div>

      {/* Installments Overview */}
      <AdminMetricsGrid metrics={displayStats.installments} />

      {/* Risk Distribution */}
      <AdminRiskDistribution risk={displayStats.risk} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminPendingApprovals users={recentUsers} />
        <AdminRecentLoans loans={recentLoans} users={mockUsers} />
      </div>
    </div>
  );
}

