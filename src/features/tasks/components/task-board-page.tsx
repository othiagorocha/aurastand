// src/features/tasks/components/task-board-page.tsx
"use client";

import { useState } from "react";
import { Task } from "../types";
import { CompleteTasksClient } from "@/app/(dashboard)/tasks/complete/complete-tasks-client";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskBoardPageProps {
  initialTasks: Task[];
  projectId?: string;
}

export function TaskBoardPage({ initialTasks, projectId }: TaskBoardPageProps) {
  const [view, setView] = useState<"kanban" | "table" | "calendar">("kanban");

  const handleCreateTask = () => {
    // Implementar modal de criação de tarefa
    console.log("Criar nova tarefa", { projectId });
  };

  return (
    <div className='space-y-6'>
      {/* Cabeçalho */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Tarefas</h2>
          <p className='text-gray-600'>Gerencie e visualize suas tarefas</p>
        </div>

        <div className='flex items-center gap-3'>
          {/* Seletor de Visualização */}
          <Tabs value={view} onValueChange={(value) => setView(value as typeof view)}>
            <TabsList>
              <TabsTrigger value='kanban' className='flex items-center gap-2'>
                <LayoutGrid className='h-4 w-4' />
                Kanban
              </TabsTrigger>
              <TabsTrigger value='table' className='flex items-center gap-2'>
                <List className='h-4 w-4' />
                Lista
              </TabsTrigger>
              <TabsTrigger value='calendar' className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                Calendário
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={handleCreateTask}>
            <Plus className='h-4 w-4 mr-2' />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-gray-900'>{initialTasks.length}</div>
          <div className='text-sm text-gray-600'>Total de Tarefas</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-blue-600'>{initialTasks.filter((t) => t.status === "TODO").length}</div>
          <div className='text-sm text-gray-600'>Para Fazer</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-yellow-600'>
            {initialTasks.filter((t) => t.status === "IN_PROGRESS").length}
          </div>
          <div className='text-sm text-gray-600'>Em Progresso</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-green-600'>{initialTasks.filter((t) => t.status === "DONE").length}</div>
          <div className='text-sm text-gray-600'>Concluídas</div>
        </div>
      </div>

      {/* Conteúdo baseado na visualização */}
      <Tabs value={view} onValueChange={(value) => setView(value as typeof view)}>
        <TabsContent value='kanban'>
          <CompleteTasksClient initialTasks={initialTasks} />
        </TabsContent>

        <TabsContent value='table'>
          <div className='p-8 text-center bg-white rounded-lg border'>
            <p className='text-gray-500'>Visualização em tabela em desenvolvimento</p>
          </div>
        </TabsContent>

        <TabsContent value='calendar'>
          <div className='p-8 text-center bg-white rounded-lg border'>
            <p className='text-gray-500'>Visualização em calendário em desenvolvimento</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
