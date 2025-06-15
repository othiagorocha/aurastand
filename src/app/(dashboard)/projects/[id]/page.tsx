// src/app/(dashboard)/projects/[id]/page.tsx
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTasksByProject } from "@/actions/task-actions";
import { TaskBoardPage } from "@/features/tasks/components/task-board-page";

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params; // Aguarda a Promise do params

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const project = await db.project.findFirst({
    where: {
      id,
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

  const tasks = await getTasksByProject(id);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div>
          <nav className='text-sm text-gray-500 mb-2'>
            <span className='text-gray-900'>{project.workspace.name}</span>
            {" / "}
            <span className='text-gray-900'>{project.name}</span>
          </nav>
          <h1 className='text-3xl font-bold text-gray-900'>{project.name}</h1>
          {project.description && <p className='text-gray-600 mt-2'>{project.description}</p>}
          <div className='flex items-center space-x-4 mt-3 text-sm text-gray-500'>
            <span>{project._count.tasks} tarefas</span>
          </div>
        </div>
      </div>

      <TaskBoardPage initialTasks={tasks} projectId={id} />
    </div>
  );
}
