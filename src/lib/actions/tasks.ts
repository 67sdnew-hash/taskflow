'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  TaskQueryInput,
} from '@/lib/validations/task';
import { Database } from '@/types/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];

export interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completionRate: number;
  priorityDistribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    URGENT: number;
  };
}

export async function getTasks(queryParams?: Partial<TaskQueryInput>): Promise<{
  tasks: Task[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { tasks: [], error: 'Unauthorized.' };
    }

    const queryParamsParsed = taskQuerySchema.safeParse(queryParams || {});
    const { status, priority, search, sortBy, sortOrder } = queryParamsParsed.success
      ? queryParamsParsed.data
      : { sortBy: 'created_at' as const, sortOrder: 'desc' as const };

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { tasks: [], error: error.message };
    }

    return { tasks: data || [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
    return { tasks: [], error: message };
  }
}

export async function createTask(rawInput: unknown): Promise<{
  success: boolean;
  task?: Task;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required.' };
  }

  const validation = createTaskSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { title, description, status, priority, dueDate } = validation.data;

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      status,
      priority,
      due_date: dueDate || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/tasks');
  revalidatePath('/dashboard');
  return { success: true, task: data };
}

export async function updateTask(rawInput: unknown): Promise<{
  success: boolean;
  task?: Task;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required.' };
  }

  const validation = updateTaskSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { id, title, description, status, priority, dueDate } = validation.data;

  const updatePayload: Database['public']['Tables']['tasks']['Update'] = {};
  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (status !== undefined) updatePayload.status = status;
  if (priority !== undefined) updatePayload.priority = priority;
  if (dueDate !== undefined) updatePayload.due_date = dueDate;

  const { data, error } = await supabase
    .from('tasks')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/tasks');
  revalidatePath('/dashboard');
  return { success: true, task: data };
}

export async function deleteTask(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Authentication required.' };
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/tasks');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getAnalyticsSummary(): Promise<{
  analytics: AnalyticsSummary | null;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { analytics: null, error: 'Authentication required.' };
    }

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('status, priority')
      .eq('user_id', user.id);

    if (error) {
      return { analytics: null, error: error.message };
    }

    const taskList = tasks || [];
    const totalTasks = taskList.length;
    const completedTasks = taskList.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = taskList.filter((t) => t.status === 'IN_PROGRESS').length;
    const pendingTasks = taskList.filter((t) => t.status === 'TODO' || t.status === 'IN_REVIEW').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const priorityDistribution = {
      LOW: taskList.filter((t) => t.priority === 'LOW').length,
      MEDIUM: taskList.filter((t) => t.priority === 'MEDIUM').length,
      HIGH: taskList.filter((t) => t.priority === 'HIGH').length,
      URGENT: taskList.filter((t) => t.priority === 'URGENT').length,
    };

    return {
      analytics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completionRate,
        priorityDistribution,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to calculate analytics';
    return { analytics: null, error: message };
  }
}
