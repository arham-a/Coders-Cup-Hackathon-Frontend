import React from 'react';
import { InputMotion } from '@/components/ui/InputMotion';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';

interface RegisterFormStep1Props {
  formData: {
    fullName: string;
    cnic: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export function RegisterFormStep1({ formData, errors, onChange, onNext }: RegisterFormStep1Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <InputMotion
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          error={errors.fullName}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cnic">CNIC</Label>
        <InputMotion
          type="text"
          id="cnic"
          name="cnic"
          value={formData.cnic}
          onChange={onChange}
          error={errors.cnic}
          maxLength={15}
          placeholder="XXXXX-XXXXXXX-X"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <InputMotion
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          error={errors.phone}
          placeholder="03XXXXXXXXX"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <InputMotion
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
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
          onChange={onChange}
          error={errors.password}
          placeholder="Minimum 8 characters"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <InputMotion
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          required
        />
      </div>

      <button
        type="button"
        onClick={onNext}
        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-emerald-700 to-emerald-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all hover:from-emerald-800 hover:to-emerald-900"
      >
        Next Step →
        <BottomGradient />
      </button>
    </div>
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
