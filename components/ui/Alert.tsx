import React from 'react';

interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
}

export function Alert({ variant = 'error', children }: AlertProps) {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-600',
    success: 'bg-green-50 border-green-200 text-green-600',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    info: 'bg-blue-50 border-blue-200 text-blue-600',
  };

  return (
    <div className={`p-4 border rounded-lg ${variants[variant]}`}>
      <p className="text-sm">{children}</p>
    </div>
  );
}
