// src/app/(dashboard)/tasks/new/task-create-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { statusConfig, priorityConfig } from "@/features/tasks/config/task-config";
import { TaskStatus, TaskPriority } from "@/features/tasks/types";
import { createTask } from "@/actions/task-actions";

interface Project {
  id: string;
  name: string;
  workspace: {
    id: string;
    name: string;
  };
}

interface WorkspaceUser {
  id: string;
  name: string | null;
  email: string;
}

interface TaskCreateClientProps {
  projects: Project[];
  workspaceUsers: WorkspaceUser[];
  defaultProjectId: string;
}

export function TaskCreateClient({ projects, workspaceUsers: initialWorkspaceUsers, defaultProjectId }: TaskCreateClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceUsers, setWorkspaceUsers] = useState(initialWorkspaceUsers);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO" as TaskStatus,
    priority: "MEDIUM" as TaskPriority,
    dueDate: "",
    projectId: defaultProjectId,
    assigneeId: "",
  });

  const handleProjectChange = async (projectId: string) => {
    setFormData({ ...formData, projectId, assigneeId: "" });

    // Buscar usuários do workspace do projeto selecionado
    const selectedProject = projects.find((p) => p.id === projectId);
    if (selectedProject) {
      try {
        const response = await fetch(`/api/workspaces/${selectedProject.workspace.id}/users`);
        if (response.ok) {
          const users = await response.json();
          setWorkspaceUsers(users);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários do workspace:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.projectId) {
      alert("Título e projeto são obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createTask({
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        projectId: formData.projectId,
        assigneeId: formData.assigneeId || null,
      });

      if (result.success) {
        router.push(`/tasks/${result.taskId}`);
      } else {
        alert("Erro ao criar tarefa");
      }
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao criar tarefa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' onClick={() => router.back()}>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Voltar
        </Button>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Nova Tarefa</h1>
          <p className='text-gray-600'>Crie uma nova tarefa para organizar seu trabalho</p>
        </div>
      </div>

      {/* Form */}
      <div className='max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle>Informações da Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Title */}
              <div>
                <Label htmlFor='title'>Título *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder='Digite o título da tarefa'
                  className='mt-1'
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor='description'>Descrição</Label>
                <Textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Descreva os detalhes da tarefa'
                  className='mt-1'
                  rows={4}
                />
              </div>

              {/* Project */}
              <div>
                <Label htmlFor='project'>Projeto *</Label>
                <Select value={formData.projectId} onValueChange={handleProjectChange} required>
                  <SelectTrigger className='mt-1'>
                    <SelectValue placeholder='Selecionar projeto' />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name} ({project.workspace.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status and Priority */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='status'>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}>
                    <SelectTrigger className='mt-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor='priority'>Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}>
                    <SelectTrigger className='mt-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <Label htmlFor='dueDate'>Prazo</Label>
                <Input
                  id='dueDate'
                  type='date'
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className='mt-1'
                />
              </div>

              {/* Assignee */}
              {workspaceUsers.length > 0 && (
                <div>
                  <Label htmlFor='assignee'>Atribuir a</Label>
                  <Select value={formData.assigneeId} onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}>
                    <SelectTrigger className='mt-1'>
                      <SelectValue placeholder='Selecionar usuário' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=''>Não atribuir</SelectItem>
                      {workspaceUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Submit Button */}
              <div className='flex justify-end pt-4'>
                <Button type='submit' disabled={isLoading}>
                  <Save className='h-4 w-4 mr-2' />
                  {isLoading ? "Criando..." : "Criar Tarefa"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
