"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, FolderIcon, ClipboardDocumentListIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/workspaces", icon: HomeIcon },
  { name: "Workspaces", href: "/workspaces", icon: FolderIcon },
  { name: "Projetos", href: "/projects", icon: ClipboardDocumentListIcon },
  { name: "Tarefas", href: "/tasks", icon: ClipboardDocumentListIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className='w-64 bg-white shadow-sm h-screen'>
      <div className='p-6'>
        <h1 className='text-xl font-bold text-gray-900'>Task Manager</h1>
      </div>
      <nav className='mt-6'>
        <div className='px-3'>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium border-l-4 mb-1`}>
                <item.icon
                  className={`${
                    isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                  } mr-3 flex-shrink-0 h-6 w-6`}
                  aria-hidden='true'
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
