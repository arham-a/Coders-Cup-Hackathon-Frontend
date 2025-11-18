import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
