"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { Header } from "@/components/navigation/header";
import { useEffect, useState } from "react";

interface DashboardWrapperProps {
  children: React.ReactNode;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export function DashboardWrapper({ children, user }: DashboardWrapperProps) {
  const { isExpanded } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evita flash de conteúdo durante hidratação
  if (!mounted) {
    return (
      <div className='ml-16 flex flex-col min-w-0 min-h-screen transition-all duration-300'>
        <Header user={user} />
        <main className='flex-1 p-6 overflow-auto'>{children}</main>
      </div>
    );
  }

  return (
    <div
      className={`
        flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out
        ${isExpanded ? "ml-64" : "ml-16"}
      `}>
      <Header user={user} />
      <main className='flex-1 p-6 overflow-auto'>{children}</main>
    </div>
  );
}
