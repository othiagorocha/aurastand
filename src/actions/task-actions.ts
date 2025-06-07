"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  projectId: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z.string().optional(),
});

const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  dueDate: z.string().optional(),
});

export async function createTask(prevState: any, formData: FormData) {
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
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { title, description, projectId, priority, dueDate } = validatedFields.data;

    const task = await db.task.create({
      data: {
        title,
        description,
        projectId,
        userId: user.id,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/projects/${projectId}`);
    return { success: true, task };
  } catch (error) {
    return {
      errors: {
        _form: ["Erro ao criar tarefa"],
      },
    };
  }
}

export async function updateTask(prevState: any, formData: FormData) {
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
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, title, description, status, priority, dueDate } = validatedFields.data;

    await db.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    return {
      errors: {
        _form: ["Erro ao atualizar tarefa"],
      },
    };
  }
}

export async function updateTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE") {
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
    return { success: true };
  } catch (error) {
    throw new Error("Erro ao atualizar status da tarefa");
  }
}

export async function deleteTask(taskId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    await db.task.delete({
      where: { id: taskId },
    });

    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    throw new Error("Erro ao deletar tarefa");
  }
}

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
          name: true,
          workspace: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
}

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
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
}
