"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
});

const updateWorkspaceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().optional(),
});

export async function createWorkspace(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const validatedFields = createWorkspaceSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, description } = validatedFields.data;
    const slug = name
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const workspace = await db.workspace.create({
      data: {
        name,
        description,
        slug: `${slug}-${Date.now()}`,
        users: {
          create: {
            userId: user.id,
            role: "ADMIN",
          },
        },
      },
    });

    revalidatePath("/workspaces");
    return { success: true, workspace };
  } catch (error) {
    return {
      errors: {
        _form: ["Erro ao criar workspace"],
      },
    };
  }
}

export async function updateWorkspace(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    const validatedFields = updateWorkspaceSchema.safeParse({
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, name, description } = validatedFields.data;

    // Verificar se usuário tem permissão
    const workspaceUser = await db.workspaceUser.findFirst({
      where: {
        workspaceId: id,
        userId: user.id,
        role: "ADMIN",
      },
    });

    if (!workspaceUser) {
      return {
        errors: {
          _form: ["Sem permissão para editar este workspace"],
        },
      };
    }

    await db.workspace.update({
      where: { id },
      data: { name, description },
    });

    revalidatePath("/workspaces");
    revalidatePath(`/workspaces/${id}`);
    return { success: true };
  } catch (error) {
    return {
      errors: {
        _form: ["Erro ao atualizar workspace"],
      },
    };
  }
}

export async function deleteWorkspace(workspaceId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  try {
    // Verificar se usuário tem permissão
    const workspaceUser = await db.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: user.id,
        role: "ADMIN",
      },
    });

    if (!workspaceUser) {
      throw new Error("Sem permissão");
    }

    await db.workspace.delete({
      where: { id: workspaceId },
    });

    revalidatePath("/workspaces");
    return { success: true };
  } catch (error) {
    throw new Error("Erro ao deletar workspace");
  }
}

export async function getAllWorkspaces() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const workspaces = await db.workspace.findMany({
    where: {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return workspaces;
}
