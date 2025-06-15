// src/features/projects/components/project-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/actions/project-actions";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  workspace: {
    name: string;
  };
  _count: {
    tasks: number;
  };
}

interface ProjectCardProps {
  project: Project;
  onDelete?: (projectId: string) => void;
}

const statusConfig = {
  ACTIVE: { label: "Ativo", color: "bg-green-100 text-green-800" },
  INACTIVE: { label: "Inativo", color: "bg-gray-100 text-gray-800" },
  ARCHIVED: { label: "Arquivado", color: "bg-red-100 text-red-800" },
};

const priorityConfig = {
  LOW: { label: "Baixa", color: "bg-gray-100 text-gray-800" },
  MEDIUM: { label: "Média", color: "bg-blue-100 text-blue-800" },
  HIGH: { label: "Alta", color: "bg-orange-100 text-orange-800" },
  URGENT: { label: "Urgente", color: "bg-red-100 text-red-800" },
};

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/projects/${project.id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja deletar este projeto?")) {
      try {
        await deleteProject(project.id);
        onDelete?.(project.id);
      } catch (error) {
        console.error("Erro ao deletar projeto:", error);
        alert("Erro ao deletar projeto");
      }
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card className='cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]' onClick={handleCardClick}>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-lg mb-2'>{project.name}</CardTitle>
            <div className='flex items-center gap-2 mb-2'>
              <Badge className={statusConfig[project.status].color}>{statusConfig[project.status].label}</Badge>
              <Badge className={priorityConfig[project.priority].color}>{priorityConfig[project.priority].label}</Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className='h-4 w-4 mr-2' />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className='text-red-600'>
                <Trash2 className='h-4 w-4 mr-2' />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        {project.description && <p className='text-gray-600 text-sm mb-4 line-clamp-2'>{project.description}</p>}

        <div className='space-y-3'>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-1 text-gray-500'>
              <Users className='h-4 w-4' />
              <span>
                {project._count.tasks} tarefa{project._count.tasks !== 1 ? "s" : ""}
              </span>
            </div>

            <div className='text-gray-500'>{project.workspace.name}</div>
          </div>

          {(project.startDate || project.endDate) && (
            <div className='flex items-center gap-1 text-sm text-gray-500'>
              <Calendar className='h-4 w-4' />
              <span>
                {project.startDate && new Date(project.startDate).toLocaleDateString("pt-BR")}
                {project.startDate && project.endDate && " - "}
                {project.endDate && new Date(project.endDate).toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}

          <div className='text-xs text-gray-400'>Criado em {new Date(project.createdAt).toLocaleDateString("pt-BR")}</div>
        </div>
      </CardContent>
    </Card>
  );
}
