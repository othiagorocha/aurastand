// src/features/tasks/components/kanban-view.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { statusConfig, statusOrder } from "../config/task-config";
import { TaskViewProps, Task, TaskStatus } from "../types";
import { TaskCard } from "./task-card";

interface KanbanViewProps extends TaskViewProps {
  onTaskClick?: (task: Task) => void;
}

export function KanbanView({ tasks, onTaskClick }: KanbanViewProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
      {statusOrder.map((status: TaskStatus) => {
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          <div key={status} className='bg-gray-50 rounded-lg p-4 min-h-[400px]'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-medium text-gray-900'>{statusConfig[status].label}</h3>
              <Badge variant='outline'>{columnTasks.length}</Badge>
            </div>

            <div className='space-y-3'>
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} compact onClick={onTaskClick} />
              ))}

              {columnTasks.length === 0 && <div className='text-center text-gray-500 py-8 text-sm'>Nenhuma tarefa</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
