import Link from "next/link";
import { deleteWorkspace } from "@/actions/workspace-actions";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  createdAt: Date;
  _count: {
    projects: number;
    users: number;
  };
}

interface WorkspaceListProps {
  workspaces: Workspace[];
}

export function WorkspaceList({ workspaces }: WorkspaceListProps) {
  if (workspaces.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Nenhum workspace encontrado</h3>
        <p className='text-gray-600'>Crie seu primeiro workspace para começar a organizar seus projetos.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {workspaces.map((workspace) => (
        <div key={workspace.id} className='bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <Link href={`/workspaces/${workspace.id}`} className='text-lg font-medium text-gray-900 hover:text-blue-600'>
                {workspace.name}
              </Link>
              {workspace.description && <p className='text-gray-600 mt-1'>{workspace.description}</p>}
              <div className='flex items-center space-x-4 mt-3 text-sm text-gray-500'>
                <span>{workspace._count.projects} projetos</span>
                <span>{workspace._count.users} membros</span>
                <span>Criado em {workspace.createdAt.toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
            <div className='flex space-x-2'>
              <Link href={`/workspaces/${workspace.id}`} className='text-blue-600 hover:text-blue-800'>
                Ver
              </Link>
              <form action={deleteWorkspace.bind(null, workspace.id)}>
                <button
                  type='submit'
                  className='text-red-600 hover:text-red-800'
                  onClick={(e) => {
                    if (!confirm("Tem certeza que deseja deletar este workspace?")) {
                      e.preventDefault();
                    }
                  }}>
                  Deletar
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
