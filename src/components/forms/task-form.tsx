"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createTask } from "@/actions/task-actions";
import type { TaskFormState } from "@/types/form-states";

interface Project {
  id: string;
  name: string;
  workspace: {
    name: string;
  };
}

interface CreateTaskFormProps {
  projects: Project[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50'>
      {pending ? "Criando..." : "Criar Tarefa"}
    </button>
  );
}

const initialState: TaskFormState = {};

export function CreateTaskForm({ projects }: CreateTaskFormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState<TaskFormState, FormData>(createTask, initialState);

  useEffect(() => {
    if (state?.success) {
      router.push("/tasks");
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className='space-y-4'>
      <div>
        <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
          Título
        </label>
        <input
          type='text'
          id='title'
          name='title'
          required
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
        />
        {state?.errors?.title && <p className='mt-1 text-sm text-red-600'>{state.errors.title[0]}</p>}
      </div>

      <div>
        <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
          Descrição (opcional)
        </label>
        <textarea
          id='description'
          name='description'
          rows={3}
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
        />
        {state?.errors?.description && <p className='mt-1 text-sm text-red-600'>{state.errors.description[0]}</p>}
      </div>

      <div>
        <label htmlFor='projectId' className='block text-sm font-medium text-gray-700'>
          Projeto
        </label>
        <select
          id='projectId'
          name='projectId'
          required
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'>
          <option value=''>Selecione um projeto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.workspace.name} / {project.name}
            </option>
          ))}
        </select>
        {state?.errors?.projectId && <p className='mt-1 text-sm text-red-600'>{state.errors.projectId[0]}</p>}
      </div>

      <div>
        <label htmlFor='priority' className='block text-sm font-medium text-gray-700'>
          Prioridade
        </label>
        <select
          id='priority'
          name='priority'
          defaultValue='MEDIUM'
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'>
          <option value='LOW'>Baixa</option>
          <option value='MEDIUM'>Média</option>
          <option value='HIGH'>Alta</option>
          <option value='URGENT'>Urgente</option>
        </select>
        {state?.errors?.priority && <p className='mt-1 text-sm text-red-600'>{state.errors.priority[0]}</p>}
      </div>

      <div>
        <label htmlFor='dueDate' className='block text-sm font-medium text-gray-700'>
          Data de vencimento (opcional)
        </label>
        <input
          type='date'
          id='dueDate'
          name='dueDate'
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
        />
        {state?.errors?.dueDate && <p className='mt-1 text-sm text-red-600'>{state.errors.dueDate[0]}</p>}
      </div>

      {state?.errors?._form && (
        <div className='bg-red-50 border border-red-200 rounded-md p-3'>
          <p className='text-sm text-red-600'>{state.errors._form[0]}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
