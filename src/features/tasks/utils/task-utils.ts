// src/features/tasks/utils/task-utils.ts

import { Task, TaskStatus } from "../types";
import { Task as PrismaTask, Project } from "@prisma/client";

/**
 * Converte uma task do Prisma para o formato esperado pelos componentes
 */
export function transformPrismaTaskToComponent(
  prismaTask: PrismaTask & {
    project: Project & { workspace: { id: string; name: string } };
    assignee: {
      id: string;
      name: string;
      email: string;
    } | null;
  }
): Task {
  return {
    id: prismaTask.id,
    title: prismaTask.title,
    description: prismaTask.description,
    status: prismaTask.status as TaskStatus,
    priority: prismaTask.priority,
    dueDate: prismaTask.dueDate,
    createdAt: prismaTask.createdAt,
    updatedAt: prismaTask.updatedAt,
    projectId: prismaTask.projectId,
    userId: prismaTask.userId,
    assigneeId: prismaTask.assigneeId,

    // Compatibilidade com sistema antigo
    $id: prismaTask.id,
    position: prismaTask.position || 0,

    // Relacionamentos
    project: {
      id: prismaTask.project?.id || prismaTask.projectId,
      name: prismaTask.project?.name || "Projeto",
      workspace: {
        id: prismaTask.project?.workspace?.id || "",
        name: prismaTask.project?.workspace?.name || "Workspace",
      },
    },

    // Assignee opcional
    assignee: prismaTask.assignee
      ? {
          id: prismaTask.assignee.id,
          name: prismaTask.assignee.name || prismaTask.assignee.email,
          email: prismaTask.assignee.email,
        }
      : null,
  };
}

/**
 * Filtra tasks por status
 */
export function filterTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status);
}

/**
 * Agrupa tasks por status
 */
export function groupTasksByStatus(tasks: Task[]) {
  return tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);
}

/**
 * Ordena tasks por position
 */
export function sortTasksByPosition(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (a.position || 0) - (b.position || 0));
}
