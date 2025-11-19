'use client';

import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface RiskProfileCardProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  defaultProbability: number;
  recommendedMaxLoan: number;
  riskReasons: string[];
  delay?: number;
}

export function RiskProfileCard({
  riskLevel,
  riskScore,
  defaultProbability,
  recommendedMaxLoan,
  riskReasons,
  delay = 0
}: RiskProfileCardProps) {
  const getRiskColor = (level: string) => {
    const colors = {
      LOW: 'from-green-400 to-emerald-500',
      MEDIUM: 'from-orange-400 to-orange-600',
      HIGH: 'from-red-400 to-rose-500'
    };
    return colors[level as keyof typeof colors] || 'from-gray-400 to-slate-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${getRiskColor(riskLevel)} rounded-xl shadow-lg p-4 sm:p-6 text-white relative overflow-hidden`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl -translate-y-24 translate-x-24" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Risk Assessment
          </h2>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-bold text-sm sm:text-base self-start">
            {riskLevel} RISK
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-xs sm:text-sm text-white/80">Risk Score</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{riskScore}/100</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-xs sm:text-sm text-white/80">Default Probability</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">
              {(defaultProbability * 100).toFixed(0)}%
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-xs sm:text-sm text-white/80">Max Loan</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">
              PKR {recommendedMaxLoan.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Factors
          </p>
          <ul className="space-y-2">
            {riskReasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-white/90">
                <span className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 flex-shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
