'use client';

import { use, useState } from 'react';
import { getUserById, getRiskProfileByUserId } from '@/lib/mock/adminMockData';
import { Calculator, AlertCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateLoanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const user = getUserById(id);
  const riskProfile = getRiskProfileByUserId(id);

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

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const calculateLoan = () => {
    const principal = parseFloat(formData.principalAmount);
    const rate = parseFloat(formData.interestRate) / 12 / 100;
    const tenure = parseInt(formData.tenureMonths);

    if (principal && rate && tenure) {
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
    alert('Loan created successfully! (Mock action)');
    router.push(`/admin/users/${id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <Link href={`/admin/users/${id}`} className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← Back to User Profile
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Loan</h1>
        <p className="text-gray-600 mt-1">For {user.fullName}</p>
      </div>

      {/* Risk Profile Warning */}
      {riskProfile && (
        <div className={`rounded-xl border p-6 ${
          riskProfile.riskLevel === 'HIGH' ? 'bg-red-50 border-red-200' :
          riskProfile.riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
          'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`h-6 w-6 mt-0.5 ${
              riskProfile.riskLevel === 'HIGH' ? 'text-red-600' :
              riskProfile.riskLevel === 'MEDIUM' ? 'text-yellow-600' :
              'text-green-600'
            }`} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                AI Risk Assessment: {riskProfile.riskLevel} RISK
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Recommended Max Loan</p>
                  <p className="font-bold text-gray-900">
                    PKR {(riskProfile.recommendedMaxLoan || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Recommended Tenure</p>
                  <p className="font-bold text-gray-900">
                    {riskProfile.recommendedTenure || 0} months
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any additional notes about this loan..."
          />
        </div>

        {/* Calculation Results */}
        {calculated.monthlyInstallment > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Loan Calculation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Monthly Installment</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  PKR {calculated.monthlyInstallment.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  PKR {calculated.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Interest</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  PKR {calculated.totalInterest.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={calculated.monthlyInstallment === 0}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <DollarSign className="h-5 w-5" />
            Create Loan
          </button>
          <Link
            href={`/admin/users/${id}`}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
