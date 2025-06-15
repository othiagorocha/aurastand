// src/features/tasks/components/task-board-view.tsx
"use client";

import { useState } from "react";
import { Task, TaskStatus } from "../types";
import { DataKanban } from "./data-kanban";
import { Card, CardContent } from "@/components/ui/card";

interface TaskBoardViewProps {
  tasks: Task[];
}

export function TaskBoardView({ tasks }: TaskBoardViewProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleTaskChange = (updates: { $id: string; status: TaskStatus; position: number }[]) => {
    // Aqui você implementaria a lógica para atualizar as tarefas
    // Por exemplo, chamando uma API ou action
    console.log("Updating tasks:", updates);

    // Exemplo de como você poderia implementar:
    // await updateTasksBulk(updates);
    // revalidatePath('/tasks');
  };

  if (tasks.length === 0) {
    return (
      <Card className='p-8 text-center'>
        <CardContent>
          <p className='text-gray-500'>Nenhuma tarefa encontrada.</p>
          <p className='text-sm text-gray-400 mt-2'>Ajuste os filtros ou crie uma nova tarefa</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='w-full'>
      <DataKanban data={tasks} onChange={handleTaskChange} />
    </div>
  );
}
