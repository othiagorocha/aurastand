// src/features/tasks/components/kanban-card.tsx
import React from "react";
import { Task } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Clock, User } from "lucide-react";
import { priorityConfig, statusConfig } from "../config/task-config";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const priorityStyle = priorityConfig[task.priority];

  return (
    <Card
      className='mb-3 cursor-pointer hover:shadow-md transition-shadow border-l-4'
      style={{ borderLeftColor: priorityStyle.color.replace("bg-", "#") }}>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <h4 className='font-medium text-sm line-clamp-2 flex-1'>{task.title}</h4>
          <Badge variant='outline' className={`ml-2 text-xs ${priorityStyle.textColor} ${priorityStyle.bgColor}`}>
            {priorityStyle.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {task.description && <p className='text-xs text-gray-600 line-clamp-2 mb-3'>{task.description}</p>}

        <div className='space-y-2'>
          {/* Data de Vencimento */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
              <CalendarIcon className='h-3 w-3' />
              <span>
                {formatDistanceToNow(new Date(task.dueDate), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          )}

          {/* Projeto */}
          <div className='flex items-center gap-1 text-xs text-gray-600'>
            <div className='w-2 h-2 rounded-full bg-blue-500' />
            <span className='truncate'>{task.project.name}</span>
          </div>

          {/* Assignee */}
          {task.assignee && (
            <div className='flex items-center gap-2 mt-2'>
              <Avatar className='h-6 w-6'>
                <AvatarImage src={`https://avatar.vercel.sh/${task.assignee.email}`} />
                <AvatarFallback className='text-xs'>
                  {task.assignee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className='text-xs text-gray-600 truncate'>{task.assignee.name}</span>
            </div>
          )}

          {/* Timestamp */}
          <div className='flex items-center gap-1 text-xs text-gray-400 pt-1 border-t'>
            <Clock className='h-3 w-3' />
            <span>
              {formatDistanceToNow(new Date(task.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
