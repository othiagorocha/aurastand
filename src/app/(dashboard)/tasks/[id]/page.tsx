// src/app/(dashboard)/tasks/[id]/page.tsx - EXEMPLO CORRIGIDO
import { notFound } from "next/navigation";
import { getTaskById, getWorkspaceUsers } from "@/actions/task-actions";
import { TaskDetailClient } from "./task-detail-client";
import { transformPrismaToTask } from "@/features/tasks/utils/task-transformer";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const rawTask = await getTaskById(params.id);

  if (!rawTask) {
    notFound();
  }

  // ✅ Transformar dados do Prisma para formato esperado
  const task = transformPrismaToTask(rawTask);

  // Buscar usuários do workspace para o select de assignee
  const workspaceUsers = await getWorkspaceUsers(task.project.workspace.id);

  return <TaskDetailClient task={task} workspaceUsers={workspaceUsers} />;
}
