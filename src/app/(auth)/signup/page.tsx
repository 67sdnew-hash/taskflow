import { SignupForm } from '@/components/auth/SignupForm';

export const metadata = {
  title: 'Create Account — TaskFlow',
};

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <SignupForm />
    </div>
  );
}
