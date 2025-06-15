// src/features/tasks/components/task-card.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusConfig, priorityConfig } from "../config/task-config";
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  compact?: boolean;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, compact = false, onClick }: TaskCardProps) {
  const StatusIcon = statusConfig[task.status].icon;

  return (
    <Card
      className={`hover:shadow-md transition-shadow cursor-pointer ${compact ? "mb-2" : "mb-4"}`}
      onClick={() => onClick?.(task)}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className='flex justify-between items-start mb-2'>
          <h4 className={`font-medium ${compact ? "text-sm" : "text-base"}`}>{task.title}</h4>
          <StatusIcon className='h-4 w-4 text-gray-500 flex-shrink-0 ml-2' />
        </div>

        {!compact && task.description && <p className='text-gray-600 text-sm mb-3'>{task.description}</p>}

        <div className='flex flex-wrap gap-2 mb-2'>
          <Badge className={statusConfig[task.status].color}>{statusConfig[task.status].label}</Badge>
          <Badge className={priorityConfig[task.priority].color}>{priorityConfig[task.priority].label}</Badge>
        </div>

        <div className='text-xs text-gray-500 space-y-1'>
          <div className='truncate'>
            {task.project.workspace.name} / {task.project.name}
          </div>
          {task.dueDate && <div>Vence: {task.dueDate.toLocaleDateString("pt-BR")}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
