'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole, UserStatus } from '@/lib/types/user';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      requireAuth={true}
      requiredRole={UserRole.USER}
      requiredStatus={UserStatus.APPROVED}
    >
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
