'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { signInWithEmail } from '@/lib/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OAuthButtons } from '@/components/auth/OAuthButtons';

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const response = await signInWithEmail(formData);
      if (response && !response.success) {
        if (response.errors) {
          setFieldErrors(response.errors);
        } else if (response.message) {
          setFormError(response.message);
        }
      }
    });
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your TaskFlow account</p>
      </div>

      <OAuthButtons />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or continue with email</span>
        </div>
      </div>

      {formError && (
        <div className="p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-sm text-red-600 dark:text-red-400">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Email Address
          </label>
          <Input
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
            error={fieldErrors.email?.[0]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Password
          </label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            error={fieldErrors.password?.[0]}
          />
        </div>

        <Button type="submit" className="w-full h-11" isLoading={isPending}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </div>
    </div>
  );
}
