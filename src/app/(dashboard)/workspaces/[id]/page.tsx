// src/app/(dashboard)/workspaces/[id]/page.tsx
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProjectsByWorkspace } from "@/actions/project-actions";
import { ProjectList } from "@/features/projects/components/project-list";
import Link from "next/link";

interface WorkspaceDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WorkspaceDetailPage({ params }: WorkspaceDetailPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const workspace = await db.workspace.findFirst({
    where: {
      id: params.id,
      users: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          projects: true,
          users: true,
        },
      },
    },
  });

  if (!workspace) {
    redirect("/workspaces");
  }

  const projects = await getProjectsByWorkspace(params.id);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>{workspace.name}</h1>
          {workspace.description && <p className='text-gray-600 mt-2'>{workspace.description}</p>}
          <div className='flex items-center space-x-4 mt-3 text-sm text-gray-500'>
            <span>{workspace._count.projects} projetos</span>
            <span>{workspace._count.users} membros</span>
          </div>
        </div>
        <Link href='/projects/new' className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
          Novo Projeto
        </Link>
      </div>

      <div>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>Projetos</h2>
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}
