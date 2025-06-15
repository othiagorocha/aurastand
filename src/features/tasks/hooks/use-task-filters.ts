// src/features/tasks/hooks/use-task-filters.ts
"use client";

import { useState, useMemo } from "react";
import { Task, TaskStatus, TaskPriority } from "../types";

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

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const clearFilter = (key: keyof FilterOptions) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  // Estatísticas dos filtros
  const stats = useMemo(
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

// Hook para ordenação
export function useTaskSorting(tasks: Task[]) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Task | "project.name" | "project.workspace.name";
    direction: "asc" | "desc";
  } | null>(null);

  const sortedTasks = useMemo(() => {
    if (!sortConfig) return tasks;

    return [...tasks].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Lidar com propriedades aninhadas
      if (sortConfig.key === "project.name") {
        aValue = a.project.name;
        bValue = b.project.name;
      } else if (sortConfig.key === "project.workspace.name") {
        aValue = a.project.workspace.name;
        bValue = b.project.workspace.name;
      } else {
        aValue = a[sortConfig.key as keyof Task];
        bValue = b[sortConfig.key as keyof Task];
      }

      // Lidar com datas
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === "asc" ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }

      // Lidar com strings
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      // Fallback
      return 0;
    });
  }, [tasks, sortConfig]);

  const requestSort = (key: typeof sortConfig.key) => {
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
