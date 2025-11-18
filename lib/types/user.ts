export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum EmploymentType {
  SALARIED = 'SALARIED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  BUSINESS_OWNER = 'BUSINESS_OWNER',
  DAILY_WAGE = 'DAILY_WAGE',
  UNEMPLOYED = 'UNEMPLOYED'
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  monthlyIncome: number;
  employmentType: EmploymentType;
  employerName?: string;
  status: UserStatus;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      role: UserRole;
      status: UserStatus;
    };
  };
}

export interface RegisterRequest {
  fullName: string;
  cnic: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  city: string;
  province: string;
  monthlyIncome: number;
  employmentType: EmploymentType;
  employerName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
