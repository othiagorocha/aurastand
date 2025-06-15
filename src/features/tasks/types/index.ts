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

// Interface extendida da Task compatível com retorno do Prisma
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

  // Relacionamentos - compatível com queries Prisma
  project: {
    id: string;
    name: string;
    workspace: {
      id: string;
      name: string;
    };
  };

  // Assignee opcional (compatível com Prisma que pode retornar name como null)
  assignee?: {
    id: string;
    name: string | null; // ✅ Agora aceita null
    email: string;
  } | null;

  // Relacionamento com user (criador da tarefa)
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}

// Tipo para queries básicas onde não precisamos de todos os relacionamentos
export interface TaskBasic {
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
  position?: number;
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

// Função utilitária para garantir que assignee.name seja sempre string nos componentes
export function getAssigneeName(assignee: Task["assignee"]): string {
  if (!assignee) return "Não atribuído";
  return assignee.name || assignee.email.split("@")[0] || "Usuário";
}

// Função utilitária para garantir que user.name seja sempre string nos componentes
export function getUserName(user: Task["user"]): string {
  if (!user) return "Usuário desconhecido";
  return user.name || user.email.split("@")[0] || "Usuário";
}
