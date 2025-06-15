// src/features/tasks/components/task-card.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, AlertCircle } from "lucide-react";
import { statusConfig, priorityConfig } from "../config/task-config";
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  compact?: boolean;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, compact = false, onClick }: TaskCardProps) {
  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon || AlertCircle; // Fallback icon

  const handleClick = () => {
    onClick?.(task);
  };

  if (compact) {
    return (
      <Card className='cursor-pointer hover:shadow-md transition-shadow' onClick={handleClick}>
        <CardContent className='p-3'>
          <div className='space-y-2'>
            <div className='flex items-start justify-between gap-2'>
              <h3 className='text-sm font-medium truncate flex-1'>{task.title}</h3>
              <StatusIcon className='h-4 w-4 mt-0.5 flex-shrink-0' />
            </div>

            {task.description && <p className='text-xs text-gray-600 line-clamp-2'>{task.description}</p>}

            <div className='flex items-center justify-between'>
              <Badge variant='secondary' className={priorityConfig[task.priority].color}>
                {priorityConfig[task.priority].label}
              </Badge>

              {task.dueDate && (
                <div className='flex items-center gap-1 text-xs text-gray-500'>
                  <Calendar className='h-3 w-3' />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='cursor-pointer hover:shadow-md transition-shadow' onClick={handleClick}>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-lg'>{task.title}</CardTitle>
          <div className='flex items-center gap-2'>
            <StatusIcon className='h-5 w-5' />
            <Badge variant='secondary' className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {task.description && <p className='text-gray-600'>{task.description}</p>}

        <div className='flex flex-wrap gap-2'>
          <Badge variant='outline' className={priorityConfig[task.priority].color}>
            {priorityConfig[task.priority].label}
          </Badge>

          <Badge variant='outline'>{task.project.name}</Badge>
        </div>

        <div className='flex items-center justify-between text-sm text-gray-500'>
          {task.assignee && (
            <div className='flex items-center gap-1'>
              <User className='h-4 w-4' />
              {task.assignee.name}
            </div>
          )}

          {task.dueDate && (
            <div className='flex items-center gap-1'>
              <Calendar className='h-4 w-4' />
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
