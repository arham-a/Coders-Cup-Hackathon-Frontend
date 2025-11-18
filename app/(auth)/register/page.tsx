import { AuthCard } from '@/components/auth/AuthCard';
import { RegistrationFlow } from '@/components/auth/RegistrationFlow';

export default function RegisterPage() {
  return (
    <AuthCard title="Create Account" subtitle="Register for a microfinance loan account">
      <RegistrationFlow />
    </AuthCard>
  );
}
