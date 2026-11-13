'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, signupSchema } from '@/lib/validations/auth';

export type ActionResponse<T = null> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export async function signInWithEmail(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect('/dashboard');
}

export async function signUpWithEmail(formData: FormData): Promise<ActionResponse> {
  const rawData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const validation = signupSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const headerList = await headers();
  const host = headerList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const { error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        full_name: validation.data.fullName,
      },
      emailRedirectTo: `${protocol}://${host}/api/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Verification email sent. Please check your inbox to confirm your account.',
  };
}

export async function signInWithOAuth(provider: 'google') {
  const supabase = await createClient();
  const headerList = await headers();
  const host = headerList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${protocol}://${host}/api/auth/callback`,
    },
  });

  if (error || !data.url) {
    throw new Error(error?.message || 'Could not initialize OAuth flow.');
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
