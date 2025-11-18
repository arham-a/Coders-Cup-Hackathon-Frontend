'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserStatus } from '@/lib/types/user';
import { InputMotion } from '@/components/ui/InputMotion';
import { Label } from '@/components/ui/Label';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/lib/utils';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000/api";


export function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------
  // VALIDATION
  // -------------------------------
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // HANDLE SUBMIT (REAL API)
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // 1) Make login API request
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 2) User status handling
      if (data.data.user.status === UserStatus.PENDING) {
        router.push('/pending-approval');
        return;
      }

      if (data.data.user.status === UserStatus.REJECTED) {
        setErrors({ general: 'Your account has been rejected. Please contact support.' });
        return;
      }

      // 3) Save token & user info
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // 4) Redirect based on ROLE
      if (data.data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      setErrors({
        general: err.message || "Login failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------
  // HANDLE INPUT CHANGE
  // -------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <>
      {errors.general && (
        <div className="mb-6">
          <Alert variant="error">{errors.general}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <InputMotion
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <InputMotion
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-emerald-700 to-emerald-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all hover:from-emerald-800 hover:to-emerald-900",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? 'Signing in...' : 'Sign In →'}
          <BottomGradient />
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
