// src/app/(dashboard)/projects/[id]/page.tsx
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTasksByProject } from "@/actions/task-actions";
import { TaskList } from "@/features/tasks/components/task-list";
import Link from "next/link";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const project = await db.project.findFirst({
    where: {
      id: params.id,
      workspace: {
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    include: {
      workspace: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  if (!project) {
    redirect("/projects");
  }

  const tasks = await getTasksByProject(params.id);

  const statusColors = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    ARCHIVED: "bg-red-100 text-red-800",
  };

  const priorityColors = {
    LOW: "bg-gray-100 text-gray-800",
    MEDIUM: "bg-blue-100 text-blue-800",
    HIGH: "bg-orange-100 text-orange-800",
    URGENT: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    ARCHIVED: "Arquivado",
  };

  const priorityLabels = {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    URGENT: "Urgente",
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div>
          <nav className='text-sm text-gray-500 mb-2'>
            <Link href='/workspaces' className='hover:text-gray-700'>
              {project.workspace.name}
            </Link>
            {" / "}
            <span className='text-gray-900'>{project.name}</span>
          </nav>
          <h1 className='text-3xl font-bold text-gray-900'>{project.name}</h1>
          {project.description && <p className='text-gray-600 mt-2'>{project.description}</p>}

          <div className='flex items-center space-x-4 mt-3'>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[project.status]
              }`}>
              {statusLabels[project.status]}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[project.priority]
              }`}>
              {priorityLabels[project.priority]}
            </span>
            <span className='text-sm text-gray-500'>{project._count.tasks} tarefas</span>
          </div>
        </div>
        <Link href='/tasks/new' className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
          Nova Tarefa
        </Link>
      </div>

      <div>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>Tarefas</h2>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}
