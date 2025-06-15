// src/app/(dashboard)/tasks/[id]/task-detail-client.tsx
"use client";

import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { updateTask } from "@/actions/task-actions";
import type { TaskFormState } from "@/types/form-states";
import type { Task } from "@/features/tasks/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkspaceUser {
  id: string;
  name: string | null;
  email: string;
}

// ✅ Interface corrigida com workspaceUsers
interface TaskDetailClientProps {
  task: Task;
  workspaceUsers: WorkspaceUser[]; // ✅ Adicionado workspaceUsers
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending} className='w-full'>
      {pending ? "Atualizando..." : "Atualizar Tarefa"}
    </Button>
  );
}

const initialState: TaskFormState = {};

export function TaskDetailClient({ task, workspaceUsers }: TaskDetailClientProps) {
  const router = useRouter();
  const [state, formAction] = useActionState<TaskFormState, FormData>(updateTask, initialState);

  useEffect(() => {
    if (state?.success) {
      router.push("/tasks");
    }
  }, [state?.success, router]);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-900'>Editar Tarefa</h1>
        <Button variant='outline' onClick={() => router.back()}>
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className='space-y-4'>
            {/* ID oculto da tarefa */}
            <input type='hidden' name='id' value={task.id} />

            <div>
              <Label htmlFor='title'>Título</Label>
              <Input id='title' name='title' defaultValue={task.title} required className='mt-1' />
              {state?.errors?.title && <p className='mt-1 text-sm text-red-600'>{state.errors.title[0]}</p>}
            </div>

            <div>
              <Label htmlFor='description'>Descrição</Label>
              <Textarea id='description' name='description' defaultValue={task.description || ""} rows={3} className='mt-1' />
              {state?.errors?.description && <p className='mt-1 text-sm text-red-600'>{state.errors.description[0]}</p>}
            </div>

            <div>
              <Label htmlFor='status'>Status</Label>
              <Select name='status' defaultValue={task.status}>
                <SelectTrigger className='mt-1'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='TODO'>A Fazer</SelectItem>
                  <SelectItem value='IN_PROGRESS'>Em Andamento</SelectItem>
                  <SelectItem value='IN_REVIEW'>Em Revisão</SelectItem>
                  <SelectItem value='DONE'>Concluído</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.status && <p className='mt-1 text-sm text-red-600'>{state.errors.status[0]}</p>}
            </div>

            <div>
              <Label htmlFor='priority'>Prioridade</Label>
              <Select name='priority' defaultValue={task.priority}>
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

            {/* ✅ Campo de assignee usando workspaceUsers */}
            <div>
              <Label htmlFor='assigneeId'>Atribuir para</Label>
              <Select name='assigneeId' defaultValue={task.assigneeId || undefined}>
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
              <Label htmlFor='dueDate'>Data de Vencimento</Label>
              <Input
                id='dueDate'
                name='dueDate'
                type='date'
                defaultValue={task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""}
                className='mt-1'
              />
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

      {/* ✅ Informações adicionais da tarefa */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <p>
              <strong>Projeto:</strong> {task.project.name}
            </p>
            <p>
              <strong>Workspace:</strong> {task.project.workspace.name}
            </p>
            <p>
              <strong>Criada em:</strong> {task.createdAt.toLocaleDateString("pt-BR")}
            </p>
            <p>
              <strong>Última atualização:</strong> {task.updatedAt.toLocaleDateString("pt-BR")}
            </p>
            {task.assignee && (
              <p>
                <strong>Atribuída para:</strong> {task.assignee.name || task.assignee.email}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
