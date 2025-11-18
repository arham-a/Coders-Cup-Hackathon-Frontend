'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Activity,
  Info
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { RiskLevel } from '@/lib/types/risk';
import { ClickableStatCard } from '@/components/dashboard/ClickableStatCard';

interface RiskProfile {
  userId: string;
  riskLevel: RiskLevel;
  riskScore: number;
  riskReasons: string[];
  recommendedMaxLoan?: number;
  recommendedTenure?: number;
  defaultProbability?: number;
  lastCalculated: string;
}

export default function RiskProfilePage() {
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskProfile = async () => {
      try {
        try {
          const response = await apiClient.get('/user/risk-profile');
          setRiskProfile(response.data.data);
        } catch (apiError) {
          console.log('API not available, using mock data');
          const { activeRiskProfile } = await import('@/lib/mock/mockData');
          setRiskProfile(activeRiskProfile as any);
        }
      } catch (error) {
        console.error('Failed to fetch risk profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading risk profile...</p>
        </div>
      </div>
    );
  }

  if (!riskProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No Risk Profile Available</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Your risk profile hasn't been calculated yet.
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Contact your administrator to request a risk assessment.
          </p>
        </div>
      </motion.div>
    );
  }

  const getRiskConfig = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          gradient: 'from-green-500 to-green-600',
          label: 'Low Risk',
          description: 'Excellent creditworthiness'
        };
      case RiskLevel.MEDIUM:
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          gradient: 'from-yellow-500 to-yellow-600',
          label: 'Medium Risk',
          description: 'Moderate creditworthiness'
        };
      case RiskLevel.HIGH:
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          gradient: 'from-red-500 to-red-600',
          label: 'High Risk',
          description: 'Requires careful consideration'
        };
    }
  };

  const config = getRiskConfig(riskProfile.riskLevel);
  const RiskIcon = config.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Risk Profile</h1>
        <p className="text-sm sm:text-base text-gray-600">AI-powered credit risk assessment</p>
      </motion.div>

      {/* Risk Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-gradient-to-br ${config.gradient} rounded-xl shadow-lg p-6 sm:p-8 text-white relative overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white rounded-full -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white rounded-full translate-y-16 sm:translate-y-24 -translate-x-16 sm:-translate-x-24" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <RiskIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div>
                <p className="text-white/80 text-xs sm:text-sm mb-1">Your Risk Level</p>
                <h2 className="text-2xl sm:text-3xl font-bold">{config.label}</h2>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-white/80 text-xs sm:text-sm mb-1">Risk Score</p>
              <p className="text-3xl sm:text-4xl font-bold">{riskProfile.riskScore}/100</p>
            </div>
          </div>

          <p className="text-white/90 text-sm sm:text-base mb-6">{config.description}</p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-3 sm:h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${riskProfile.riskScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white/90 rounded-full"
              />
            </div>
          </div>

          <p className="text-white/70 text-xs sm:text-sm">
            Last calculated: {new Date(riskProfile.lastCalculated).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {riskProfile.recommendedMaxLoan && (
          <ClickableStatCard
            title="Recommended Max Loan"
            value={`PKR ${riskProfile.recommendedMaxLoan.toLocaleString()}`}
            icon={DollarSign}
            description="Based on your risk profile"
            color="green"
            delay={0.2}
          />
        )}

        {riskProfile.recommendedTenure && (
          <ClickableStatCard
            title="Recommended Tenure"
            value={`${riskProfile.recommendedTenure} months`}
            icon={Calendar}
            description="Optimal repayment period"
            color="blue"
            delay={0.3}
          />
        )}

        {riskProfile.defaultProbability !== undefined && (
          <ClickableStatCard
            title="Default Probability"
            value={`${(riskProfile.defaultProbability * 100).toFixed(1)}%`}
            icon={Activity}
            description="Estimated default risk"
            color={riskProfile.defaultProbability > 0.5 ? 'red' : riskProfile.defaultProbability > 0.3 ? 'yellow' : 'purple'}
            delay={0.4}
          />
        )}
      </div>

      {/* Risk Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Risk Assessment Factors
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          {riskProfile.riskReasons.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {riskProfile.riskReasons.map((reason, index) => {
                // Determine if this is a positive or negative factor
                const isNegative = reason.toLowerCase().includes('late') || 
                                   reason.toLowerCase().includes('missed') || 
                                   reason.toLowerCase().includes('default') ||
                                   reason.toLowerCase().includes('unstable') ||
                                   reason.toLowerCase().includes('high debt') ||
                                   reason.toLowerCase().includes('irregular') ||
                                   reason.toLowerCase().includes('low income');
                
                const FactorIcon = isNegative ? XCircle : CheckCircle;
                const factorColor = isNegative ? 'text-red-600' : config.color;
                const factorBg = isNegative ? 'bg-red-50' : config.bg;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${factorBg} flex items-center justify-center flex-shrink-0`}>
                      <FactorIcon className={`h-3 w-3 sm:h-4 sm:w-4 ${factorColor}`} />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 flex-1">{reason}</p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No risk factors available</p>
          )}
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">About Your Risk Profile</h4>
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              Your risk profile is calculated using AI-powered analysis of your financial history, 
              payment behavior, income stability, and other factors. This assessment helps determine 
              your loan eligibility and recommended terms. The profile is updated regularly based on 
              your payment performance.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
