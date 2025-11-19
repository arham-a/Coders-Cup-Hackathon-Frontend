'use client';

import { motion } from 'framer-motion';

interface RiskMetrics {
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  aiPredictedDefaults: number;
}

interface AdminRiskDistributionProps {
  risk: RiskMetrics;
}

export function AdminRiskDistribution({ risk }: AdminRiskDistributionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
    >
      <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">Risk Distribution</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center p-3 sm:p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <p className="text-2xl sm:text-3xl font-bold text-white">{risk.lowRisk}</p>
          <p className="text-xs sm:text-sm text-green-50 mt-1">Low Risk</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center p-3 sm:p-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <p className="text-2xl sm:text-3xl font-bold text-white">{risk.mediumRisk}</p>
          <p className="text-xs sm:text-sm text-yellow-50 mt-1">Medium Risk</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center p-3 sm:p-4 bg-gradient-to-br from-red-400 to-rose-500 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <p className="text-2xl sm:text-3xl font-bold text-white">{risk.highRisk}</p>
          <p className="text-xs sm:text-sm text-red-50 mt-1">High Risk</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <p className="text-2xl sm:text-3xl font-bold text-white">{risk.aiPredictedDefaults}</p>
          <p className="text-xs sm:text-sm text-orange-50 mt-1">AI Predicted Defaults</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
