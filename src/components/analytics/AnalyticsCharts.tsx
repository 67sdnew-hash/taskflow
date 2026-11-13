'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { AnalyticsSummary } from '@/lib/actions/tasks';

const PRIORITY_COLORS = {
  LOW: '#94a3b8',
  MEDIUM: '#3b82f6',
  HIGH: '#f97316',
  URGENT: '#ef4444',
};

export function AnalyticsCharts({ analytics }: { analytics: AnalyticsSummary }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="h-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
        <div className="h-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
      </div>
    );
  }

  const priorityData = [
    { name: 'Low', count: analytics.priorityDistribution.LOW, color: PRIORITY_COLORS.LOW },
    { name: 'Medium', count: analytics.priorityDistribution.MEDIUM, color: PRIORITY_COLORS.MEDIUM },
    { name: 'High', count: analytics.priorityDistribution.HIGH, color: PRIORITY_COLORS.HIGH },
    { name: 'Urgent', count: analytics.priorityDistribution.URGENT, color: PRIORITY_COLORS.URGENT },
  ];

  const statusData = [
    { name: 'Completed', value: analytics.completedTasks, fill: '#10b981' },
    { name: 'In Progress', value: analytics.inProgressTasks, fill: '#3b82f6' },
    { name: 'Pending', value: analytics.pendingTasks, fill: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Status Breakdown Pie */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Task Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Bar Chart */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Tasks by Priority Level</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
