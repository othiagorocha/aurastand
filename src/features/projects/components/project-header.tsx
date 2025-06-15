// src/features/projects/components/project-header.tsx (SERVER COMPONENT)
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Users } from "lucide-react";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date;
    user: {
      name: string | null;
      email: string;
    };
    _count: {
      tasks: number;
    };
  };
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

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className='bg-white rounded-lg shadow-sm border p-6'>
      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-3'>
            <h1 className='text-3xl font-bold text-gray-900'>{project.name}</h1>
            <div className='flex gap-2'>
              <Badge className={statusConfig[project.status].color}>{statusConfig[project.status].label}</Badge>
              <Badge className={priorityConfig[project.priority].color}>{priorityConfig[project.priority].label}</Badge>
            </div>
          </div>

          {project.description && <p className='text-gray-600 text-lg mb-4'>{project.description}</p>}

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm'>
            <div className='flex items-center gap-2 text-gray-600'>
              <Users className='h-4 w-4' />
              <span>{project._count.tasks} tarefas</span>
            </div>

            <div className='flex items-center gap-2 text-gray-600'>
              <User className='h-4 w-4' />
              <span>Por {project.user.name || project.user.email}</span>
            </div>

            {project.startDate && (
              <div className='flex items-center gap-2 text-gray-600'>
                <Calendar className='h-4 w-4' />
                <span>Início: {project.startDate.toLocaleDateString("pt-BR")}</span>
              </div>
            )}

            {project.endDate && (
              <div className='flex items-center gap-2 text-gray-600'>
                <Clock className='h-4 w-4' />
                <span>Término: {project.endDate.toLocaleDateString("pt-BR")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
