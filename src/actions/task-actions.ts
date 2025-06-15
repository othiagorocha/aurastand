// src/actions/task-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getErrorMessage } from "@/lib/handle-error";
import type { TaskFormState } from "@/types/form-states";

const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  projectId: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(), // ✅ Adicionado assigneeId
});

const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(), // ✅ Adicionado assigneeId
});

export async function createTask(prevState: TaskFormState | undefined, formData: FormData): Promise<TaskFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const validatedFields = createTaskSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      projectId: formData.get("projectId"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
      assigneeId: formData.get("assigneeId"), // ✅ Incluir assigneeId
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { title, description, projectId, priority, dueDate, assigneeId } = validatedFields.data;

    const newTask = await db.task.create({
      data: {
        title,
        description,
        projectId,
        userId: user.id,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null, // ✅ Incluir assigneeId
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      taskId: newTask.id,
    };
  } catch (error) {
    console.error(getErrorMessage(error));
    return {
      errors: {
        _form: ["Erro ao criar tarefa"],
      },
    };
  }
}

export async function updateTask(prevState: TaskFormState | undefined, formData: FormData): Promise<TaskFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const validatedFields = updateTaskSchema.safeParse({
      id: formData.get("id"),
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
      assigneeId: formData.get("assigneeId"), // ✅ Incluir assigneeId
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, title, description, status, priority, dueDate, assigneeId } = validatedFields.data;

    await db.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null, // ✅ Incluir assigneeId
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${id}`);
    return {
      success: true,
      taskId: id,
    };
  } catch (error) {
    console.error(getErrorMessage(error));
    return {
      errors: {
        _form: ["Erro ao atualizar tarefa"],
      },
    };
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    await db.task.update({
      where: { id: taskId },
      data: { status },
    });

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${taskId}`);
  } catch (error) {
    console.error(getErrorMessage(error));
    throw new Error("Erro ao atualizar status da tarefa");
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    await db.task.delete({
      where: { id: taskId },
    });

    revalidatePath("/tasks");
  } catch (error) {
    console.error(getErrorMessage(error));
    throw new Error("Erro ao deletar tarefa");
  }
}

// ✅ Query corrigida com todos os relacionamentos necessários
export async function getAllTasks() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const tasks = await db.task.findMany({
    where: {
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
          id: true, // ✅ Incluir ID do projeto
          name: true,
          workspace: {
            select: {
              id: true, // ✅ Incluir ID do workspace
              name: true,
            },
          },
        },
      },
      assignee: {
        select: {
          id: true,
          name: true, // ✅ Pode ser null
          email: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true, // ✅ Pode ser null
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
}

// ✅ Query corrigida com todos os relacionamentos necessários
export async function getTasksByProject(projectId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const tasks = await db.task.findMany({
    where: {
      projectId,
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
          id: true, // ✅ Incluir ID do projeto
          name: true,
          workspace: {
            select: {
              id: true, // ✅ Incluir ID do workspace
              name: true,
            },
          },
        },
      },
      assignee: {
        select: {
          id: true,
          name: true, // ✅ Pode ser null
          email: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true, // ✅ Pode ser null
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
}

// ✅ Nova função para buscar uma tarefa específica com todos os relacionamentos
export async function getTaskById(taskId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const task = await db.task.findFirst({
    where: {
      id: taskId,
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

  return task;
}

// ✅ Nova função para buscar usuários de um workspace
export async function getWorkspaceUsers(workspaceId?: string) {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  // Se workspaceId for fornecido, buscar usuários desse workspace específico
  if (workspaceId) {
    const workspaceUsers = await db.workspaceUser.findMany({
      where: {
        workspaceId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return workspaceUsers.map((wu) => wu.user);
  }

  // Caso contrário, buscar usuários de todos os workspaces do usuário atual
  const workspaceUsers = await db.workspaceUser.findMany({
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    distinct: ["userId"], // Evitar duplicatas
  });

  return workspaceUsers.map((wu) => wu.user);
}
