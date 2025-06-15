// src/features/tasks/components/table-view.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { statusConfig, priorityConfig } from "../config/task-config";
import { TaskViewProps, Task } from "../types";

interface TableViewProps extends TaskViewProps {
  onTaskClick?: (task: Task) => void;
}

export function TableView({ tasks, onTaskClick }: TableViewProps) {
  if (tasks.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Nenhuma tarefa encontrada</h3>
        <p className='text-gray-600'>Crie sua primeira tarefa para começar a organizar seu trabalho.</p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='border-b'>
            <th className='text-left p-4 font-medium'>Tarefa</th>
            <th className='text-left p-4 font-medium'>Status</th>
            <th className='text-left p-4 font-medium'>Prioridade</th>
            <th className='text-left p-4 font-medium'>Projeto</th>
            <th className='text-left p-4 font-medium'>Atribuída a</th>
            <th className='text-left p-4 font-medium'>Prazo</th>
            <th className='text-left p-4 font-medium'>Criação</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className='border-b hover:bg-gray-50 cursor-pointer transition-colors'
              onClick={() => onTaskClick?.(task)}>
              <td className='p-4'>
                <div>
                  <div className='font-medium'>{task.title}</div>
                  {task.description && <div className='text-sm text-gray-600 mt-1 line-clamp-1'>{task.description}</div>}
                </div>
              </td>
              <td className='p-4'>
                <Badge className={statusConfig[task.status].color}>{statusConfig[task.status].label}</Badge>
              </td>
              <td className='p-4'>
                <Badge className={priorityConfig[task.priority].color}>{priorityConfig[task.priority].label}</Badge>
              </td>
              <td className='p-4'>
                <div className='text-sm'>
                  <div className='font-medium'>{task.project.name}</div>
                  <div className='text-gray-500'>{task.project.workspace.name}</div>
                </div>
              </td>
              <td className='p-4'>
                {task.assignee ? (
                  <div className='text-sm'>
                    <div className='font-medium'>{task.assignee.name}</div>
                    <div className='text-gray-500'>{task.assignee.email}</div>
                  </div>
                ) : (
                  <span className='text-gray-400'>Não atribuída</span>
                )}
              </td>
              <td className='p-4'>
                {task.dueDate ? (
                  <div className='text-sm'>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</div>
                ) : (
                  <span className='text-gray-400'>-</span>
                )}
              </td>
              <td className='p-4'>
                <div className='text-sm'>{new Date(task.createdAt).toLocaleDateString("pt-BR")}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
