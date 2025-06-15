import React from "react";
import { Task } from "../types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className='bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3'>
      <div className='flex items-start justify-between gap-x-2'>
        <p className='text-sm line-clamp-2'>{task.title}</p>
      </div>

      {/* Assignee section - verificação se existe assignee */}
      <div className='flex items-center gap-x-1.5'>
        {task.assignee && task.assignee.name ? (
          <>
            <Avatar className='size-6'>
              <AvatarImage src={`https://avatar.vercel.sh/${task.assignee.email}`} />
              <AvatarFallback className='text-xs'>
                {task.assignee.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className='text-xs text-gray-600 truncate'>{task.assignee.name}</span>
          </>
        ) : (
          <span className='text-xs text-gray-600'>Nenhum assignee</span>
        )}
        <div className='size-1 rounded-full bg-neutral-300' />
      </div>

      {/* Project section */}
      <div className='flex items-center gap-x-1.5'>
        <span className='text-xs font-medium'>{task.project.name}</span>
      </div>
    </div>
  );
};
