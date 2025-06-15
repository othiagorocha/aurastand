// src/features/tasks/hooks/use-task-filters.ts
"use client";

import { useState, useMemo } from "react";
import { Task, TaskStatus, TaskPriority, FilterStats } from "../types";

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
        if (task.project.id !== filters.projectId) return false;
      }

      // Filtro por workspace
      if (filters.workspaceId) {
        if (task.project.workspace.id !== filters.workspaceId) return false;
      }

      // Filtro por range de data
      if (filters.dueDateRange) {
        if (!task.dueDate) return false;

        if (filters.dueDateRange.start && task.dueDate < filters.dueDateRange.start) return false;
        if (filters.dueDateRange.end && task.dueDate > filters.dueDateRange.end) return false;
      }

      return true;
    });
  }, [tasks, filters]);

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

  const hasActiveFilters = Object.keys(filters).length > 0;

  const stats: FilterStats = useMemo(() => {
    return {
      total: tasks.length,
      filtered: filteredTasks.length,
      byStatus: {
        [TaskStatus.BACKLOG]: filteredTasks.filter((t) => t.status === TaskStatus.BACKLOG).length,
        [TaskStatus.TODO]: filteredTasks.filter((t) => t.status === TaskStatus.TODO).length,
        [TaskStatus.IN_PROGRESS]: filteredTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
        [TaskStatus.IN_REVIEW]: filteredTasks.filter((t) => t.status === TaskStatus.IN_REVIEW).length,
        [TaskStatus.DONE]: filteredTasks.filter((t) => t.status === TaskStatus.DONE).length,
      },
      byPriority: {
        [TaskPriority.LOW]: filteredTasks.filter((t) => t.priority === TaskPriority.LOW).length,
        [TaskPriority.MEDIUM]: filteredTasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
        [TaskPriority.HIGH]: filteredTasks.filter((t) => t.priority === TaskPriority.HIGH).length,
        [TaskPriority.URGENT]: filteredTasks.filter((t) => t.priority === TaskPriority.URGENT).length,
      },
    };
  }, [filteredTasks, tasks]);

  return {
    filteredTasks,
    filters,
    updateFilter,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    stats,
  };
}
