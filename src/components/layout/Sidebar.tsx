'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Task Management', icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">TaskFlow</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">TaskFlow Production</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Real-time sync enabled</p>
        </div>
      </div>
    </aside>
  );
}
