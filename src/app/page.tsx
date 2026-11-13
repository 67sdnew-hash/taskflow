import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, BarChart3, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:py-32 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 border border-indigo-200 dark:border-indigo-800">
            <Zap className="h-3.5 w-3.5" />
            <span>Next.js App Router + Supabase + Tailwind</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
            High-Velocity Task Management <br className="hidden sm:inline" />
            <span className="text-indigo-600">Built for Agile Teams</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            TaskFlow combines real-time PostgreSQL synchronization, strict row-level security, and intuitive analytics to keep your engineering and product teams aligned.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In to Workspace
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-indigo-600 rounded-xl text-white inline-block mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-Time Task Tracking</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Organize, prioritize, and update tasks with instant database reflection and zero latency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-indigo-600 rounded-xl text-white inline-block mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Row-Level Security</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Data is isolated and guarded at the PostgreSQL engine level, ensuring only authorized team members see records.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-indigo-600 rounded-xl text-white inline-block mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Actionable Analytics</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Visualize team velocity, status breakdown, and priority distributions with interactive Recharts.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        TaskFlow Production Release • Built with Next.js & Supabase
      </footer>
    </div>
  );
}
