// src/app/(dashboard)/tasks/complete/complete-tasks-client.tsx
"use client";

import { useState } from "react";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { Task } from "@/features/tasks/types";
import { TaskBoardView } from "@/features/tasks/components/task-board-view";

interface CompleteTasksClientProps {
  initialTasks: Task[];
}

export function CompleteTasksClient({ initialTasks }: CompleteTasksClientProps) {
  const { filteredTasks, filters, updateFilter, clearFilters, stats, hasActiveFilters } = useTaskFilters(initialTasks);

  return (
    <div className='space-y-6'>
      {/* Filtros com todas as propriedades necessárias */}
      <TaskFilters
        searchTerm={filters.searchTerm}
        onSearchChange={(term) => updateFilter("searchTerm", term)}
        selectedStatuses={filters.status}
        onStatusChange={(statuses) => updateFilter("status", statuses)}
        selectedPriorities={filters.priority}
        onPriorityChange={(priorities) => updateFilter("priority", priorities)}
        dueDateRange={filters.dueDateRange}
        onDateRangeChange={(range) => updateFilter("dueDateRange", range)}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        stats={stats}
      />

      {/* Board de Tarefas */}
      <TaskBoardView tasks={filteredTasks} />
    </div>
  );
}
