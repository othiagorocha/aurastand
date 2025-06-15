// src/app/(dashboard)/page.tsx
import { getAllWorkspaces } from "@/actions/workspace-actions";
import { getAllProjects } from "@/actions/project-actions";
import { getAllTasks } from "@/actions/task-actions";
import { statusConfig } from "@/features/tasks/config/task-config";
import Link from "next/link";

export default async function DashboardPage() {
  const [workspaces, projects, tasks] = await Promise.all([getAllWorkspaces(), getAllProjects(), getAllTasks()]);

  // Estatísticas
  const tasksByStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentTasks = tasks.slice(0, 5);
  const recentProjects = projects.slice(0, 3);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-gray-600'>Visão geral dos seus projetos e tarefas</p>
      </div>

      {/* Estatísticas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-sm font-medium text-gray-500'>Workspaces</h3>
          <p className='text-2xl font-bold text-gray-900'>{workspaces.length}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-sm font-medium text-gray-500'>Projetos</h3>
          <p className='text-2xl font-bold text-gray-900'>{projects.length}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-sm font-medium text-gray-500'>Tarefas Total</h3>
          <p className='text-2xl font-bold text-gray-900'>{tasks.length}</p>
        </div>
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='text-sm font-medium text-gray-500'>Tarefas Concluídas</h3>
          <p className='text-2xl font-bold text-green-600'>{tasksByStatus.DONE || 0}</p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Tarefas Recentes */}
        <div className='bg-white rounded-lg shadow'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-medium text-gray-900'>Tarefas Recentes</h2>
              <Link href='/tasks' className='text-sm text-blue-600 hover:text-blue-800'>
                Ver todas
              </Link>
            </div>
          </div>
          <div className='p-6'>
            {recentTasks.length > 0 ? (
              <div className='space-y-4'>
                {recentTasks.map((task) => (
                  <div key={task.id} className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-900'>{task.title}</h3>
                      <p className='text-xs text-gray-500'>
                        {task.project.workspace.name} / {task.project.name}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        statusConfig[task.status].color
                      }`}>
                      {statusConfig[task.status].label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-4'>Nenhuma tarefa encontrada</p>
            )}
          </div>
        </div>

        {/* Projetos Recentes */}
        <div className='bg-white rounded-lg shadow'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <h2 className='text-lg font-medium text-gray-900'>Projetos Recentes</h2>
              <Link href='/projects' className='text-sm text-blue-600 hover:text-blue-800'>
                Ver todos
              </Link>
            </div>
          </div>
          <div className='p-6'>
            {recentProjects.length > 0 ? (
              <div className='space-y-4'>
                {recentProjects.map((project) => (
                  <div key={project.id} className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-sm font-medium text-gray-900'>
                        <Link href={`/projects/${project.id}`} className='hover:text-blue-600'>
                          {project.name}
                        </Link>
                      </h3>
                      <p className='text-xs text-gray-500'>{project.workspace.name}</p>
                    </div>
                    <div className='text-xs text-gray-500'>
                      {project._count.tasks} tarefa{project._count.tasks !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-4'>Nenhum projeto encontrado</p>
            )}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-lg font-medium text-gray-900 mb-4'>Ações Rápidas</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Link
            href='/workspaces'
            className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3'>
              <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-900'>Novo Workspace</h3>
              <p className='text-xs text-gray-500'>Organize seus projetos</p>
            </div>
          </Link>

          <Link
            href='/projects/new'
            className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
            <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3'>
              <svg className='w-5 h-5 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
              </svg>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-900'>Novo Projeto</h3>
              <p className='text-xs text-gray-500'>Inicie um novo projeto</p>
            </div>
          </Link>

          <Link
            href='/tasks/new'
            className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
            <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3'>
              <svg className='w-5 h-5 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                />
              </svg>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-900'>Nova Tarefa</h3>
              <p className='text-xs text-gray-500'>Adicione uma tarefa</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
