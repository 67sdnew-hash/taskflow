import React from 'react';
import { getTasks } from '@/lib/actions/tasks';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskClientView } from '@/components/tasks/TaskClientView';
import { TaskStatus, TaskPriority } from '@/types/database.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Tasks — TaskFlow',
};

interface TasksPageProps {
  searchParams: Promise<{
    status?: TaskStatus;
    priority?: TaskPriority;
    search?: string;
  }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const { tasks } = await getTasks({
    status: params.status,
    priority: params.priority,
    search: params.search,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Task Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Organize, filter, and track project tasks</p>
        </div>
      </div>

      <TaskFilters />
      <TaskClientView initialTasks={tasks} />
    </div>
  );
}
