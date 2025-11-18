import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: {
    title: string;
    items: string[];
  };
  actionButton: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary';
  };
  footerText?: string;
}

export function StatusCard({
  icon,
  title,
  description,
  details,
  actionButton,
  footerText,
}: StatusCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 text-center">
      <div className="mb-6">{icon}</div>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{title}</h2>

      <p className="text-sm sm:text-base text-gray-600 mb-6">{description}</p>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-left">
            <h3 className="font-semibold text-emerald-900 mb-2 text-sm sm:text-base">{details.title}</h3>
            <ul className="text-xs sm:text-sm text-emerald-800 space-y-2">
              {details.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link href={actionButton.href}>
          <button
            className={cn(
              "group/btn relative block h-10 w-full rounded-md font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-all",
              actionButton.variant === 'secondary'
                ? "bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                : "bg-gradient-to-br from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900"
            )}
          >
            {actionButton.text}
            <BottomGradient />
          </button>
        </Link>

        {footerText && (
          <p className="text-sm text-gray-500">{footerText}</p>
        )}
      </div>
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
 
