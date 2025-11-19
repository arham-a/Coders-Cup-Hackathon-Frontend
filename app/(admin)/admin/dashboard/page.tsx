'use client';

import { Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { mockDashboardStats, mockUsers, mockLoans } from '@/lib/mock/adminMockData';
import { UserStatus } from '@/lib/types/user';
import { AdminWelcomeBanner } from '@/components/dashboard/AdminWelcomeBanner';
import { AdminStatCard } from '@/components/dashboard/AdminStatCard';
import { AdminMetricsGrid } from '@/components/dashboard/AdminMetricsGrid';
import { AdminRiskDistribution } from '@/components/dashboard/AdminRiskDistribution';
import { AdminPendingApprovals } from '@/components/dashboard/AdminPendingApprovals';
import { AdminRecentLoans } from '@/components/dashboard/AdminRecentLoans';

export default function AdminDashboard() {
  const stats = mockDashboardStats;

  const recentUsers = mockUsers
    .filter(u => u.status === UserStatus.PENDING)
    .slice(0, 5);

  const recentLoans = mockLoans
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
          value={stats.users.total}
          icon={Users}
          subtitle={`${stats.users.pending} Pending • ${stats.users.approved} Approved`}
          color="orange"
          delay={0}
        />

        <AdminStatCard
          title="Active Loans"
          value={stats.loans.active}
          icon={DollarSign}
          subtitle={`${stats.loans.completed} Completed • ${stats.loans.defaulted} Defaulted`}
          color="green"
          delay={0.1}
        />

        <AdminStatCard
          title="Total Disbursed"
          value={`PKR ${(stats.loans.totalDisbursed / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          subtitle={`Collected: PKR ${(stats.loans.totalCollected / 1000).toFixed(0)}K`}
          color="purple"
          delay={0.2}
        />

        <AdminStatCard
          title="Outstanding"
          value={`PKR ${(stats.loans.totalOutstanding / 1000).toFixed(0)}K`}
          icon={TrendingDown}
          subtitle={`${stats.installments.overdue} Overdue Installments`}
          color="red"
          delay={0.3}
        />
      </div>

      {/* Installments Overview */}
      <AdminMetricsGrid metrics={stats.installments} />

      {/* Risk Distribution */}
      <AdminRiskDistribution risk={stats.risk} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminPendingApprovals users={recentUsers} />
        <AdminRecentLoans loans={recentLoans} users={mockUsers} />
      </div>
    </div>
  );
}

