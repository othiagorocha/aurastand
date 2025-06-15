// src/app/api/workspaces/[id]/users/route.ts
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verificar se o usuário tem acesso ao workspace
    const workspace = await db.workspace.findFirst({
      where: {
        id,
        users: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Buscar usuários do workspace
    const users = await db.user.findMany({
      where: {
        workspaces: {
          some: {
            workspaceId: id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching workspace users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
