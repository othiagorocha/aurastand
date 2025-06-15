// src/features/projects/components/project-task-stats.tsx (SERVER COMPONENT)
import { Task } from "@/features/tasks/types";
import { AlertTriangle } from "lucide-react";

interface ProjectTaskStatsProps {
  tasks: Task[];
  projectId: string;
}

// export function ProjectTaskStats({ tasks, projectId }: ProjectTaskStatsProps) {
export function ProjectTaskStats({ tasks }: ProjectTaskStatsProps) {
  // ✅ Server-side calculations
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    inReview: tasks.filter((t) => t.status === "IN_REVIEW").length,
    done: tasks.filter((t) => t.status === "DONE").length,
    overdue: tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "DONE").length,
    highPriority: tasks.filter((t) => t.priority === "HIGH" || t.priority === "URGENT").length,
  };

  const progressPercentage = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className='bg-white rounded-lg shadow-sm border p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-lg font-semibold text-gray-900'>Estatísticas das Tarefas</h3>
        <div className='flex items-center gap-2'>
          <div className='text-sm text-gray-600'>Progresso: {progressPercentage}%</div>
          <div className='w-24 bg-gray-200 rounded-full h-2'>
            <div
              className='bg-green-500 h-2 rounded-full transition-all duration-300'
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
        <div className='text-center p-4 bg-gray-50 rounded-lg'>
          <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
          <div className='text-sm text-gray-600'>Total</div>
        </div>

        <div className='text-center p-4 bg-gray-50 rounded-lg'>
          <div className='text-2xl font-bold text-gray-600'>{stats.todo}</div>
          <div className='text-sm text-gray-600'>A Fazer</div>
        </div>

        <div className='text-center p-4 bg-blue-50 rounded-lg'>
          <div className='text-2xl font-bold text-blue-600'>{stats.inProgress}</div>
          <div className='text-sm text-blue-600'>Em Andamento</div>
        </div>

        <div className='text-center p-4 bg-yellow-50 rounded-lg'>
          <div className='text-2xl font-bold text-yellow-600'>{stats.inReview}</div>
          <div className='text-sm text-yellow-600'>Em Revisão</div>
        </div>

        <div className='text-center p-4 bg-green-50 rounded-lg'>
          <div className='text-2xl font-bold text-green-600'>{stats.done}</div>
          <div className='text-sm text-green-600'>Concluídas</div>
        </div>

        <div className='text-center p-4 bg-red-50 rounded-lg'>
          <div className='text-2xl font-bold text-red-600'>{stats.overdue}</div>
          <div className='text-sm text-red-600'>Atrasadas</div>
        </div>
      </div>

      {(stats.overdue > 0 || stats.highPriority > 0) && (
        <div className='mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='h-5 w-5 text-amber-600 mt-0.5' />
            <div className='flex-1'>
              <h4 className='font-medium text-amber-800'>Atenção Necessária</h4>
              <div className='mt-1 text-sm text-amber-700'>
                {stats.overdue > 0 && (
                  <p>
                    • {stats.overdue} tarefa{stats.overdue > 1 ? "s" : ""} atrasada{stats.overdue > 1 ? "s" : ""}
                  </p>
                )}
                {stats.highPriority > 0 && (
                  <p>
                    • {stats.highPriority} tarefa{stats.highPriority > 1 ? "s" : ""} de alta prioridade
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
