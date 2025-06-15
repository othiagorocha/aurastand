// src/features/tasks/types/index.ts

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BACKLOG"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date; // Adicionado para corresponder ao schema do Prisma
  project: {
    name: string;
    workspace: {
      name: string;
    };
  };
}

export interface TaskViewProps {
  tasks: Task[];
}

export interface StatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>; // Lucide icon component
}

export interface PriorityConfig {
  label: string;
  color: string;
}
