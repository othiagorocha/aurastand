// src/app/(dashboard)/tasks/tasks-client-wrapper.tsx (CLIENT)
"use client";

import { TaskViews } from "@/features/tasks/components/task-views";
import { Task } from "@/features/tasks/types";

interface TasksClientWrapperProps {
  initialTasks: Task[];
}

export function TasksClientWrapper({ initialTasks }: TasksClientWrapperProps) {
  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task);
    // Client-side interactivity
  };

  return <TaskViews tasks={initialTasks} onTaskClick={handleTaskClick} />;
}
