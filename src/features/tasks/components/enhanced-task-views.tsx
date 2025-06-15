// src/features/tasks/components/enhanced-task-views.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, Calendar, Kanban, Plus, Filter, Eye, EyeOff } from "lucide-react";
import { TaskViewProps, Task } from "../types";
import { TableView } from "./table-view";
import { KanbanView } from "./kanban-view";
import { CalendarView } from "./calendar-view";
import { TaskFilters } from "./task-filters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useRouter } from "next/navigation";

interface EnhancedTaskViewsProps extends TaskViewProps {
  defaultView?: "table" | "kanban" | "calendar";
  showCreateButton?: boolean;
  projectId?: string;
  title?: string;
  description?: string;
}

export function EnhancedTaskViews({
  tasks,
  defaultView = "kanban",
  showCreateButton = true,
  projectId,
  title = "Tarefas",
  description = "Gerencie e visualize suas tarefas",
}: EnhancedTaskViewsProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [currentView, setCurrentView] = useState(defaultView);

  // Filtros e busca
  const { filteredTasks, filters, updateFilter, clearFilters, stats, hasActiveFilters } = useTaskFilters(tasks);

  // Handlers
  const handleTaskClick = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const handleCreateTask = () => {
    const url = projectId ? `/tasks/new?projectId=${projectId}` : "/tasks/new";
    router.push(url);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>{title}</h2>
          <p className='text-gray-600'>{description}</p>
        </div>

        <div className='flex items-center gap-3'>
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

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant='ghost' size='sm' onClick={clearFilters} className='text-red-600 hover:text-red-800'>
              Limpar Filtros
            </Button>
          )}

          {/* Create Task Button */}
          {showCreateButton && (
            <Button onClick={handleCreateTask}>
              <Plus className='h-4 w-4 mr-2' />
              Nova Tarefa
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className='bg-white rounded-lg shadow p-4'>
          <TaskFilters filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} stats={stats} />
        </div>
      )}

      {/* Estatísticas */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
          <div className='text-sm text-gray-600'>Total</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-blue-600'>{stats.byStatus.TODO || 0}</div>
          <div className='text-sm text-gray-600'>A Fazer</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-yellow-600'>{stats.byStatus.IN_PROGRESS || 0}</div>
          <div className='text-sm text-gray-600'>Em Progresso</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-purple-600'>{stats.byStatus.IN_REVIEW || 0}</div>
          <div className='text-sm text-gray-600'>Em Revisão</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-green-600'>{stats.byStatus.DONE || 0}</div>
          <div className='text-sm text-gray-600'>Concluídas</div>
        </div>
      </div>

      {/* Tabs de Visualização */}
      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as typeof currentView)}>
        <TabsList className='grid w-full grid-cols-3 lg:w-[400px]'>
          <TabsTrigger value='table' className='flex items-center gap-2'>
            <Table className='h-4 w-4' />
            Tabela
          </TabsTrigger>
          <TabsTrigger value='kanban' className='flex items-center gap-2'>
            <Kanban className='h-4 w-4' />
            Kanban
          </TabsTrigger>
          <TabsTrigger value='calendar' className='flex items-center gap-2'>
            <Calendar className='h-4 w-4' />
            Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value='table' className='mt-6'>
          <div className='bg-white rounded-lg shadow'>
            <TableView tasks={filteredTasks} onTaskClick={handleTaskClick} />
          </div>
        </TabsContent>

        <TabsContent value='kanban' className='mt-6'>
          <KanbanView tasks={filteredTasks} onTaskClick={handleTaskClick} />
        </TabsContent>

        <TabsContent value='calendar' className='mt-6'>
          <div className='bg-white rounded-lg shadow'>
            <CalendarView tasks={filteredTasks} onTaskClick={handleTaskClick} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
