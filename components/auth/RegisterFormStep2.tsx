import React, { useState, useRef, useEffect } from 'react';
import { InputMotion } from '@/components/ui/InputMotion';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { EmploymentType } from '@/lib/types/user';

const PROVINCES = [
  { value: '', label: 'Select Province' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'Sindh', label: 'Sindh' },
  { value: 'KPK', label: 'KPK' },
  { value: 'Balochistan', label: 'Balochistan' },
  { value: 'Gilgit-Baltistan', label: 'Gilgit-Baltistan' },
  { value: 'AJK', label: 'AJK' },
];

const EMPLOYMENT_TYPES = [
  { value: '', label: 'Select Employment Type' },
  { value: EmploymentType.SALARIED, label: 'Salaried' },
  { value: EmploymentType.SELF_EMPLOYED, label: 'Self Employed' },
  { value: EmploymentType.BUSINESS_OWNER, label: 'Business Owner' },
  { value: EmploymentType.DAILY_WAGE, label: 'Daily Wage' },
  { value: EmploymentType.UNEMPLOYED, label: 'Unemployed' },
];

interface RegisterFormStep2Props {
  formData: {
    address: string;
    city: string;
    province: string;
    monthlyIncome: string;
    employmentType: string;
    employerName: string;
  };
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

// Custom Dropdown Component
interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: boolean;
}

function CustomDropdown({ options, value, onChange, placeholder, error }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition duration-400 hover:border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-[2px] focus-visible:ring-emerald-400 focus-visible:outline-none",
          !value && "text-gray-400",
          error && "border-red-500 ring-2 ring-red-500"
        )}
      >
        <span>{selectedLabel}</span>
        <svg
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto py-1">
            {options.filter(opt => opt.value !== '').map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function RegisterFormStep2({
  formData,
  errors,
  onChange,
  onBack,
  onSubmit,
  isLoading,
}: RegisterFormStep2Props) {
  const handleProvinceChange = (value: string) => {
    const syntheticEvent = {
      target: { name: 'province', value }
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
  };

  const handleEmploymentTypeChange = (value: string) => {
    const syntheticEvent = {
      target: { name: 'employmentType', value }
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          rows={3}
          placeholder="Enter your complete address"
          required
          className={cn(
            "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition duration-400 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:border-emerald-500 focus-visible:ring-[2px] focus-visible:ring-emerald-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:border-emerald-500",
            errors.address && "border-red-500 ring-2 ring-red-500"
          )}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <InputMotion
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={onChange}
            error={errors.city}
            placeholder="City"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Province</Label>
          <CustomDropdown
            options={PROVINCES}
            value={formData.province}
            onChange={handleProvinceChange}
            placeholder="Select Province"
            error={!!errors.province}
          />
          {errors.province && <p className="text-sm text-red-500">{errors.province}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthlyIncome">Monthly Income (PKR)</Label>
        <InputMotion
          type="number"
          id="monthlyIncome"
          name="monthlyIncome"
          value={formData.monthlyIncome}
          onChange={onChange}
          error={errors.monthlyIncome}
          min="0"
          placeholder="Enter monthly income"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Employment Type</Label>
        <CustomDropdown
          options={EMPLOYMENT_TYPES}
          value={formData.employmentType}
          onChange={handleEmploymentTypeChange}
          placeholder="Select Employment Type"
          error={!!errors.employmentType}
        />
        {errors.employmentType && <p className="text-sm text-red-500">{errors.employmentType}</p>}
      </div>

      {(formData.employmentType === EmploymentType.SALARIED ||
        formData.employmentType === EmploymentType.BUSINESS_OWNER) && (
        <div className="space-y-2">
          <Label htmlFor="employerName">Employer/Business Name</Label>
          <InputMotion
            type="text"
            id="employerName"
            name="employerName"
            value={formData.employerName}
            onChange={onChange}
            placeholder="Enter employer or business name"
          />
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="group/btn relative block h-10 w-full rounded-md bg-gray-100 font-medium text-gray-700 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all hover:bg-gray-200"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-emerald-700 to-emerald-800 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all hover:from-emerald-800 hover:to-emerald-900",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? 'Registering...' : 'Register →'}
          <BottomGradient />
        </button>
      </div>
    </form>
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
