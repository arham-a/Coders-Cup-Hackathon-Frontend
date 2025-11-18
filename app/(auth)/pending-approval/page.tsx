import { StatusCard } from '@/components/auth/StatusCard';

export default function PendingApprovalPage() {
  const icon = (
    <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );

  return (
    <StatusCard
      icon={icon}
      title="Account Pending Approval"
      description="Your account is currently under review by our admin team."
      details={{
        title: "Please wait",
        items: [
          "Your application is being reviewed",
          "You will receive an email once approved",
          "Approval typically takes 1-2 business days",
          "You cannot access the dashboard until approved"
        ]
      }}
      actionButton={{
        text: "Back to Login",
        href: "/login",
        variant: "secondary"
      }}
      footerText="Check your email for updates on your application status"
    />
  );
}
