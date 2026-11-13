'use client';

import React, { useTransition } from 'react';
import { Database } from '@/types/database.types';
import { deleteTask } from '@/lib/actions/tasks';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Calendar, Trash2, Edit2 } from 'lucide-react';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      startTransition(async () => {
        await deleteTask(task.id);
      });
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-2">{task.title}</h4>
        {task.description && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{task.description}</p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{formatDate(task.due_date)}</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
