// src/app/(dashboard)/tasks/[id]/task-detail-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Save, X, Trash2, Calendar, User, Building } from "lucide-react";
import { statusConfig, priorityConfig } from "@/features/tasks/config/task-config";
import { TaskStatus, TaskPriority } from "@/features/tasks/types";
import { updateTask, deleteTask } from "@/actions/task-actions";

interface TaskWithDetails {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  project: {
    id: string;
    name: string;
    workspace: {
      id: string;
      name: string;
    };
  };
  assignee: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface WorkspaceUser {
  id: string;
  name: string | null;
  email: string;
}

interface TaskDetailClientProps {
  task: TaskWithDetails;
  workspaceUsers: WorkspaceUser[];
}

export function TaskDetailClient({ task: initialTask, workspaceUsers }: TaskDetailClientProps) {
  const router = useRouter();
  const [task, setTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    assigneeId: task.assignee?.id || "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateTask(task.id, {
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        assigneeId: formData.assigneeId || null,
      });

      if (result.success) {
        // Atualizar o estado local
        setTask({
          ...task,
          title: formData.title,
          description: formData.description || null,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
          assignee: formData.assigneeId ? workspaceUsers.find((u) => u.id === formData.assigneeId) || null : null,
        });
        setIsEditing(false);
      } else {
        alert("Erro ao atualizar tarefa");
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Erro ao atualizar tarefa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      setIsLoading(true);
      try {
        await deleteTask(task.id);
        router.push("/tasks");
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        alert("Erro ao deletar tarefa");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      assigneeId: task.assignee?.id || "",
    });
    setIsEditing(false);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Voltar
          </Button>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Detalhes da Tarefa</h1>
            <div className='text-sm text-gray-500'>
              {task.project.workspace.name} / {task.project.name}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {!isEditing ? (
            <>
              <Button variant='outline' onClick={() => setIsEditing(true)}>
                <Edit className='h-4 w-4 mr-2' />
                Editar
              </Button>
              <Button variant='destructive' onClick={handleDelete} disabled={isLoading}>
                <Trash2 className='h-4 w-4 mr-2' />
                Deletar
              </Button>
            </>
          ) : (
            <>
              <Button variant='outline' onClick={handleCancel}>
                <X className='h-4 w-4 mr-2' />
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                <Save className='h-4 w-4 mr-2' />
                Salvar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Task Details */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Informações da Tarefa</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Title */}
              <div>
                <Label htmlFor='title'>Título</Label>
                {isEditing ? (
                  <Input
                    id='title'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className='mt-1'
                  />
                ) : (
                  <div className='mt-1 text-lg font-medium'>{task.title}</div>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor='description'>Descrição</Label>
                {isEditing ? (
                  <Textarea
                    id='description'
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className='mt-1'
                    rows={4}
                  />
                ) : (
                  <div className='mt-1 text-gray-700'>{task.description || "Nenhuma descrição fornecida"}</div>
                )}
              </div>

              {/* Status and Priority */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='status'>Status</Label>
                  {isEditing ? (
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
                  ) : (
                    <div className='mt-1'>
                      <Badge className={statusConfig[task.status].color}>{statusConfig[task.status].label}</Badge>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor='priority'>Prioridade</Label>
                  {isEditing ? (
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
                  ) : (
                    <div className='mt-1'>
                      <Badge className={priorityConfig[task.priority].color}>{priorityConfig[task.priority].label}</Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <Label htmlFor='dueDate'>Prazo</Label>
                {isEditing ? (
                  <Input
                    id='dueDate'
                    type='date'
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className='mt-1'
                  />
                ) : (
                  <div className='mt-1 flex items-center gap-2'>
                    <Calendar className='h-4 w-4 text-gray-500' />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString("pt-BR") : "Nenhum prazo definido"}
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div>
                <Label htmlFor='assignee'>Atribuída a</Label>
                {isEditing ? (
                  <Select value={formData.assigneeId} onValueChange={(value) => setFormData({ ...formData, assigneeId: value })}>
                    <SelectTrigger className='mt-1'>
                      <SelectValue placeholder='Selecionar usuário' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=''>Não atribuída</SelectItem>
                      {workspaceUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className='mt-1 flex items-center gap-2'>
                    <User className='h-4 w-4 text-gray-500' />
                    {task.assignee ? `${task.assignee.name || task.assignee.email}` : "Não atribuída"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Building className='h-5 w-5' />
                Projeto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='font-medium'>{task.project.name}</div>
                <div className='text-sm text-gray-500'>{task.project.workspace.name}</div>
              </div>
            </CardContent>
          </Card>

          {/* Creator Info */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5' />
                Criada por
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='font-medium'>{task.user.name || task.user.email}</div>
                <div className='text-sm text-gray-500'>{new Date(task.createdAt).toLocaleString("pt-BR")}</div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <Card>
            <CardHeader>
              <CardTitle>Última Atualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-gray-500'>{new Date(task.updatedAt).toLocaleString("pt-BR")}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
