import { StatusCard } from '@/components/auth/StatusCard';

export default function RegistrationSuccessPage() {
  const icon = (
    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );

  return (
    <StatusCard
      icon={icon}
      title="Registration Successful!"
      description="Thank you for registering with our Microfinance Loan Management System."
      details={{
        title: "What happens next?",
        items: [
          "Your application is currently under review by our admin team",
          "You will receive an email notification once your account has been approved",
          "This usually takes 1-2 business days",
          "Once approved, you can log in and apply for loans"
        ]
      }}
      actionButton={{
        text: "Go to Login",
        href: "/login"
      }}
      footerText="Check your email for confirmation and updates"
    />
  );
}
