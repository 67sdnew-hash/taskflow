import React from 'react';
import { getAnalyticsSummary } from '@/lib/actions/tasks';
import { MetricCard } from '@/components/analytics/MetricCard';
import { AnalyticsCharts } from '@/components/analytics/AnalyticsCharts';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Dashboard — TaskFlow',
};

export default async function DashboardPage() {
  const { analytics } = await getAnalyticsSummary();

  const metrics = analytics || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completionRate: 0,
    priorityDistribution: { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Real-time team throughput and metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tasks"
          value={metrics.totalTasks}
          subtitle="All active and completed items"
          icon={ListTodo}
        />
        <MetricCard
          title="Completed"
          value={metrics.completedTasks}
          subtitle="Successfully closed tasks"
          icon={CheckCircle2}
        />
        <MetricCard
          title="In Progress"
          value={metrics.inProgressTasks}
          subtitle="Currently active tasks"
          icon={Clock}
        />
        <MetricCard
          title="Completion Rate"
          value={`${metrics.completionRate}%`}
          subtitle="Overall workflow velocity"
          icon={TrendingUp}
          trend={metrics.completionRate > 50 ? 'Strong pace' : undefined}
        />
      </div>

      <AnalyticsCharts analytics={metrics} />
    </div>
  );
}
