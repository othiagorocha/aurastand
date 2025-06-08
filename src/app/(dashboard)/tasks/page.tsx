import { getAllTasks } from "@/actions/task-actions";
import { TaskList } from "@/features/tasks/components/task-list";
import Link from "next/link";

export default async function TasksPage() {
  const tasks = await getAllTasks();

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900'>Tarefas</h1>
        <Link href='/tasks/new' className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
          Nova Tarefa
        </Link>
      </div>

      <TaskList tasks={tasks} />
    </div>
  );
}
