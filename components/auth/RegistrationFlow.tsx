'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { RegisterForm } from './RegisterForm';
import Link from 'next/link';

type FlowStep = 'register' | 'otp' | 'success';

interface RegistrationData {
  email: string;
  fullName: string;
}

export function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('register');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    email: '',
    fullName: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleRegistrationComplete = (data: { email: string; fullName: string }) => {
    setRegistrationData(data);
    setCurrentStep('otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    setOtpError('');

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    lastInput?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo: accept any 6-digit OTP
    // In production: verify with backend
    setIsVerifying(false);
    setCurrentStep('success');
  };

  const handleResendOtp = async () => {
    // Simulate resend
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    // Show toast or message that OTP was resent
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {currentStep === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterForm onSuccess={handleRegistrationComplete} />
          </motion.div>
        )}

        {currentStep === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to
              </p>
              <p className="text-green-600 font-semibold mt-1">
                {registrationData.email}
              </p>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-lg transition-all ${
                      digit
                        ? 'border-green-500 bg-green-50'
                        : otpError
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-red-600 text-sm text-center">{otpError}</p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying || otp.join('').length !== 6}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Resend */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOtp}
                  className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                >
                  Resend OTP
                </button>
              </p>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setCurrentStep('register')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Registration
            </button>
          </motion.div>
        )}

        {currentStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6 py-8"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>

            {/* Success Message */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mb-1">
                Welcome, <span className="font-semibold text-gray-900">{registrationData.fullName}</span>!
              </p>
              <p className="text-gray-600">
                Your account has been created successfully.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Your account is pending admin approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>You'll receive an email once approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>This usually takes 1-2 business days</span>
                </li>
              </ul>
            </div>

            {/* Login Button */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Go to Login
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-xs text-gray-500">
                You can now log in with your credentials
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
