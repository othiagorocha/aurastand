// src/app/(dashboard)/projects/[id]/project-tasks-client.tsx (CLIENT COMPONENT)
"use client";

import { useState } from "react";
import { TaskViews } from "@/features/tasks/components/task-views";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { Button } from "@/components/ui/button";
import { Task } from "@/features/tasks/types";
import { Plus, Filter, Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectTasksClientProps {
  initialTasks: Task[];
  projectId: string;
  projectName: string;
}

export function ProjectTasksClient({ initialTasks, projectId, projectName }: ProjectTasksClientProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedView, setSelectedView] = useState<"table" | "kanban" | "calendar">("kanban");

  // ✅ Client-side filtering and state management
  const { filteredTasks, filters, updateFilter, clearFilters, stats, hasActiveFilters } = useTaskFilters(initialTasks);

  // ✅ Client-side event handlers
  const handleTaskClick = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const handleNewTask = () => {
    router.push(`/tasks/new?projectId=${projectId}`);
  };

  return (
    <div className='space-y-6'>
      {/* Task Section Header */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
        <div className='flex items-center gap-4'>
          <h2 className='text-2xl font-bold text-gray-900'>Tarefas do Projeto</h2>

          {/* Filter Toggle */}
          <Button variant='outline' size='sm' onClick={() => setShowFilters(!showFilters)} className='flex items-center gap-2'>
            <Filter className='h-4 w-4' />
            {showFilters ? (
              <>
                <EyeOff className='h-4 w-4' />
                Ocultar Filtros
              </>
            ) : (
              <>
                <Eye className='h-4 w-4' />
                Mostrar Filtros
              </>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant='ghost' size='sm' onClick={clearFilters} className='text-red-600 hover:text-red-800'>
              Limpar Filtros
            </Button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {/* View Selector */}
          <div className='flex items-center bg-gray-100 rounded-lg p-1'>
            {[
              { view: "table", label: "Tabela" },
              { view: "kanban", label: "Kanban" },
              { view: "calendar", label: "Calendário" },
            ].map(({ view, label }) => (
              <button
                key={view}
                onClick={() => setSelectedView(view as typeof selectedView)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedView === view ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}>
                {label}
              </button>
            ))}
          </div>

          <Button onClick={handleNewTask} className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Conditional Filters */}
      {showFilters && (
        <div className='bg-gray-50 rounded-lg p-4'>
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
        </div>
      )}

      {/* Task Views */}
      <TaskViews tasks={filteredTasks} defaultView={selectedView} onTaskClick={handleTaskClick} />

      {/* Empty State for Project */}
      {initialTasks.length === 0 && (
        <div className='text-center py-16 bg-gray-50 rounded-lg'>
          <div className='max-w-md mx-auto'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Plus className='h-8 w-8 text-blue-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Nenhuma tarefa ainda</h3>
            <p className='text-gray-600 mb-6'>Comece criando a primeira tarefa para o projeto &quot;{projectName}&quot;.</p>
            <Button onClick={handleNewTask} size='lg'>
              <Plus className='h-5 w-5 mr-2' />
              Criar Primeira Tarefa
            </Button>
          </div>
        </div>
      )}

      {/* Empty Filtered State */}
      {initialTasks.length > 0 && filteredTasks.length === 0 && hasActiveFilters && (
        <div className='text-center py-12 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Nenhuma tarefa encontrada</h3>
          <p className='text-gray-600 mb-4'>Tente ajustar os filtros para encontrar as tarefas que você procura.</p>
          <Button onClick={clearFilters} variant='outline'>
            Limpar todos os filtros
          </Button>
        </div>
      )}
    </div>
  );
}
