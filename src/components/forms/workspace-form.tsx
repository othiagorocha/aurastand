"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createWorkspace } from "@/actions/workspace-actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50'>
      {pending ? "Criando..." : "Criar Workspace"}
    </button>
  );
}

export function CreateWorkspaceForm() {
  const [state, formAction] = useFormState(createWorkspace, undefined);

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

      {state?.errors?._form && (
        <div className='bg-red-50 border border-red-200 rounded-md p-3'>
          <p className='text-sm text-red-600'>{state.errors._form[0]}</p>
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
