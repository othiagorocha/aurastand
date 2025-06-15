import {
  CircleDashed as CircleDashedIcon,
  Circle as CircleIcon,
  CircleDotDashed as CircleDotDashedIcon,
  CircleDot as CircleDotIcon,
  CircleCheck as CircleCheckIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatus } from "../types";

import { statusConfig } from "../config/task-config";

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className='size-[18px] text-gray-400' />,
  [TaskStatus.TODO]: <CircleIcon className='size-[18px] text-blue-400' />,
  [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className='size-[18px] text-yellow-400' />,
  [TaskStatus.IN_REVIEW]: <CircleDotIcon className='size-[18px] text-purple-400' />,
  [TaskStatus.DONE]: <CircleCheckIcon className='size-[18px] text-emerald-400' />,
};

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

export const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  return (
    <div className='px-2 py-1.5 flex items-center justify-between'>
      <div className='flex items-center gap-x-2'>
        {statusIconMap[board]}
        <h2 className='text-sm font-medium'>{statusConfig[board].label}</h2>
        <div className='size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium'>
          {taskCount}
        </div>
      </div>
      <Button variant='ghost' size='icon' className='size-5'>
        <Plus className='size-4' />
      </Button>
    </div>
  );
};
