// src/features/tasks/types/enhanced.ts
// Tipos aprimorados para complementar o sistema de filtros

import { Task, TaskStatus, TaskPriority } from "./index";

// Tipos para queries de filtros mais específicos
export interface TaskFilterQuery {
  statuses?: TaskStatus[];
  priorities?: TaskPriority[];
  search?: string;
  projectId?: string;
  workspaceId?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Tipo para resultado de filtros com metadados
export interface FilteredTasksResult {
  tasks: Task[];
  totalCount: number;
  filteredCount: number;
  appliedFilters: TaskFilterQuery;
  pagination?: {
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos para ordenação avançada
export interface TaskSortOptions {
  field:
    | "id"
    | "title"
    | "description"
    | "status"
    | "priority"
    | "dueDate"
    | "createdAt"
    | "updatedAt"
    | "project.name"
    | "project.workspace.name";
  direction: "asc" | "desc";
  nullsFirst?: boolean;
}

// Interface para configuração de visualização de tasks
export interface TaskViewConfig {
  type: "table" | "kanban" | "calendar" | "list";
  groupBy?: "status" | "priority" | "project" | "assignee";
  sortBy?: TaskSortOptions;
  showCompleted?: boolean;
  showArchived?: boolean;
  columnsVisible?: string[];
}

// Tipos para agregações e estatísticas
export interface TaskAggregations {
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  byProject: Record<string, number>;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  completedThisWeek: number;
  averageCompletionTime?: number; // em dias
}

// Tipo para task com dados computados
export interface TaskWithMetadata extends Task {
  isOverdue: boolean;
  isDueToday: boolean;
  isDueThisWeek: boolean;
  daysSinceCreated: number;
  daysUntilDue?: number;
  projectProgress?: number;
}

// Tipos para filtros presets
export type TaskFilterPreset =
  | "my-tasks"
  | "overdue"
  | "due-today"
  | "due-this-week"
  | "high-priority"
  | "in-progress"
  | "recently-completed";

export interface TaskFilterPresetConfig {
  id: TaskFilterPreset;
  name: string;
  description: string;
  filter: TaskFilterQuery;
  sort?: TaskSortOptions;
}

// Tipos para bulk operations
export interface TaskBulkOperation {
  type: "update-status" | "update-priority" | "assign-project" | "delete";
  taskIds: string[];
  data?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId?: string;
  };
}

// Tipo para resultado de bulk operations
export interface TaskBulkOperationResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors?: Array<{
    taskId: string;
    error: string;
  }>;
}

// Utilitários de tipo para validação
export type TaskUpdateFields = Partial<Omit<Task, "id" | "createdAt" | "project">>;

export interface TaskValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Tipos para hooks personalizados
export interface UseTaskFiltersReturn {
  filteredTasks: Task[];
  filters: TaskFilterQuery;
  updateFilter: <K extends keyof TaskFilterQuery>(key: K, value: TaskFilterQuery[K]) => void;
  clearFilters: () => void;
  clearFilter: (key: keyof TaskFilterQuery) => void;
  stats: TaskAggregations;
  hasActiveFilters: boolean;
  applyPreset: (preset: TaskFilterPreset) => void;
}

export interface UseTaskSortingReturn {
  sortedTasks: Task[];
  sortConfig: TaskSortOptions | null;
  requestSort: (field: TaskSortOptions["field"]) => void;
  clearSort: () => void;
}

// Constantes tipadas para uso nos componentes
export const TASK_FILTER_PRESETS: Record<TaskFilterPreset, TaskFilterPresetConfig> = {
  "my-tasks": {
    id: "my-tasks",
    name: "Minhas Tarefas",
    description: "Tarefas atribuídas a mim",
    filter: {},
  },
  overdue: {
    id: "overdue",
    name: "Atrasadas",
    description: "Tarefas com prazo vencido",
    filter: {},
    sort: { field: "dueDate", direction: "asc" },
  },
  "due-today": {
    id: "due-today",
    name: "Vence Hoje",
    description: "Tarefas que vencem hoje",
    filter: {},
    sort: { field: "priority", direction: "desc" },
  },
  "due-this-week": {
    id: "due-this-week",
    name: "Vence esta Semana",
    description: "Tarefas que vencem nos próximos 7 dias",
    filter: {},
    sort: { field: "dueDate", direction: "asc" },
  },
  "high-priority": {
    id: "high-priority",
    name: "Alta Prioridade",
    description: "Tarefas com prioridade alta ou urgente",
    filter: {
      priorities: ["HIGH", "URGENT"],
    },
    sort: { field: "priority", direction: "desc" },
  },
  "in-progress": {
    id: "in-progress",
    name: "Em Andamento",
    description: "Tarefas sendo trabalhadas",
    filter: {
      statuses: ["IN_PROGRESS"],
    },
  },
  "recently-completed": {
    id: "recently-completed",
    name: "Concluídas Recentemente",
    description: "Tarefas concluídas nos últimos 7 dias",
    filter: {
      statuses: ["DONE"],
    },
    sort: { field: "updatedAt", direction: "desc" },
  },
} as const;
