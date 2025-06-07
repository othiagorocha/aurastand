"use client";

import { logoutUser } from "@/actions/auth-actions";

interface HeaderProps {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className='bg-white shadow-sm border-b'>
      <div className='px-6 py-4 flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Gerenciador de Tarefas</h1>
        <div className='flex items-center space-x-4'>
          <span className='text-sm text-gray-700'>Olá, {user.name || user.email}</span>
          <form action={logoutUser}>
            <button type='submit' className='text-sm text-gray-500 hover:text-gray-700'>
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
