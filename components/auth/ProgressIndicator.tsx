import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex-1 h-2 rounded-full ${
                currentStep > index ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            />
            {index < totalSteps - 1 && <div className="w-8" />}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-sm">
        {labels.map((label, index) => (
          <span
            key={index}
            className={currentStep > index ? 'text-emerald-600 font-medium' : 'text-gray-500'}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
