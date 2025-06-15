// src/features/tasks/utils/task-transformer.ts

import { Task } from "../types";

// Tipo que representa o retorno das queries Prisma
type PrismaTaskWithRelations = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  userId: string;
  assigneeId: string | null;
  position?: number | null;
  project: {
    id: string;
    name: string;
    workspace: {
      id: string;
      name: string;
    };
  };
  assignee?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

/**
 * Transforma dados do Prisma para o formato esperado pelos componentes
 * Garante que todos os campos obrigatórios estejam presentes e tipados corretamente
 */
export function transformPrismaToTask(prismaTask: PrismaTaskWithRelations): Task {
  return {
    id: prismaTask.id,
    title: prismaTask.title,
    description: prismaTask.description,
    status: prismaTask.status as Task["status"],
    priority: prismaTask.priority as Task["priority"],
    dueDate: prismaTask.dueDate,
    createdAt: prismaTask.createdAt,
    updatedAt: prismaTask.updatedAt,
    projectId: prismaTask.projectId,
    userId: prismaTask.userId,
    assigneeId: prismaTask.assigneeId,
    position: prismaTask.position || 0,

    // Garantir que project sempre tenha os campos necessários
    project: {
      id: prismaTask.project.id,
      name: prismaTask.project.name,
      workspace: {
        id: prismaTask.project.workspace.id,
        name: prismaTask.project.workspace.name,
      },
    },

    // Assignee pode ser null ou ter name como null
    assignee: prismaTask.assignee
      ? {
          id: prismaTask.assignee.id,
          name: prismaTask.assignee.name,
          email: prismaTask.assignee.email,
        }
      : null,

    // User (criador) pode ter name como null
    user: prismaTask.user
      ? {
          id: prismaTask.user.id,
          name: prismaTask.user.name,
          email: prismaTask.user.email,
        }
      : undefined,
  };
}

/**
 * Transforma array de tasks do Prisma
 */
export function transformPrismaToTasks(prismaTasks: PrismaTaskWithRelations[]): Task[] {
  return prismaTasks.map(transformPrismaToTask);
}

/**
 * Função utilitária para garantir que assignee.name seja sempre string nos componentes
 */
export function getAssigneeName(assignee: Task["assignee"]): string {
  if (!assignee) return "Não atribuído";
  return assignee.name || assignee.email.split("@")[0] || "Usuário";
}

/**
 * Função utilitária para garantir que user.name seja sempre string nos componentes
 */
export function getUserName(user: Task["user"]): string {
  if (!user) return "Usuário desconhecido";
  return user.name || user.email.split("@")[0] || "Usuário";
}

/**
 * Valida se um objeto tem a estrutura mínima de uma Task
 */
export function isValidTask(obj: unknown): obj is Task {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Task).id === "string" &&
    typeof (obj as Task).title === "string" &&
    typeof (obj as Task).status === "string" &&
    typeof (obj as Task).priority === "string" &&
    typeof (obj as Task).project === "object" &&
    typeof (obj as Task).project.id === "string" &&
    typeof (obj as Task).project.name === "string" &&
    typeof (obj as Task).project.workspace === "object" &&
    typeof (obj as Task).project.workspace.id === "string" &&
    typeof (obj as Task).project.workspace.name === "string"
  );
}

/**
 * Filtra e valida tasks, removendo objetos inválidos
 */
export function filterValidTasks(tasks: unknown[]): Task[] {
  return tasks.filter(isValidTask);
}
