'use client';

interface SettingInputProps {
  label: string;
  type?: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (value: string) => void;
  step?: string;
  min?: number;
  max?: number;
}

export function SettingInput({ 
  label, 
  type = 'text', 
  value, 
  onChange,
  step,
  min,
  max
}: SettingInputProps) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        max={max}
        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
      />
    </div>
  );
}
