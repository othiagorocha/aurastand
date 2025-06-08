// src/actions/project-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import type { ProjectFormState } from "@/types/form-states";

const createProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  workspaceId: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function createProject(prevState: ProjectFormState | undefined, formData: FormData): Promise<ProjectFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const validatedFields = createProjectSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      workspaceId: formData.get("workspaceId"),
      priority: formData.get("priority"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, description, workspaceId, priority, startDate, endDate } = validatedFields.data;

    await db.project.create({
      data: {
        name,
        description,
        workspaceId,
        userId: user.id,
        priority,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    revalidatePath("/projects");
    revalidatePath(`/workspaces/${workspaceId}`);
    return { success: true };
  } catch {
    return {
      errors: {
        _form: ["Erro ao criar projeto"],
      },
    };
  }
}

export async function updateProject(prevState: ProjectFormState | undefined, formData: FormData): Promise<ProjectFormState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const id = formData.get("id") as string;
    const validatedFields = createProjectSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      workspaceId: formData.get("workspaceId"),
      priority: formData.get("priority"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, description, priority, startDate, endDate } = validatedFields.data;

    await db.project.update({
      where: { id },
      data: {
        name,
        description,
        priority,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    return { success: true };
  } catch {
    return {
      errors: {
        _form: ["Erro ao atualizar projeto"],
      },
    };
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    await db.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/projects");
  } catch {
    throw new Error("Erro ao deletar projeto");
  }
}

export async function getAllProjects() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

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
          name: true,
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}

export async function getProjectsByWorkspace(workspaceId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const projects = await db.project.findMany({
    where: {
      workspaceId,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return projects;
}
