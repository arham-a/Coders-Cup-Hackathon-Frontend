'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function LoanRequestPage() {
  const [requestedAmount, setRequestedAmount] = useState<string>('');
  const [requestedTenure, setRequestedTenure] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const amountNum = Number(requestedAmount);
    const tenureNum = Number(requestedTenure);

    // Basic front-end validation (backend will enforce too)
    if (!amountNum || !tenureNum) {
      setErrorMessage('Please enter both amount and tenure.');
      return;
    }

    if (amountNum < 5000 || amountNum > 500000) {
      setErrorMessage('Loan amount must be between PKR 5,000 and PKR 500,000.');
      return;
    }

    if (tenureNum < 3 || tenureNum > 60) {
      setErrorMessage('Loan tenure must be between 3 and 60 months.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await apiClient.post('/users/loan-request', {
        requestedAmount: amountNum,
        requestedTenure: tenureNum,
        purpose: purpose || undefined,
      });

      setSuccessMessage(
        response.data?.message ||
          'Loan request submitted successfully. Our team will review it shortly.'
      );
      setErrorMessage('');

      // Optionally clear form after success
      setRequestedAmount('');
      setRequestedTenure('');
      setPurpose('');
    } catch (err: any) {
      console.error('Failed to submit loan request:', err);
      const backendMsg =
        err?.response?.data?.message ||
        'Failed to submit loan request. Please try again.';
      setErrorMessage(backendMsg);
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a New Loan</h1>
        <p className="text-gray-600">
          Submit a loan request for review by the microfinance team
        </p>
      </motion.div>

      {/* Highlight / Info Card (similar gradient style to Loan page) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl shadow-lg p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-2">
                Loan Request Overview
              </p>
              <h2 className="text-3xl font-bold">Apply for a New Loan</h2>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Request Status: Pending Review</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-green-100 mb-1">Allowed Amount</p>
              <p className="text-lg font-bold">PKR 5,000 – 500,000</p>
              <p className="text-xs text-green-100 mt-1">
                Based on your profile and risk assessment
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-green-100 mb-1">Tenure Range</p>
              <p className="text-lg font-bold">3 – 60 months</p>
              <p className="text-xs text-green-100 mt-1">
                Choose a repayment period that suits you
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm flex items-start gap-3">
              <Info className="h-5 w-5 text-green-100 mt-0.5" />
              <div>
                <p className="text-xs text-green-100 mb-1">Note</p>
                <p className="text-xs text-green-50">
                  Your request will be reviewed by an admin. You can only have one
                  active loan and one pending request at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Success / Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3"
        >
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <p className="text-green-800 text-sm font-medium">{successMessage}</p>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
        </motion.div>
      )}

      {/* Form Card (white, same language as Loan details cards) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Loan Request Form
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Requested Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Requested Amount (PKR)
            </label>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-2 bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg text-gray-500 text-sm">
                PKR
              </span>
              <input
                type="number"
                min={5000}
                max={500000}
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g. 100000"
              />
            </div>
            <p className="text-xs text-gray-500">
              Minimum PKR 5,000 and maximum PKR 500,000 (subject to approval).
            </p>
          </div>

          {/* Requested Tenure */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Requested Tenure (months)
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <input
                type="number"
                min={3}
                max={60}
                value={requestedTenure}
                onChange={(e) => setRequestedTenure(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                placeholder="e.g. 12"
              />
            </div>
            <p className="text-xs text-gray-500">
              Choose a repayment period between 3 and 60 months.
            </p>
          </div>

          {/* Purpose (optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Purpose of Loan (optional)
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Explain briefly why you are requesting this loan (e.g. small business expansion, education, medical expenses, etc.)"
            />
            <p className="text-xs text-gray-500">
              Providing details can help the admin team review your request more
              effectively.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  Submit Loan Request
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
