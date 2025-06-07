import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Criar usuário de exemplo
  const hashedPassword = await hashPassword("123456");

  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Administrador",
      password: hashedPassword,
    },
  });

  // Criar workspace de exemplo
  const workspace = await prisma.workspace.upsert({
    where: { slug: "meu-workspace" },
    update: {},
    create: {
      name: "Meu Workspace",
      description: "Workspace de exemplo para testes",
      slug: "meu-workspace",
      users: {
        create: {
          userId: user.id,
          role: "ADMIN",
        },
      },
    },
  });

  // Criar projeto de exemplo
  const project = await prisma.project.upsert({
    where: { id: "example-project" },
    update: {},
    create: {
      id: "example-project",
      name: "Projeto Exemplo",
      description: "Um projeto de exemplo para demonstrar o sistema",
      workspaceId: workspace.id,
      userId: user.id,
      priority: "HIGH",
    },
  });

  // Criar tarefas de exemplo
  const tasks = [
    {
      title: "Configurar ambiente de desenvolvimento",
      description: "Instalar dependências e configurar o projeto",
      status: "DONE" as const,
      priority: "HIGH" as const,
    },
    {
      title: "Implementar autenticação",
      description: "Criar sistema de login e registro de usuários",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
    },
    {
      title: "Desenvolver interface de workspaces",
      description: "Criar páginas para gerenciar workspaces",
      status: "TODO" as const,
      priority: "MEDIUM" as const,
    },
    {
      title: "Implementar sistema de tarefas",
      description: "Criar funcionalidades para gerenciar tarefas",
      status: "TODO" as const,
      priority: "HIGH" as const,
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({
      data: {
        ...taskData,
        projectId: project.id,
        userId: user.id,
      },
    });
  }

  console.log("✅ Seed concluído com sucesso!");
  console.log("👤 Usuário criado: admin@example.com (senha: 123456)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
