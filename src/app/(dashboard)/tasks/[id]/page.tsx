// src/app/(dashboard)/tasks/[id]/page.tsx
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TaskDetailClient } from "./task-detail-client";

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const task = await db.task.findFirst({
    where: {
      id,
      project: {
        workspace: {
          users: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          workspace: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    redirect("/tasks");
  }

  // Buscar usuários do workspace para atribuição
  const workspaceUsers = await db.user.findMany({
    where: {
      workspaces: {
        some: {
          workspaceId: task.project.workspace.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return <TaskDetailClient task={task} workspaceUsers={workspaceUsers} />;
}
