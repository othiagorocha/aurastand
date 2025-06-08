// src/components/forms/project-form.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createProject } from "@/actions/project-actions";
import type { ProjectFormState } from "@/types/form-states";

interface Workspace {
  id: string;
  name: string;
}

interface CreateProjectFormProps {
  workspaces: Workspace[];
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50'>
      {pending ? "Criando..." : "Criar Projeto"}
    </button>
  );
}

const initialState: ProjectFormState = {};

export function CreateProjectForm({ workspaces }: CreateProjectFormProps) {
  const router = useRouter();
  const [state, formAction] = useFormState<ProjectFormState, FormData>(createProject, initialState);

  useEffect(() => {
    if (state?.success) {
      router.push("/projects");
    }
  }, [state?.success, router]);

  return (
    <form action={formAction} className='space-y-4'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          Nome
        </label>
        <input
          type='text'
          id='name'
          name='name'
          required
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
        />
        {state?.errors?.name && <p className='mt-1 text-sm text-red-600'>{state.errors.name[0]}</p>}
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
        <label htmlFor='workspaceId' className='block text-sm font-medium text-gray-700'>
          Workspace
        </label>
        <select
          id='workspaceId'
          name='workspaceId'
          required
          className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'>
          <option value=''>Selecione um workspace</option>
          {workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
        {state?.errors?.workspaceId && <p className='mt-1 text-sm text-red-600'>{state.errors.workspaceId[0]}</p>}
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

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
            Data de início (opcional)
          </label>
          <input
            type='date'
            id='startDate'
            name='startDate'
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
          {state?.errors?.startDate && <p className='mt-1 text-sm text-red-600'>{state.errors.startDate[0]}</p>}
        </div>

        <div>
          <label htmlFor='endDate' className='block text-sm font-medium text-gray-700'>
            Data de término (opcional)
          </label>
          <input
            type='date'
            id='endDate'
            name='endDate'
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
          {state?.errors?.endDate && <p className='mt-1 text-sm text-red-600'>{state.errors.endDate[0]}</p>}
        </div>
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
