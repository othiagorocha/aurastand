// src/app/(dashboard)/tasks/complete/page.tsx
"use client";

import { useState } from "react";
import { TaskViews } from "@/features/tasks/components/task-views";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Task } from "@/features/tasks/types";

interface CompleteTasksPageProps {
  initialTasks: Task[]; // Recebido via props ou server component
}

export default function CompleteTasksPage({ initialTasks }: CompleteTasksPageProps) {
  const { filteredTasks, filters, updateFilter, clearFilters, stats, hasActiveFilters } = useTaskFilters(initialTasks);

  const [selectedView, setSelectedView] = useState<"table" | "kanban" | "calendar">("kanban");

  const handleTaskClick = (task: Task) => {
    // Implementar navegação ou modal de detalhes
    console.log("Tarefa selecionada:", task);
    // router.push(`/tasks/${task.id}`);
    // ou abrir modal
  };

  return (
    <div className='space-y-6'>
      {/* Cabeçalho */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Tarefas</h1>
          <p className='text-gray-600'>Gerencie e visualize suas tarefas de forma eficiente</p>
        </div>
        <Button asChild>
          <Link href='/tasks/new' className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Nova Tarefa
          </Link>
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
          <div className='text-sm text-gray-600'>Total</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-gray-600'>{stats.byStatus.TODO}</div>
          <div className='text-sm text-gray-600'>A fazer</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-blue-600'>{stats.byStatus.IN_PROGRESS}</div>
          <div className='text-sm text-gray-600'>Em andamento</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-yellow-600'>{stats.byStatus.IN_REVIEW}</div>
          <div className='text-sm text-gray-600'>Em revisão</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-green-600'>{stats.byStatus.DONE}</div>
          <div className='text-sm text-gray-600'>Concluídas</div>
        </div>
      </div>

      {/* Layout Principal */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Sidebar com Filtros */}
        <div className='lg:col-span-1'>
          <TaskFilters
            searchTerm={filters.searchTerm}
            onSearchChange={(term) => updateFilter("searchTerm", term)}
            selectedStatuses={filters.status || []}
            onStatusChange={(statuses) => updateFilter("status", statuses)}
            selectedPriorities={filters.priority || []}
            onPriorityChange={(priorities) => updateFilter("priority", priorities)}
            dueDateRange={filters.dueDateRange}
            onDateRangeChange={(range) => updateFilter("dueDateRange", range)}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            stats={stats}
          />
        </div>

        {/* Conteúdo Principal - Visualizações */}
        <div className='lg:col-span-3'>
          <TaskViews tasks={filteredTasks} defaultView={selectedView} onTaskClick={handleTaskClick} />
        </div>
      </div>

      {/* Resultados Vazios */}
      {filteredTasks.length === 0 && hasActiveFilters && (
        <div className='text-center py-12 bg-gray-50 rounded-lg'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Nenhuma tarefa encontrada</h3>
          <p className='text-gray-600 mb-4'>Tente ajustar os filtros para encontrar o que você procura.</p>
          <Button onClick={clearFilters} variant='outline'>
            Limpar todos os filtros
          </Button>
        </div>
      )}
    </div>
  );
}

// Exemplo de como usar em um Server Component
// src/app/(dashboard)/tasks/complete/page.tsx (versão server)
/*
import { getAllTasks } from "@/actions/task-actions";
import CompleteTasksPage from "./complete-tasks-page";

export default async function TasksCompletePage() {
  const tasks = await getAllTasks();
  
  return <CompleteTasksPage initialTasks={tasks} />;
}
*/

// Ou se preferir tudo em um componente só:
/*
"use client";

import { useEffect, useState } from 'react';
import { getAllTasks } from "@/actions/task-actions";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const taskData = await getAllTasks();
        setTasks(taskData);
      } finally {
        setLoading(false);
      }
    }
    
    loadTasks();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Resto do componente...
}
*/
