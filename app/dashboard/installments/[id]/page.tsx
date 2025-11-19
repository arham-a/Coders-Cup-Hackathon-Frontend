'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft,
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign,
  FileText,
  CreditCard,
  Download,
  AlertTriangle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { apiClient } from '@/lib/api-client';
import { Installment, InstallmentStatus } from '@/lib/types/installment';

export default function InstallmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [installment, setInstallment] = useState<Installment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstallment = async () => {
      try {
        try {
          // Correct backend route: /api/users/installment/:id
          const response = await apiClient.get(`/users/installment/${params.id}`);
          setInstallment(response.data.data);
        } catch (apiError) {
          console.log('API not available, using mock data');
          const { mockInstallments } = await import('@/lib/mock/mockData');
          const found = mockInstallments.find(i => i.id === params.id);
          if (found) {
            setInstallment(found);
          } else {
            router.push('/dashboard/installments');
          }
        }
      } catch (error) {
        console.error('Failed to fetch installment:', error);
        router.push('/dashboard/installments');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInstallment();
    }
  }, [params.id, router]);

  const getStatusConfig = (status: InstallmentStatus) => {
    switch (status) {
      case InstallmentStatus.PAID:
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'Paid',
          description: 'This installment has been successfully paid',
        };
      case InstallmentStatus.PENDING:
        return {
          icon: Clock,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'Pending',
          description: 'Payment is pending for this installment',
        };
      case InstallmentStatus.OVERDUE:
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          label: 'Overdue',
          description: 'This installment is past its due date',
        };
      case InstallmentStatus.DEFAULTED:
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          label: 'Defaulted',
          description: 'This installment has been marked as defaulted',
        };
    }
  };

  const handleDownloadReceipt = () => {
    if (!installment) return;

    const doc = new jsPDF();

    const marginLeft = 15;
    let cursorY = 20;

    const addLine = (label: string, value: string, gap = 8) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, marginLeft, cursorY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, marginLeft + 45, cursorY);
      cursorY += gap;
    };

    const formatDate = (dateStr?: string | null) => {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const statusConfig = getStatusConfig(installment.status);

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Installment Payment Slip', marginLeft, cursorY);
    cursorY += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Microfinance Loan Management System', marginLeft, cursorY);
    cursorY += 10;

    // Horizontal line
    doc.setLineWidth(0.4);
    doc.line(marginLeft, cursorY, 195 - marginLeft, cursorY);
    cursorY += 10;

    // Installment basic info
    addLine('Installment No.', `#${installment.installmentNumber}`);
    addLine('Status', statusConfig.label);
    addLine('Due Date', formatDate(installment.dueDate));
    addLine('Grace Period End', formatDate(installment.gracePeriodEndDate));
    addLine('Paid On', installment.paidDate ? formatDate(installment.paidDate) : 'Not paid yet');
    addLine('Days Overdue', installment.daysOverdue?.toString() ?? '0');

    cursorY += 4;
    doc.line(marginLeft, cursorY, 195 - marginLeft, cursorY);
    cursorY += 10;

    // Amount breakdown
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Breakdown', marginLeft, cursorY);
    cursorY += 8;

    addLine('Base Amount', `PKR ${installment.amount.toLocaleString()}`);
    addLine('Fine Amount', `PKR ${installment.fineAmount.toLocaleString()}`);
    cursorY += 2;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Total Due:  PKR ${installment.totalDue.toLocaleString()}`,
      marginLeft,
      cursorY
    );
    cursorY += 10;

    if (installment.stripeSessionId) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Payment Reference: ${installment.stripeSessionId}`, marginLeft, cursorY);
      cursorY += 8;
    }

    // Footer note
    cursorY += 6;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      'This is a system-generated payslip for your loan installment. Please keep it for your records.',
      marginLeft,
      cursorY,
      { maxWidth: 180 }
    );

    // File name
    const fileName = `installment_${installment.installmentNumber}_payslip.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading installment details...</p>
        </div>
      </div>
    );
  }

  if (!installment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Installment Not Found</h3>
          <p className="text-gray-500 mb-6">The installment you're looking for doesn't exist.</p>
          <Link
            href="/dashboard/installments"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Installments
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(installment.status);
  const StatusIcon = statusConfig.icon;
  const dueDate = new Date(installment.dueDate);
  const gracePeriodEnd = new Date(installment.gracePeriodEndDate);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link
          href="/dashboard/installments"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Installments
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Installment #{installment.installmentNumber}
          </h1>
          <p className="text-gray-600">Detailed information about this installment</p>
        </div>
        <div className={`px-4 py-2 rounded-full ${statusConfig.bg} ${statusConfig.color} font-semibold`}>
          {statusConfig.label}
        </div>
      </motion.div>

      {/* Status alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${statusConfig.bg} ${statusConfig.border} border rounded-xl p-6`}
      >
        <div className="flex items-start gap-4">
          <StatusIcon className={`h-6 w-6 ${statusConfig.color} flex-shrink-0 mt-1`} />
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${statusConfig.color} mb-1`}>
              {statusConfig.label}
            </h3>
            <p className="text-gray-700">{statusConfig.description}</p>
            {installment.daysOverdue > 0 && (
              <p className="text-red-600 font-medium mt-2">
                ⚠️ This installment is {installment.daysOverdue} days overdue
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main amount card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-8 w-8" />
          <h2 className="text-xl font-semibold">Total Amount Due</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">
              PKR {installment.totalDue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-6 text-green-100">
            <div>
              <p className="text-sm opacity-90">Base Amount</p>
              <p className="text-lg font-semibold">PKR {installment.amount.toLocaleString()}</p>
            </div>
            {installment.fineAmount > 0 && (
              <div>
                <p className="text-sm opacity-90">Late Fee</p>
                <p className="text-lg font-semibold text-red-200">
                  +PKR {installment.fineAmount.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Pay section */}
      {(installment.status === InstallmentStatus.PENDING ||
        installment.status === InstallmentStatus.OVERDUE) &&
        installment.paymentLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Ready to Pay?
                </h3>
                <p className="text-gray-600">
                  Click below to make a secure payment via Stripe
                </p>
              </div>
              <a
                href={installment.paymentLink}
                className={`px-8 py-4 rounded-lg font-semibold text-white transition-colors ${
                  installment.status === InstallmentStatus.OVERDUE
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Pay Now
              </a>
            </div>
          </motion.div>
        )}

      {/* Installment details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Installment Details
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Due Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {dueDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Grace Period */}
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Grace Period Ends</p>
                <p className="text-lg font-semibold text-gray-900">
                  {gracePeriodEnd.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {installment.daysOverdue > 0
                    ? `Expired ${installment.daysOverdue} days ago`
                    : 'No late fees during grace period'}
                </p>
              </div>
            </div>

            {/* Paid Date */}
            {installment.paidDate && (
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Paid On</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(installment.paidDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-green-600 mt-1">✓ Payment successful</p>
                </div>
              </div>
            )}

            {/* Installment Number */}
            <div className="flex items-start gap-3">
              <FileText className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Installment Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  #{installment.installmentNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Payment breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Breakdown
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Base Installment Amount</span>
              <span className="text-lg font-semibold text-gray-900">
                PKR {installment.amount.toLocaleString()}
              </span>
            </div>

            {installment.fineAmount > 0 && (
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <span className="text-gray-600">Late Payment Fine</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Applied after grace period
                  </p>
                </div>
                <span className="text-lg font-semibold text-red-600">
                  +PKR {installment.fineAmount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between py-4 bg-gray-50 rounded-lg px-4">
              <span className="text-lg font-semibold text-gray-900">Total Amount Due</span>
              <span className="text-2xl font-bold text-green-600">
                PKR {installment.totalDue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overdue info */}
      {installment.status === InstallmentStatus.OVERDUE && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Overdue Payment Notice
              </h3>
              <p className="text-yellow-800 mb-3">
                This installment is {installment.daysOverdue} days overdue. Please make payment 
                immediately to avoid further penalties and potential default status.
              </p>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• Additional late fees may be applied for continued non-payment</li>
                <li>• Your credit profile may be negatively impacted</li>
                <li>• Continued non-payment may result in loan default</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Receipt & PDF button */}
      {installment.status === InstallmentStatus.PAID && installment.stripeSessionId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Payment Receipt
              </h3>
              <p className="text-sm text-gray-600">
                Transaction ID: {installment.stripeSessionId}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Download className="h-4 w-4" />
              Download Payslip (PDF)
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
