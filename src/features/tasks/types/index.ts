// src/features/tasks/types/index.ts

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
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

export type TaskStatus = Task["status"];
export type TaskPriority = Task["priority"];

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
