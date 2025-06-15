// src/features/tasks/types/index.ts

// Enums baseados no Prisma schema
export const TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
  BACKLOG: "BACKLOG", // Adicionando BACKLOG para compatibilidade com componentes kanban
} as const;

export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

// Interface extendida da Task para incluir propriedades necessárias para os componentes
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  userId: string;
  assigneeId: string | null;

  // Propriedades adicionais para compatibilidade com componentes kanban/calendar
  $id?: string; // Para compatibilidade com sistema antigo
  position?: number; // Para ordenação no kanban

  // Relacionamentos
  project: {
    id: string;
    name: string;
    workspace: {
      id: string;
      name: string;
    };
  };

  // Assignee opcional (pode ser null)
  assignee?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

// Estado das tarefas para o Kanban
export interface TasksState {
  [TaskStatus.BACKLOG]: Task[];
  [TaskStatus.TODO]: Task[];
  [TaskStatus.IN_PROGRESS]: Task[];
  [TaskStatus.IN_REVIEW]: Task[];
  [TaskStatus.DONE]: Task[];
}

export interface TaskViewProps {
  tasks: Task[];
}

export interface StatusConfig {
  label: string;
  color: string;
  textColor: string;
  bgColor: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface PriorityConfig {
  label: string;
  color: string;
}

// Estatísticas para filtros
export interface FilterStats {
  total: number;
  filtered: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
}
