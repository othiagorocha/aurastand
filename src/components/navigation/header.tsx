"use client";

import { logoutUser } from "@/actions/auth-actions";
import { UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className='bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50'>
      <div className='px-6 py-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <h1 className='text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Gerenciador de Projetos
          </h1>
          <div className='ml-3 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full'>
            <span className='text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
              Aurastand
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          {/* User info */}
          <div className='flex items-center space-x-3 px-4 py-2 bg-gray-50/80 rounded-xl border border-gray-200/50'>
            <UserCircleIcon className='h-5 w-5 text-purple-600' />
            <span className='text-sm font-medium text-gray-700'>Olá, {user.name || user.email}</span>
          </div>

          {/* Logout button */}
          <form action={logoutUser}>
            <button
              type='submit'
              className='flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50/50 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200'
              title='Sair'>
              <ArrowRightOnRectangleIcon className='h-4 w-4' />
              <span>Sair</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
