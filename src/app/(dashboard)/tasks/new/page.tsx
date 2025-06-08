// src/app/(dashboard)/tasks/new/page.tsx
import { getAllProjects } from "@/actions/project-actions";
import { CreateTaskForm } from "@/components/forms/task-form";

export default async function NewTaskPage() {
  const projects = await getAllProjects();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Nova Tarefa</h1>
        <p className='text-gray-600'>Crie uma nova tarefa para organizar seu trabalho.</p>
      </div>

      <div className='max-w-2xl'>
        <div className='bg-white rounded-lg shadow p-6'>
          <CreateTaskForm projects={projects} />
        </div>
      </div>
    </div>
  );
}
