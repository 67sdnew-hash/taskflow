'use client';

import React, { useState } from 'react';
import { Database } from '@/types/database.types';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { Button } from '@/components/ui/button';
import { Plus, CheckSquare } from 'lucide-react';

type Task = Database['public']['Tables']['tasks']['Row'];

export function TaskClientView({ initialTasks }: { initialTasks: Task[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleOpenCreate} className="space-x-1.5">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </Button>
      </div>

      {initialTasks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-3">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No tasks found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Get started by creating your first task or clear your search and filters.
          </p>
          <Button onClick={handleOpenCreate} className="mt-4" size="sm">
            Create First Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleOpenEdit} />
          ))}
        </div>
      )}

      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
