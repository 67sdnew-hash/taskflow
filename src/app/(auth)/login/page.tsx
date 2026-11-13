import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In — TaskFlow',
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
