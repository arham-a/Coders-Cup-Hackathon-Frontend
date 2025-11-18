'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';
import { UserRole, UserStatus } from '@/lib/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRole;
  requiredStatus?: UserStatus;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  requiredStatus = UserStatus.APPROVED,
}: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    if (requireAuth) {
      const isAuth = authService.isAuthenticated();
      
      if (!isAuth) {
        router.push('/login');
        return;
      }

      const user = authService.getStoredUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Check status
      if (user.status !== requiredStatus) {
        if (user.status === UserStatus.PENDING) {
          router.push('/pending-approval');
        } else if (user.status === UserStatus.REJECTED) {
          authService.clearAuth();
          router.push('/login');
        }
        return;
      }

      // Check role
      if (requiredRole && user.role !== requiredRole) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [requireAuth, requiredRole, requiredStatus, router]);

  return <>{children}</>;
}
