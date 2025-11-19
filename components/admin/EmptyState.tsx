'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = 'text-green-500' 
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
      <Icon className={`h-12 w-12 sm:h-16 sm:w-16 ${iconColor} mx-auto mb-4`} />
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600">{description}</p>
    </div>
  );
}
