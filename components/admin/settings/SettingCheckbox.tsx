'use client';

interface SettingCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SettingCheckbox({ label, checked, onChange }: SettingCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 mt-0.5 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
      />
      <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}
