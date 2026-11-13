import { z } from 'zod';

export const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED']);
export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Task title is required.' })
    .max(255, { message: 'Task title cannot exceed 255 characters.' }),
  description: z.string().trim().max(2000, { message: 'Description cannot exceed 2000 characters.' }).optional().nullable(),
  status: taskStatusEnum.default('TODO'),
  priority: taskPriorityEnum.default('MEDIUM'),
  dueDate: z
    .string()
    .datetime({ message: 'Due date must be a valid ISO timestamp.' })
    .optional()
    .nullable(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  id: z.string().uuid({ message: 'Invalid task ID.' }),
});

export const taskQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(['created_at', 'due_date', 'priority', 'title']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
