// src/app/(dashboard)/tasks/page.tsx
import { getAllTasks } from "@/actions/task-actions";
import { TaskViews } from "@/features/tasks/components/task-views";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function TasksPage() {
  const tasks = await getAllTasks();

  return (
    <div className='space-y-6'>
      {/* Cabeçalho */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Tarefas</h1>
          <p className='text-gray-600'>Gerencie e organize suas tarefas de forma eficiente</p>
        </div>
        <Button asChild>
          <Link href='/tasks/new' className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Nova Tarefa
          </Link>
        </Button>
      </div>

      {/* Estatísticas rápidas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-gray-900'>{tasks.length}</div>
          <div className='text-sm text-gray-600'>Total de tarefas</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-blue-600'>{tasks.filter((t) => t.status === "IN_PROGRESS").length}</div>
          <div className='text-sm text-gray-600'>Em andamento</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-yellow-600'>{tasks.filter((t) => t.status === "IN_REVIEW").length}</div>
          <div className='text-sm text-gray-600'>Em revisão</div>
        </div>
        <div className='bg-white rounded-lg shadow p-4'>
          <div className='text-2xl font-bold text-green-600'>{tasks.filter((t) => t.status === "DONE").length}</div>
          <div className='text-sm text-gray-600'>Concluídas</div>
        </div>
      </div>

      {/* Sistema de visualização */}
      <TaskViews
        tasks={tasks}
        defaultView='kanban'
        onTaskClick={(task) => {
          // Aqui você pode implementar a lógica para abrir detalhes da tarefa
          console.log("Tarefa clicada:", task);
        }}
      />
    </div>
  );
}
