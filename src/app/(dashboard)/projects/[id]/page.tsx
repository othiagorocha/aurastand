import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTasksByProject } from "@/actions/task-actions";
import { ProjectHeader } from "@/features/projects/components/project-header";
import { ProjectTaskStats } from "@/features/projects/components/project-task-stats";
import { ProjectTasksClient } from "./project-tasks-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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

  // ✅ Server-side data fetching
  const [project, tasks] = await Promise.all([
    db.project.findFirst({
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
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    }),
    getTasksByProject(params.id),
  ]);

  if (!project) {
    redirect("/projects");
  }

  return (
    <div className='space-y-6'>
      {/* ✅ Server-rendered navigation and header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' asChild>
          <Link href={`/workspaces/${project.workspace.id}`} className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Voltar
          </Link>
        </Button>

        <nav className='text-sm text-gray-500'>
          <Link href='/workspaces' className='hover:text-gray-700'>
            Workspaces
          </Link>
          {" / "}
          <Link href={`/workspaces/${project.workspace.id}`} className='hover:text-gray-700'>
            {project.workspace.name}
          </Link>
          {" / "}
          <span className='text-gray-900'>{project.name}</span>
        </nav>
      </div>

      {/* ✅ Server-rendered project header */}
      <ProjectHeader project={project} />

      {/* ✅ Server-rendered task statistics */}
      <ProjectTaskStats tasks={tasks} projectId={project.id} />

      {/* ✅ Client component for interactive task visualization */}
      <ProjectTasksClient initialTasks={tasks} projectId={project.id} projectName={project.name} />
    </div>
  );
}
