'use client';

import { useState } from 'react';
import { Calculator, AlertCircle, DollarSign } from 'lucide-react';

interface CreateLoanFormProps {
  userId: string;
  userName: string;
  riskProfile?: {
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendedMaxLoan?: number;
    recommendedTenure?: number;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function CreateLoanForm({ userId, userName, riskProfile, onSubmit, onCancel }: CreateLoanFormProps) {
  const [formData, setFormData] = useState({
    principalAmount: '',
    interestRate: '12',
    tenureMonths: '12',
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [calculated, setCalculated] = useState({
    monthlyInstallment: 0,
    totalAmount: 0,
    totalInterest: 0
  });

  const calculateLoan = () => {
    const principal = parseFloat(formData.principalAmount);
    const rate = parseFloat(formData.interestRate) / 12 / 100;
    const tenure = parseInt(formData.tenureMonths);

    if (principal && rate >= 0 && tenure) {
      const monthlyInstallment = rate === 0 
        ? principal / tenure
        : (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      
      const totalAmount = monthlyInstallment * tenure;
      const totalInterest = totalAmount - principal;

      setCalculated({
        monthlyInstallment: Math.round(monthlyInstallment),
        totalAmount: Math.round(totalAmount),
        totalInterest: Math.round(totalInterest)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, calculated });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRiskColor = (level: string) => {
    const colors = {
      HIGH: 'from-red-400 to-rose-500',
      MEDIUM: 'from-yellow-400 to-amber-500',
      LOW: 'from-green-400 to-emerald-500'
    };
    return colors[level as keyof typeof colors] || 'from-gray-400 to-slate-500';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-sm text-gray-600">
        Creating loan for: <span className="font-semibold text-gray-900">{userName}</span>
      </div>

      {/* Risk Profile Warning */}
      {riskProfile && (
        <div className={`bg-gradient-to-r ${getRiskColor(riskProfile.riskLevel)} rounded-xl p-4 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
          </div>
          <div className="relative z-10 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">
                AI Risk Assessment: {riskProfile.riskLevel} RISK
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/80">Recommended Max Loan</p>
                  <p className="font-bold">
                    PKR {(riskProfile.recommendedMaxLoan || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-white/80">Recommended Tenure</p>
                  <p className="font-bold">
                    {riskProfile.recommendedTenure || 0} months
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Principal Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Principal Amount (PKR) *
          </label>
          <input
            type="number"
            name="principalAmount"
            value={formData.principalAmount}
            onChange={handleChange}
            onBlur={calculateLoan}
            min="5000"
            max="500000"
            step="1000"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
            placeholder="e.g., 100000"
          />
          <p className="text-xs text-gray-500 mt-1">Min: PKR 5,000 | Max: PKR 500,000</p>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Interest Rate (%) *
          </label>
          <input
            type="number"
            name="interestRate"
            value={formData.interestRate}
            onChange={handleChange}
            onBlur={calculateLoan}
            min="0"
            max="30"
            step="0.5"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
            placeholder="e.g., 12"
          />
          <p className="text-xs text-gray-500 mt-1">Max: 30%</p>
        </div>

        {/* Tenure */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tenure (Months) *
          </label>
          <input
            type="number"
            name="tenureMonths"
            value={formData.tenureMonths}
            onChange={handleChange}
            onBlur={calculateLoan}
            min="3"
            max="60"
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
            placeholder="e.g., 12"
          />
          <p className="text-xs text-gray-500 mt-1">Min: 3 months | Max: 60 months</p>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
          placeholder="Add any additional notes about this loan..."
        />
      </div>

      {/* Calculation Results */}
      {calculated.monthlyInstallment > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Loan Calculation</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-orange-100">
              <p className="text-xs sm:text-sm text-gray-600">Monthly Installment</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                PKR {calculated.monthlyInstallment.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-orange-100">
              <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                PKR {calculated.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-orange-100">
              <p className="text-xs sm:text-sm text-gray-600">Total Interest</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                PKR {calculated.totalInterest.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={calculated.monthlyInstallment === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg hover:from-orange-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all font-medium"
        >
          <DollarSign className="h-5 w-5" />
          Create Loan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
