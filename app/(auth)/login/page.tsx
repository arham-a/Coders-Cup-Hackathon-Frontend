import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to access your account">
      <LoginForm />
    </AuthCard>
  );
}
