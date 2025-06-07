import { getAllWorkspaces } from "@/actions/workspace-actions";
import { WorkspaceList } from "@/features/workspaces/components/workspace-list";
import { CreateWorkspaceForm } from "@/components/forms/workspace-form";

export default async function WorkspacesPage() {
  const workspaces = await getAllWorkspaces();

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900'>Workspaces</h1>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <WorkspaceList workspaces={workspaces} />
        </div>
        <div>
          <div className='bg-white rounded-lg shadow p-6'>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Criar Workspace</h2>
            <CreateWorkspaceForm />
          </div>
        </div>
      </div>
    </div>
  );
}
