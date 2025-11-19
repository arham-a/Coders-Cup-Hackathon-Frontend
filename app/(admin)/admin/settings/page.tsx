'use client';

import { useState } from 'react';
import { Bell, Shield, DollarSign, Mail, Save, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { SettingSection } from '@/components/admin/settings/SettingSection';
import { SettingInput } from '@/components/admin/settings/SettingInput';
import { SettingCheckbox } from '@/components/admin/settings/SettingCheckbox';

export default function SettingsPage() {
  // Loan Settings State
  const [minLoanAmount, setMinLoanAmount] = useState('5000');
  const [maxLoanAmount, setMaxLoanAmount] = useState('500000');
  const [maxInterestRate, setMaxInterestRate] = useState('30');
  const [gracePeriod, setGracePeriod] = useState('2');

  // Fine Settings State
  const [latePaymentFine, setLatePaymentFine] = useState('200');
  const [defaultThreshold, setDefaultThreshold] = useState('10');

  // Notification Settings State
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [overdueNotifications, setOverdueNotifications] = useState(true);
  const [newUserNotifications, setNewUserNotifications] = useState(true);
  const [defaultNotifications, setDefaultNotifications] = useState(true);

  // Email Settings State
  const [fromEmail, setFromEmail] = useState('noreply@loanpulse.com');
  const [adminEmail, setAdminEmail] = useState('admin@loanpulse.com');

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Configure system parameters and preferences</p>
      </motion.div>

      {/* Loan Settings */}
      <SettingSection title="Loan Settings" icon={DollarSign} iconColor="text-orange-600" delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingInput
            label="Minimum Loan Amount (PKR)"
            type="number"
            value={minLoanAmount}
            onChange={setMinLoanAmount}
            min={1000}
          />
          <SettingInput
            label="Maximum Loan Amount (PKR)"
            type="number"
            value={maxLoanAmount}
            onChange={setMaxLoanAmount}
            min={10000}
          />
          <SettingInput
            label="Maximum Interest Rate (%)"
            type="number"
            value={maxInterestRate}
            onChange={setMaxInterestRate}
            step="0.5"
            min={0}
            max={100}
          />
          <SettingInput
            label="Grace Period (Days)"
            type="number"
            value={gracePeriod}
            onChange={setGracePeriod}
            min={0}
            max={30}
          />
        </div>
      </SettingSection>

      {/* Fine Settings */}
      <SettingSection title="Fine & Penalty Settings" icon={Shield} iconColor="text-red-600" delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingInput
            label="Late Payment Fine (PKR)"
            type="number"
            value={latePaymentFine}
            onChange={setLatePaymentFine}
            min={0}
          />
          <SettingInput
            label="Default Threshold (Days)"
            type="number"
            value={defaultThreshold}
            onChange={setDefaultThreshold}
            min={1}
            max={90}
          />
        </div>
      </SettingSection>

      {/* Notification Settings */}
      <SettingSection title="Notification Settings" icon={Bell} iconColor="text-purple-600" delay={0.3}>
        <div className="space-y-3 sm:space-y-4">
          <SettingCheckbox
            label="Send payment reminders 3 days before due date"
            checked={paymentReminders}
            onChange={setPaymentReminders}
          />
          <SettingCheckbox
            label="Send overdue notifications"
            checked={overdueNotifications}
            onChange={setOverdueNotifications}
          />
          <SettingCheckbox
            label="Notify admin of new user registrations"
            checked={newUserNotifications}
            onChange={setNewUserNotifications}
          />
          <SettingCheckbox
            label="Notify admin of loan defaults"
            checked={defaultNotifications}
            onChange={setDefaultNotifications}
          />
          
          {/* Manual Trigger Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Manual Triggers</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={async () => {
                  try {
                    const { adminService } = await import('@/lib/services/adminService');
                    await adminService.triggerInstallmentReminders();
                    alert('Installment reminders triggered successfully!');
                  } catch (error) {
                    console.error('Failed to trigger reminders:', error);
                    alert('Failed to trigger reminders. Please try again.');
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Bell className="h-4 w-4" />
                Send Payment Reminders
              </button>
              <button
                onClick={async () => {
                  try {
                    const { adminService } = await import('@/lib/services/adminService');
                    await adminService.triggerOverdueNotices();
                    alert('Overdue notices triggered successfully!');
                  } catch (error) {
                    console.error('Failed to trigger overdue notices:', error);
                    alert('Failed to trigger overdue notices. Please try again.');
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <AlertTriangle className="h-4 w-4" />
                Send Overdue Notices
              </button>
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Email Settings */}
      <SettingSection title="Email Settings" icon={Mail} iconColor="text-blue-600" delay={0.4}>
        <div className="space-y-4">
          <SettingInput
            label="From Email Address"
            type="email"
            value={fromEmail}
            onChange={setFromEmail}
          />
          <SettingInput
            label="Admin Email Address"
            type="email"
            value={adminEmail}
            onChange={setAdminEmail}
          />
        </div>
      </SettingSection>

      {/* Save Button */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row justify-end gap-3"
      >
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </motion.div>
    </div>
  );
}

