// src/features/tasks/components/kanban-board.tsx
"use client";

import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, AlertCircle, Clock } from "lucide-react";
import { Task, TaskStatus, TasksState } from "../types";
import { updateTaskStatus } from "@/actions/task-actions";
import { useRouter } from "next/navigation";

// Configuração dos status das colunas
const COLUMN_CONFIG = {
  BACKLOG: {
    label: "Backlog",
    color: "bg-gray-50 border-gray-200",
    headerColor: "text-gray-700",
    count: 0,
  },
  TODO: {
    label: "A Fazer",
    color: "bg-gray-50 border-gray-200",
    headerColor: "text-gray-700",
    count: 0,
  },
  IN_PROGRESS: {
    label: "Em Andamento",
    color: "bg-blue-50 border-blue-200",
    headerColor: "text-blue-700",
    count: 0,
  },
  IN_REVIEW: {
    label: "Em Revisão",
    color: "bg-yellow-50 border-yellow-200",
    headerColor: "text-yellow-700",
    count: 0,
  },
  DONE: {
    label: "Concluído",
    color: "bg-green-50 border-green-200",
    headerColor: "text-green-700",
    count: 0,
  },
} as const;

const PRIORITY_COLORS = {
  LOW: "bg-gray-100 text-gray-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
} as const;

const PRIORITY_LABELS = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
} as const;

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

interface KanbanCardProps {
  task: Task;
  index: number;
  onTaskClick?: (task: Task) => void;
}

// Componente do Card da Tarefa
function KanbanCard({ task, index, onTaskClick }: KanbanCardProps) {
  const handleClick = () => {
    onTaskClick?.(task);
  };

  const assigneeName = task.assignee?.name || task.assignee?.email.split("@")[0] || "Não atribuído";

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}>
          <Card
            className={`mb-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
              snapshot.isDragging ? "shadow-lg rotate-2 opacity-90" : "shadow-sm"
            }`}
            onClick={handleClick}>
            <CardContent className='p-3'>
              {/* Título e Prioridade */}
              <div className='flex items-start justify-between mb-2'>
                <h4 className='text-sm font-medium text-gray-900 line-clamp-2 flex-1'>{task.title}</h4>
                <Badge variant='secondary' className={`ml-2 text-xs ${PRIORITY_COLORS[task.priority]}`}>
                  {PRIORITY_LABELS[task.priority]}
                </Badge>
              </div>

              {/* Descrição (se houver) */}
              {task.description && <p className='text-xs text-gray-600 mb-3 line-clamp-2'>{task.description}</p>}

              {/* Data de vencimento */}
              {task.dueDate && (
                <div className='flex items-center text-xs text-gray-500 mb-2'>
                  <Calendar className='w-3 h-3 mr-1' />
                  {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                </div>
              )}

              {/* Assignee e Projeto */}
              <div className='flex items-center justify-between text-xs text-gray-500'>
                <div className='flex items-center'>
                  {task.assignee ? (
                    <>
                      <Avatar className='w-5 h-5 mr-1'>
                        <AvatarImage src={`https://avatar.vercel.sh/${task.assignee.email}`} />
                        <AvatarFallback className='text-xs'>{assigneeName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className='truncate max-w-20'>{assigneeName}</span>
                    </>
                  ) : (
                    <>
                      <User className='w-3 h-3 mr-1' />
                      <span>Não atribuído</span>
                    </>
                  )}
                </div>
                <span className='text-xs bg-gray-100 px-2 py-1 rounded'>{task.project.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}

// Componente da Coluna do Kanban
interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

function KanbanColumn({ status, tasks, onTaskClick }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];

  return (
    <div className='flex-1 min-w-[280px] mx-2'>
      <Card className={`h-full ${config.color} border-2`}>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className={`text-sm font-medium ${config.headerColor}`}>{config.label}</CardTitle>
            <Badge variant='outline' className='bg-white'>
              {tasks.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='pt-0'>
          <Droppable droppableId={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`min-h-[400px] transition-colors duration-200 rounded-lg p-2 ${
                  snapshot.isDraggingOver ? "bg-white/50 border-2 border-dashed border-gray-300" : ""
                }`}>
                {tasks.map((task, index) => (
                  <KanbanCard key={task.id} task={task} index={index} onTaskClick={onTaskClick} />
                ))}
                {provided.placeholder}

                {tasks.length === 0 && (
                  <div className='flex flex-col items-center justify-center h-32 text-gray-400'>
                    <AlertCircle className='w-8 h-8 mb-2' />
                    <p className='text-sm'>Nenhuma tarefa</p>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal do Kanban Board
export function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  // Organizar tarefas por status
  const tasksByStatus: TasksState = {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    IN_REVIEW: tasks.filter((task) => task.status === "IN_REVIEW"),
    DONE: tasks.filter((task) => task.status === "DONE"),
    BACKLOG: tasks.filter((task) => task.status === "BACKLOG"),
  };

  // Colunas visíveis (excluindo BACKLOG por enquanto)
  const visibleColumns: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // Se não há destino ou é a mesma posição, não fazer nada
      if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
        return;
      }

      const newStatus = destination.droppableId as TaskStatus;

      try {
        setIsUpdating(true);

        // Atualizar status da tarefa via server action
        await updateTaskStatus(draggableId, newStatus);

        // Revalidar a página para atualizar os dados
        router.refresh();
      } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        // Aqui você pode adicionar um toast de erro
      } finally {
        setIsUpdating(false);
      }
    },
    [router]
  );

  return (
    <div className='w-full'>
      {isUpdating && (
        <div className='fixed top-4 right-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg shadow-lg z-50'>
          <div className='flex items-center'>
            <Clock className='w-4 h-4 mr-2 animate-spin' />
            Atualizando tarefa...
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='flex overflow-x-auto pb-4 gap-2'>
          {visibleColumns.map((status) => (
            <KanbanColumn key={status} status={status} tasks={tasksByStatus[status]} onTaskClick={onTaskClick} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
