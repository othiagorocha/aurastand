"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  HomeIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Workspaces", href: "/workspaces", icon: FolderIcon },
  { name: "Projetos", href: "/projects", icon: ClipboardDocumentListIcon },
  { name: "Tarefas", href: "/tasks", icon: ClipboardDocumentListIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Aguarda a hidratação antes de carregar do localStorage
  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setIsCollapsed(savedState === "true");
    }
  }, []);

  // Salva o estado no localStorage apenas após montar
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-collapsed", isCollapsed.toString());
    }
  }, [isCollapsed, mounted]);

  // Determina se a sidebar deve estar expandida
  const isExpanded = !isCollapsed || isHovered;

  // Função para verificar se o link está ativo (incluindo subníveis)
  const isLinkActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // Função para alternar o estado fixo da sidebar
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Handlers de mouse com debounce para evitar o piscar
  const handleMouseEnter = useCallback(() => {
    if (isCollapsed) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      const timeout = setTimeout(() => {
        setIsHovered(true);
      }, 150); // Pequeno delay para evitar hover acidental
      setHoverTimeout(timeout);
    }
  }, [isCollapsed, hoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 300); // Delay maior para dar tempo de mover o mouse
    setHoverTimeout(timeout);
  }, [hoverTimeout]);

  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Evita renderização no servidor para prevenir hidratação mismatch
  if (!mounted) {
    return <SidebarSkeleton />;
  }

  // Componente skeleton inline
  function SidebarSkeleton() {
    return (
      <div className='w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl h-screen'>
        {/* Header Skeleton */}
        <div className='flex items-center w-full justify-between p-4 border-b border-purple-700/50 min-h-[65px]'>
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mr-3 shadow-lg'>
              <SparklesIcon className='h-5 w-5 text-white' />
            </div>
            <h1 className='text-lg font-bold text-white whitespace-nowrap'>Aurastand</h1>
          </div>
        </div>
        {/* Navigation Skeleton */}
        <nav className='mt-4 pb-4'>
          <div className='px-3 space-y-1'>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className='flex items-center px-3 py-2.5 rounded-xl'>
                <div className='h-5 w-5 bg-purple-300/20 rounded mr-3 animate-pulse'></div>
                <div className='h-4 w-20 bg-purple-300/20 rounded animate-pulse'></div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div
      className={`
        relative bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl border-r border-purple-700/50 h-screen 
        transition-all duration-300 ease-in-out z-40
        ${isExpanded ? "w-64" : "w-16"}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-purple-700/50 min-h-[65px]'>
        {/* Logo/Title */}
        <div className={`transition-all duration-300 ${isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          {isExpanded && (
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mr-3 shadow-lg'>
                <SparklesIcon className='h-5 w-5 text-white' />
              </div>
              <h1 className='text-lg font-bold text-white whitespace-nowrap'>Aurastand</h1>
            </div>
          )}
        </div>

        {/* Logo minificado quando collapsed - com melhor sizing */}
        {!isExpanded && (
          <div className='w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto shadow-lg'>
            <SparklesIcon className='h-6 w-6 text-white' />
          </div>
        )}

        {/* Botão de toggle */}
        <button
          onClick={toggleCollapsed}
          className={`
            p-1.5 rounded-lg hover:bg-purple-700/50 transition-all duration-200 group
            ${isExpanded ? "opacity-100" : "opacity-0 hover:opacity-100"}
          `}
          title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}>
          {isCollapsed ? (
            <ChevronRightIcon className='h-4 w-4 text-purple-200 group-hover:text-white' />
          ) : (
            <ChevronLeftIcon className='h-4 w-4 text-purple-200 group-hover:text-white' />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className='mt-4 pb-4'>
        <div className='px-3 space-y-1'>
          {navigation.map((item) => {
            const isActive = isLinkActive(item.href);

            return (
              <div key={item.name} className='relative'>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-lg backdrop-blur-sm"
                        : "text-purple-200 hover:bg-purple-700/50 hover:text-white"
                    }
                    ${!isExpanded ? "justify-center" : ""}
                  `}>
                  {/* Indicador ativo */}
                  {isActive && (
                    <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-300 to-pink-300 rounded-r-full shadow-sm' />
                  )}

                  <item.icon
                    className={`
                      flex-shrink-0 h-5 w-5 transition-colors
                      ${isActive ? "text-white drop-shadow-sm" : "text-purple-300 group-hover:text-white"}
                      ${isExpanded ? "mr-3" : ""}
                    `}
                    aria-hidden='true'
                  />

                  {/* Nome do item */}
                  <span
                    className={`
                      whitespace-nowrap transition-all duration-300 font-medium
                      ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 absolute"}
                    `}>
                    {item.name}
                  </span>
                </Link>

                {/* Tooltip para modo collapsed */}
                {!isExpanded && isHovered && (
                  <div className='absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none'>
                    <div className='bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-gray-700'>
                      {item.name}
                      <div className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700' />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Aura effect */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600/20 to-transparent pointer-events-none' />

      {/* Hint para expandir - apenas quando collapsed e não hovered */}
      {isCollapsed && !isHovered && (
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2'>
          <div className='text-purple-400 text-xs text-center'>
            <ChevronRightIcon className='h-4 w-4 mx-auto animate-pulse opacity-60' />
          </div>
        </div>
      )}
    </div>
  );
}
