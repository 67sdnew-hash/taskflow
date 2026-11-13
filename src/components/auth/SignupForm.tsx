'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { signUpWithEmail } from '@/lib/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const response = await signUpWithEmail(formData);
      if (!response.success) {
        if (response.errors) {
          setFieldErrors(response.errors);
        } else if (response.message) {
          setFeedback({ type: 'error', message: response.message });
        }
      } else if (response.message) {
        setFeedback({ type: 'success', message: response.message });
      }
    });
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start collaborating with TaskFlow today</p>
      </div>

      <OAuthButtons />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or register with email</span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/50 dark:text-red-400'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Full Name
          </label>
          <Input name="fullName" placeholder="Sarah Connor" required error={fieldErrors.fullName?.[0]} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Email Address
          </label>
          <Input name="email" type="email" placeholder="sarah@skynet.com" required error={fieldErrors.email?.[0]} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Password (Min 8 chars, 1 uppercase, 1 number)
          </label>
          <Input name="password" type="password" placeholder="••••••••" required error={fieldErrors.password?.[0]} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Confirm Password
          </label>
          <Input name="confirmPassword" type="password" placeholder="••••••••" required error={fieldErrors.confirmPassword?.[0]} />
        </div>

        <Button type="submit" className="w-full h-11" isLoading={isPending}>
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </div>
    </div>
  );
}
