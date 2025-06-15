// src/features/tasks/hooks/use-task-filters.ts
"use client";

import { useState, useMemo } from "react";
import { Task, TaskStatus, TaskPriority } from "../types";

// Tipos mais específicos para os filtros
interface FilterOptions {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  searchTerm?: string;
  projectId?: string;
  workspaceId?: string;
  dueDateRange?: {
    start?: Date;
    end?: Date;
  };
}

// Tipo para as chaves dos filtros que podem ser atualizadas
type FilterKey = keyof FilterOptions;

// Tipo para os valores que cada filtro pode receber
type FilterValue<K extends FilterKey> = K extends "status"
  ? TaskStatus[]
  : K extends "priority"
  ? TaskPriority[]
  : K extends "searchTerm" | "projectId" | "workspaceId"
  ? string
  : K extends "dueDateRange"
  ? { start?: Date; end?: Date }
  : never;

// Tipo para as estatísticas dos filtros
interface FilterStats {
  total: number;
  filtered: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
}

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<FilterOptions>({});

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filtro por status
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(task.status)) return false;
      }

      // Filtro por prioridade
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) return false;
      }

      // Filtro por termo de busca
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(searchLower);
        const descriptionMatch = task.description?.toLowerCase().includes(searchLower);
        const projectMatch = task.project.name.toLowerCase().includes(searchLower);

        if (!titleMatch && !descriptionMatch && !projectMatch) return false;
      }

      // Filtro por projeto
      if (filters.projectId) {
        // Assumindo que você tenha o projectId na task
        // if (task.projectId !== filters.projectId) return false;
      }

      // Filtro por workspace
      if (filters.workspaceId) {
        // Assumindo que você tenha o workspaceId na task
        // if (task.project.workspaceId !== filters.workspaceId) return false;
      }

      // Filtro por range de data
      if (filters.dueDateRange) {
        if (!task.dueDate) return false;

        if (filters.dueDateRange.start && task.dueDate < filters.dueDateRange.start) {
          return false;
        }

        if (filters.dueDateRange.end && task.dueDate > filters.dueDateRange.end) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  // Função tipada corretamente para atualizar filtros
  const updateFilter = <K extends FilterKey>(key: K, value: FilterValue<K>) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const clearFilter = (key: FilterKey) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  // Estatísticas dos filtros
  const stats: FilterStats = useMemo(
    () => ({
      total: tasks.length,
      filtered: filteredTasks.length,
      byStatus: {
        TODO: filteredTasks.filter((t) => t.status === "TODO").length,
        IN_PROGRESS: filteredTasks.filter((t) => t.status === "IN_PROGRESS").length,
        IN_REVIEW: filteredTasks.filter((t) => t.status === "IN_REVIEW").length,
        DONE: filteredTasks.filter((t) => t.status === "DONE").length,
      },
      byPriority: {
        LOW: filteredTasks.filter((t) => t.priority === "LOW").length,
        MEDIUM: filteredTasks.filter((t) => t.priority === "MEDIUM").length,
        HIGH: filteredTasks.filter((t) => t.priority === "HIGH").length,
        URGENT: filteredTasks.filter((t) => t.priority === "URGENT").length,
      },
    }),
    [tasks, filteredTasks]
  );

  return {
    filteredTasks,
    filters,
    updateFilter,
    clearFilters,
    clearFilter,
    stats,
    hasActiveFilters: Object.keys(filters).length > 0,
  };
}

// Tipos para ordenação - chaves que podem ser ordenadas
type SortableTaskKeys = "id" | "title" | "description" | "status" | "priority" | "dueDate" | "createdAt" | "updatedAt";
type SortableNestedKeys = "project.name" | "project.workspace.name";
type SortKey = SortableTaskKeys | SortableNestedKeys;

interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

// Tipo para valores que podem ser comparados
type ComparableValue = string | number | Date | boolean | null | undefined;

// Função auxiliar para extrair valor para comparação
function extractComparableValue(task: Task, key: SortKey): ComparableValue {
  switch (key) {
    case "project.name":
      return task.project.name;
    case "project.workspace.name":
      return task.project.workspace.name;
    case "id":
      return task.id;
    case "title":
      return task.title;
    case "description":
      return task.description;
    case "status":
      return task.status;
    case "priority":
      return task.priority;
    case "dueDate":
      return task.dueDate;
    case "createdAt":
      return task.createdAt;
    case "updatedAt":
      return task.updatedAt;
    default:
      return null;
  }
}

// Hook para ordenação
export function useTaskSorting(tasks: Task[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedTasks = useMemo(() => {
    if (!sortConfig) return tasks;

    return [...tasks].sort((a, b) => {
      const aValue = extractComparableValue(a, sortConfig.key);
      const bValue = extractComparableValue(b, sortConfig.key);

      // Lidar com valores null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
      if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

      // Lidar com datas
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === "asc" ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }

      // Lidar com strings
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      // Lidar com números
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Lidar com booleanos
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        const aNum = aValue ? 1 : 0;
        const bNum = bValue ? 1 : 0;
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Fallback para tipos mistos - converter para string
      const aStr = String(aValue);
      const bStr = String(bValue);
      return sortConfig.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [tasks, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  return {
    sortedTasks,
    sortConfig,
    requestSort,
  };
}

// Funções auxiliares para usar com os filtros
export const createFilterHelpers = () => {
  return {
    // Helper para criar filtros de status
    createStatusFilter: (statuses: TaskStatus[]) => ({
      status: statuses,
    }),

    // Helper para criar filtros de prioridade
    createPriorityFilter: (priorities: TaskPriority[]) => ({
      priority: priorities,
    }),

    // Helper para criar filtro de busca
    createSearchFilter: (searchTerm: string) => ({
      searchTerm,
    }),

    // Helper para criar filtro de data
    createDateRangeFilter: (start?: Date, end?: Date) => ({
      dueDateRange: { start, end },
    }),
  };
};

// Type guards para verificação de tipos
export const isValidTaskStatus = (status: string): status is TaskStatus => {
  return ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].includes(status);
};

export const isValidTaskPriority = (priority: string): priority is TaskPriority => {
  return ["LOW", "MEDIUM", "HIGH", "URGENT"].includes(priority);
};
