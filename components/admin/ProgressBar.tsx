'use client';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  showPercentage?: boolean;
  color?: 'orange' | 'green' | 'blue' | 'red';
}

export function ProgressBar({ 
  label, 
  value, 
  max, 
  showPercentage = true,
  color = 'orange' 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorClass = () => {
    const colors = {
      orange: 'from-orange-400 to-amber-500',
      green: 'from-green-400 to-emerald-500',
      blue: 'from-blue-400 to-cyan-500',
      red: 'from-red-400 to-rose-500'
    };
    return colors[color];
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {showPercentage && (
          <p className="text-sm font-medium text-gray-900">{percentage.toFixed(1)}%</p>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`bg-gradient-to-r ${getColorClass()} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}
