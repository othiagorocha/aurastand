import Link from "next/link";
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

interface ProjectListProps {
  projects: Project[];
}

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  ARCHIVED: "bg-red-100 text-red-800",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

const statusLabels = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  ARCHIVED: "Arquivado",
};

const priorityLabels = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Nenhum projeto encontrado</h3>
        <p className='text-gray-600'>Crie seu primeiro projeto para começar a organizar suas tarefas.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {projects.map((project) => (
        <div key={project.id} className='bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <Link href={`/projects/${project.id}`} className='text-lg font-medium text-gray-900 hover:text-blue-600'>
                {project.name}
              </Link>
              {project.description && <p className='text-gray-600 mt-1'>{project.description}</p>}

              <div className='flex items-center space-x-4 mt-3'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[project.status]
                  }`}>
                  {statusLabels[project.status]}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    priorityColors[project.priority]
                  }`}>
                  {priorityLabels[project.priority]}
                </span>
              </div>

              <div className='flex items-center space-x-4 mt-3 text-sm text-gray-500'>
                <span>{project.workspace.name}</span>
                <span>{project._count.tasks} tarefas</span>
                {project.startDate && <span>Iniciado em {project.startDate.toLocaleDateString("pt-BR")}</span>}
                {project.endDate && <span>Termina em {project.endDate.toLocaleDateString("pt-BR")}</span>}
                <span>Criado em {project.createdAt.toLocaleDateString("pt-BR")}</span>
              </div>
            </div>

            <div className='flex space-x-2'>
              <Link href={`/projects/${project.id}`} className='text-blue-600 hover:text-blue-800'>
                Ver
              </Link>
              <form action={deleteProject.bind(null, project.id)}>
                <button
                  type='submit'
                  className='text-red-600 hover:text-red-800'
                  onClick={(e) => {
                    if (!confirm("Tem certeza que deseja deletar este projeto?")) {
                      e.preventDefault();
                    }
                  }}>
                  Deletar
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
