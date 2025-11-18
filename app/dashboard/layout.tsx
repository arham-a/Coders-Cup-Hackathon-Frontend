'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole, UserStatus } from '@/lib/types/user';

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
      {children}
    </ProtectedRoute>
  );
}
