import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthCard title="Create Account" subtitle="Register for a microfinance loan account">
      <RegisterForm />
    </AuthCard>
  );
}
