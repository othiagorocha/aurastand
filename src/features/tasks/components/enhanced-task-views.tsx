// src/features/tasks/components/enhanced-task-views.tsx
"use client";

import { useState } from "react";
import { TaskViews } from "./task-views";
import { TaskFilters } from "./task-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { Button } from "@/components/ui/button";
import { Task } from "../types";
import { Plus, Filter, Eye, EyeOff, Grid, List, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

// ✅ Interface corrigida para aceitar 'tasks' diretamente
interface EnhancedTaskViewsProps {
  tasks: Task[]; // ✅ Mudança: 'tasks' ao invés de 'initialTasks'
  showCreateButton?: boolean;
  projectId?: string;
  workspaceId?: string;
  title?: string;
  description?: string;
}

export function EnhancedTaskViews({
  tasks, // ✅ Mudança: recebe 'tasks' diretamente
  showCreateButton = true,
  projectId,
  // workspaceId,
  title,
  description,
}: EnhancedTaskViewsProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedView, setSelectedView] = useState<"table" | "kanban" | "calendar">("kanban");

  // ✅ Hook para gerenciar filtros - agora usa 'tasks' diretamente
  const { filteredTasks, filters, updateFilter, clearFilters, stats, hasActiveFilters } = useTaskFilters(tasks);

  // Handlers para interações
  const handleTaskClick = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const handleNewTask = () => {
    const url = projectId ? `/tasks/new?projectId=${projectId}` : "/tasks/new";
    router.push(url);
  };

  const viewOptions = [
    { value: "table" as const, label: "Tabela", icon: List },
    { value: "kanban" as const, label: "Kanban", icon: Grid },
    { value: "calendar" as const, label: "Calendário", icon: Calendar },
  ];

  return (
    <div className='space-y-6'>
      {/* Header com título dinâmico */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
        <div className='flex items-center gap-4'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              {title || (projectId ? "Tarefas do Projeto" : "Todas as Tarefas")}
            </h2>
            {description && <p className='text-gray-600 mt-1'>{description}</p>}
          </div>

          {/* Toggle de filtros */}
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

          {/* Indicador de filtros ativos */}
          {hasActiveFilters && !showFilters && (
            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
              Filtros ativos
            </span>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {/* Seletor de visualização */}
          <div className='flex rounded-lg border border-gray-200 p-1'>
            {viewOptions.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant='ghost'
                size='sm'
                onClick={() => setSelectedView(value)}
                className={`flex items-center gap-2 ${
                  selectedView === value ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}>
                <Icon className='h-4 w-4' />
                {label}
              </Button>
            ))}
          </div>

          {/* Botão de nova tarefa */}
          {showCreateButton && (
            <Button onClick={handleNewTask} className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              Nova Tarefa
            </Button>
          )}
        </div>
      </div>

      {/* Painel de filtros (condicional) */}
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

      {/* Estatísticas rápidas */}
      {filteredTasks.length !== tasks.length && (
        <div className='flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-blue-700'>
              Mostrando {filteredTasks.length} de {tasks.length} tarefas
            </span>
            {hasActiveFilters && (
              <Button variant='link' size='sm' onClick={clearFilters} className='text-blue-600 hover:text-blue-800 p-0 h-auto'>
                Limpar filtros
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Visualizações de tarefas */}
      <TaskViews tasks={filteredTasks} defaultView={selectedView} onTaskClick={handleTaskClick} />

      {/* Estado vazio */}
      {tasks.length === 0 && (
        <div className='text-center py-16 bg-gray-50 rounded-lg'>
          <div className='max-w-md mx-auto'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Plus className='h-8 w-8 text-blue-600' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Nenhuma tarefa ainda</h3>
            <p className='text-gray-600 mb-6'>
              {projectId ? "Comece criando a primeira tarefa para este projeto." : "Comece criando sua primeira tarefa."}
            </p>
            {showCreateButton && (
              <Button onClick={handleNewTask} size='lg'>
                <Plus className='h-5 w-5 mr-2' />
                Criar Primeira Tarefa
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Estado vazio filtrado */}
      {tasks.length > 0 && filteredTasks.length === 0 && hasActiveFilters && (
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
