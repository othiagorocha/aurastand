// src/features/projects/components/project-list.tsx
"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";

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

export function ProjectList({ projects: initialProjects }: ProjectListProps) {
  const [projects, setProjects] = useState(initialProjects);

  const handleProjectDelete = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  if (projects.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Nenhum projeto encontrado</h3>
        <p className='text-gray-600'>Crie seu primeiro projeto para começar a organizar suas tarefas.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onDelete={handleProjectDelete} />
      ))}
    </div>
  );
}
