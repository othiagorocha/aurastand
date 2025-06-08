// src/app/(dashboard)/projects/new/page.tsx
import { getAllWorkspaces } from "@/actions/workspace-actions";
import { CreateProjectForm } from "@/components/forms/project-form";

export default async function NewProjectPage() {
  const workspaces = await getAllWorkspaces();

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Novo Projeto</h1>
        <p className='text-gray-600'>Crie um novo projeto para organizar suas tarefas.</p>
      </div>

      <div className='max-w-2xl'>
        <div className='bg-white rounded-lg shadow p-6'>
          <CreateProjectForm workspaces={workspaces} />
        </div>
      </div>
    </div>
  );
}
