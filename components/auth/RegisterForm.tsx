'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EmploymentType } from '@/lib/types/user';
import { formatCNIC, formatPhone, isValidCNIC, isValidPhone } from '@/lib/utils/auth';
import { Alert } from '@/components/ui/Alert';
import { ProgressIndicator } from './ProgressIndicator';
import { RegisterFormStep1 } from './RegisterFormStep1';
import { RegisterFormStep2 } from './RegisterFormStep2';

interface RegisterFormProps {
  onSuccess?: (data: { email: string; fullName: string }) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps = {}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    cnic: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    province: '',
    monthlyIncome: '',
    employmentType: '' as EmploymentType | '',
    employerName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData.cnic) {
      newErrors.cnic = 'CNIC is required';
    } else if (!isValidCNIC(formData.cnic)) {
      newErrors.cnic = 'Invalid CNIC format (13 digits required)';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid Pakistani phone number';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.province) {
      newErrors.province = 'Province is required';
    }

    if (!formData.monthlyIncome) {
      newErrors.monthlyIncome = 'Monthly income is required';
    } else if (Number(formData.monthlyIncome) < 0) {
      newErrors.monthlyIncome = 'Income cannot be negative';
    }

    if (!formData.employmentType) {
      newErrors.employmentType = 'Employment type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);
    setErrors({});

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo: Skip actual API call and go directly to OTP
    if (onSuccess) {
      onSuccess({ email: formData.email, fullName: formData.fullName });
    } else {
      router.push('/registration-success');
    }
    
    setIsLoading(false);

    /* 
    // TODO: Uncomment for production with real API
    try {
      const { confirmPassword, ...registerData } = formData;

      await authService.register({
        ...registerData,
        monthlyIncome: Number(registerData.monthlyIncome),
        employmentType: registerData.employmentType as EmploymentType,
      });

      if (onSuccess) {
        onSuccess({ email: formData.email, fullName: formData.fullName });
      } else {
        router.push('/registration-success');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === 'cnic') {
      formattedValue = formatCNIC(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <>
      <ProgressIndicator
        currentStep={step}
        totalSteps={2}
        labels={['Personal Info', 'Financial Info']}
      />

      {errors.general && (
        <div className="mt-6">
          <Alert variant="error">{errors.general}</Alert>
        </div>
      )}

      <div className="mt-6">
        {step === 1 && (
          <RegisterFormStep1
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <RegisterFormStep2
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </>
  );
}
