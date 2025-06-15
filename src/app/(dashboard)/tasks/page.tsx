// src/app/(dashboard)/tasks/page.tsx
import { getAllTasks } from "@/actions/task-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TasksClientWrapper } from "./tasks-client-wrapper";
import { TaskStats } from "@/features/tasks/components/task-stats";

export default async function TasksPage() {
  const tasks = await getAllTasks();

  return (
    <div className='space-y-6'>
      {/* ✅ Server-rendered header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Tarefas</h1>
          <p className='text-gray-600'>Gerencie suas tarefas</p>
        </div>
        <Button asChild>
          <Link href='/tasks/new'>Nova Tarefa</Link>
        </Button>
      </div>

      {/* ✅ Server-rendered stats */}
      <TaskStats tasks={tasks} />

      {/* ✅ Client wrapper for interactivity */}
      <TasksClientWrapper initialTasks={tasks} />
    </div>
  );
}
