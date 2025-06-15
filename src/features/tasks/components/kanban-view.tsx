// src/features/tasks/components/kanban-view.tsx
"use client";

import { KanbanBoard } from "./kanban-board";
import { TaskViewProps, Task } from "../types";

interface KanbanViewProps extends TaskViewProps {
  onTaskClick?: (task: Task) => void;
}

export function KanbanView({ tasks, onTaskClick }: KanbanViewProps) {
  return (
    <div className='w-full'>
      <KanbanBoard tasks={tasks} onTaskClick={onTaskClick} />
    </div>
  );
}
