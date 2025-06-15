// src/app/(dashboard)/tasks/new/task-create-client.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { createTask } from "@/actions/task-actions";
import type { TaskFormState } from "@/types/form-states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

// ✅ Interface atualizada para incluir workspaceUsers
interface TaskCreateClientProps {
  projects: Project[];
  workspaceUsers: WorkspaceUser[]; // ✅ Adicionado
  defaultProjectId?: string; // ✅ Opcional
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className='w-full'>
      {pending ? "Criando..." : "Criar Tarefa"}
    </Button>
  );
}

const initialState: TaskFormState = {};

export function TaskCreateClient({ projects, workspaceUsers, defaultProjectId }: TaskCreateClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("projectId");

  // Priorizar projectId da URL, depois defaultProjectId
  const initialProjectId = projectIdFromUrl || defaultProjectId;

  const [state, formAction] = useFormState<TaskFormState, FormData>(createTask, initialState);

  useEffect(() => {
    if (state?.success) {
      // Se taskId estiver disponível, redirecionar para a tarefa criada
      if (state.taskId) {
        router.push(`/tasks/${state.taskId}`);
      } else {
        // Caso contrário, redirecionar para a lista de tarefas
        router.push("/tasks");
      }
    }
  }, [state?.success, state?.taskId, router]);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Nova Tarefa</h1>
        <Button variant='outline' onClick={() => router.back()}>
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className='space-y-4'>
            <div>
              <Label htmlFor='title'>Título</Label>
              <Input id='title' name='title' placeholder='Digite o título da tarefa' required className='mt-1' />
              {state?.errors?.title && <p className='mt-1 text-sm text-red-600'>{state.errors.title[0]}</p>}
            </div>

            <div>
              <Label htmlFor='description'>Descrição (opcional)</Label>
              <Textarea
                id='description'
                name='description'
                placeholder='Descreva a tarefa em detalhes'
                rows={3}
                className='mt-1'
              />
              {state?.errors?.description && <p className='mt-1 text-sm text-red-600'>{state.errors.description[0]}</p>}
            </div>

            <div>
              <Label htmlFor='projectId'>Projeto</Label>
              <Select name='projectId' defaultValue={initialProjectId || undefined}>
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Selecione um projeto' />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.workspace.name} / {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {state?.errors?.projectId && <p className='mt-1 text-sm text-red-600'>{state.errors.projectId[0]}</p>}
            </div>

            {/* ✅ Campo de assignee (opcional) usando workspaceUsers */}
            <div>
              <Label htmlFor='assigneeId'>Atribuir para (opcional)</Label>
              <Select name='assigneeId'>
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Nenhum usuário atribuído' />
                </SelectTrigger>
                <SelectContent>
                  {workspaceUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email.split("@")[0]} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='priority'>Prioridade</Label>
              <Select name='priority' defaultValue='MEDIUM'>
                <SelectTrigger className='mt-1'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='LOW'>Baixa</SelectItem>
                  <SelectItem value='MEDIUM'>Média</SelectItem>
                  <SelectItem value='HIGH'>Alta</SelectItem>
                  <SelectItem value='URGENT'>Urgente</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.priority && <p className='mt-1 text-sm text-red-600'>{state.errors.priority[0]}</p>}
            </div>

            <div>
              <Label htmlFor='dueDate'>Data de Vencimento (opcional)</Label>
              <Input id='dueDate' name='dueDate' type='date' className='mt-1' />
              {state?.errors?.dueDate && <p className='mt-1 text-sm text-red-600'>{state.errors.dueDate[0]}</p>}
            </div>

            {state?.errors?._form && (
              <div className='rounded-md bg-red-50 p-4'>
                <p className='text-sm text-red-600'>{state.errors._form[0]}</p>
              </div>
            )}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
