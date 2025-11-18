'use client';

import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: any;
  requiredStatus?: any;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // DEVELOPMENT MODE: Auto-setup mock user, no authentication required
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mockUser = {
        id: 'user-123',
        fullName: 'John Doe',
        email: 'demo@example.com',
        phone: '+92-300-1234567',
        address: '123 Main Street',
        city: 'Karachi',
        province: 'Sindh',
        monthlyIncome: 50000,
        employmentType: 'SALARIED',
        role: 'USER',
        status: 'APPROVED',
        createdAt: new Date().toISOString()
      };

      // Auto-set mock authentication if not present
      if (!localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', 'dev-mock-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
    }
  }, []);

  // No authentication checks - just render children
  return <>{children}</>;
}
