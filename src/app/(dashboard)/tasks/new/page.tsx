// src/app/(dashboard)/tasks/new/page.tsx
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TaskCreateClient } from "./task-create-client";

interface TaskCreatePageProps {
  searchParams: Promise<{
    projectId?: string;
  }>;
}

export default async function TaskCreatePage({ searchParams }: TaskCreatePageProps) {
  const { projectId } = await searchParams;

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Buscar projetos do usuário
  const projects = await db.project.findMany({
    where: {
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
    },
    orderBy: {
      name: "asc",
    },
  });

  // Se um projectId foi passado, buscar usuários desse workspace
  let workspaceUsers: any[] = [];
  if (projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      workspaceUsers = await db.user.findMany({
        where: {
          workspaces: {
            some: {
              workspaceId: project.workspace.id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }
  }

  return <TaskCreateClient projects={projects} workspaceUsers={workspaceUsers} defaultProjectId={projectId || ""} />;
}
