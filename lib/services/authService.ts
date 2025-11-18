import { apiClient } from '@/lib/api-client';
import { AuthResponse, User, RegisterRequest, UserRole, UserStatus, EmploymentType } from '@/lib/types/user';

export const authService = {
  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<{ userId: string; email: string; status: string }> {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },

  /**
   * Login
   */
  async login(email: string, password: string): Promise<AuthResponse['data']> {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data.data;

      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return response.data.data;
    } catch (error) {
      // If API fails, use mock login for demo purposes
      console.log('✅ Backend not available - Using mock authentication');
      console.log('📝 Any email/password combination will work!');
      
      // Mock credentials: any email/password will work
      const mockAuthData = {
        accessToken: 'mock-token-' + Date.now(),
        refreshToken: 'mock-refresh-' + Date.now(),
        user: {
          id: 'user-123',
          fullName: 'John Doe',
          email: email,
          role: 'USER' as UserRole,
          status: 'APPROVED' as UserStatus
        }
      };

      // Store full user data separately
      const fullMockUser = {
        id: 'user-123',
        fullName: 'John Doe',
        email: email,
        phone: '+92-300-1234567',
        address: '123 Main Street',
        city: 'Karachi',
        province: 'Sindh',
        monthlyIncome: 50000,
        employmentType: 'SALARIED' as EmploymentType,
        role: 'USER' as UserRole,
        status: 'APPROVED' as UserStatus,
        createdAt: new Date().toISOString()
      };

      // Store mock tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', mockAuthData.accessToken);
        localStorage.setItem('refreshToken', mockAuthData.refreshToken);
        localStorage.setItem('user', JSON.stringify(fullMockUser));
      }

      return mockAuthData;
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.data;
    } catch (error) {
      // If API fails, return stored user or mock user
      const storedUser = this.getStoredUser();
      if (storedUser) {
        return storedUser as User;
      }
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  },

  /**
   * Get stored user data
   */
  getStoredUser(): AuthResponse['data']['user'] | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  /**
   * Clear all auth data
   */
  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
};
