// src/app/(auth)/register/page.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { registerUser } from "@/actions/auth-actions";
import type { AuthFormState } from "@/types/form-states";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50'>
      {pending ? "Criando conta..." : "Criar conta"}
    </button>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useFormState<AuthFormState, FormData>(registerUser, undefined);

  useEffect(() => {
    if (state?.success) {
      router.push("/workspaces");
    }
  }, [state?.success, router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Crie sua conta</h2>
        </div>
        <form className='mt-8 space-y-6' action={formAction}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                Nome
              </label>
              <input
                id='name'
                name='name'
                type='text'
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              {state?.errors?.name && <p className='mt-1 text-sm text-red-600'>{state.errors.name[0]}</p>}
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              {state?.errors?.email && <p className='mt-1 text-sm text-red-600'>{state.errors.email[0]}</p>}
            </div>
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Senha
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              />
              {state?.errors?.password && <p className='mt-1 text-sm text-red-600'>{state.errors.password[0]}</p>}
            </div>
          </div>

          {state?.errors?._form && (
            <div className='bg-red-50 border border-red-200 rounded-md p-3'>
              <p className='text-sm text-red-600'>{state.errors._form[0]}</p>
            </div>
          )}

          <SubmitButton />

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              Já tem uma conta?{" "}
              <a href='/login' className='font-medium text-blue-600 hover:text-blue-500'>
                Faça login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
