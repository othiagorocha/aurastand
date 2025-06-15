// src/features/tasks/components/kanban-column-header.tsx
import React from "react";
import { TaskStatus } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon, PlusIcon } from "lucide-react";
import { statusConfig } from "../config/task-config";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className='size-[18px] text-gray-400' />,
  [TaskStatus.TODO]: <CircleIcon className='size-[18px] text-blue-400' />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className='size-[18px] text-yellow-400' />,
  [TaskStatus.IN_REVIEW]: <CircleDotIcon className='size-[18px] text-purple-400' />,
  [TaskStatus.DONE]: <CircleCheckIcon className='size-[18px] text-emerald-400' />,
};

export const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  const icon = statusIconMap[board];
  const config = statusConfig[board];

  const handleAddTask = () => {
    // Implementar modal de criação de tarefa com status pré-selecionado
    console.log(`Adicionar tarefa no status: ${board}`);
  };

  return (
    <div className='px-2 py-3 flex items-center justify-between border-b border-gray-200 mb-3'>
      <div className='flex items-center gap-x-3'>
        {icon}
        <div className='flex items-center gap-2'>
          <h2 className='text-sm font-semibold text-gray-700'>{config.label}</h2>
          <Badge variant='secondary' className='text-xs font-medium'>
            {taskCount}
          </Badge>
        </div>
      </div>

      <Button onClick={handleAddTask} variant='ghost' size='sm' className='h-8 w-8 p-0 hover:bg-gray-100'>
        <PlusIcon className='h-4 w-4 text-gray-500' />
      </Button>
    </div>
  );
};
