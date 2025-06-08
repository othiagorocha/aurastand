"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  HomeIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  SparklesIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { SidebarSkeleton } from "./sidebar-skeleton";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Workspaces", href: "/workspaces", icon: FolderIcon },
  { name: "Projetos", href: "/projects", icon: ClipboardDocumentListIcon },
  { name: "Tarefas", href: "/tasks", icon: ClipboardDocumentListIcon },
];

type SidebarMode = "expanded" | "collapsed" | "expand-on-hover";

export function Sidebar() {
  const pathname = usePathname();
  const [mode, setMode] = useState<SidebarMode>("expanded");
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showControls, setShowControls] = useState(false);

  // Aguarda a hidratação antes de carregar do localStorage
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("sidebar-mode") as SidebarMode;
    if (savedMode && ["expanded", "collapsed", "expand-on-hover"].includes(savedMode)) {
      setMode(savedMode);
    }
  }, []);

  // Salva o estado no localStorage apenas após montar
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebar-mode", mode);
    }
  }, [mode, mounted]);

  // Determina se a sidebar deve estar expandida
  const isExpanded = mode === "expanded" || (mode === "expand-on-hover" && isHovered);

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

  // Handlers de mouse com debounce para evitar o piscar
  const handleMouseEnter = useCallback(() => {
    if (mode === "expand-on-hover") {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      const timeout = setTimeout(() => setIsHovered(true), 150);
      setHoverTimeout(timeout);
    }
  }, [mode, hoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    if (mode === "expand-on-hover") {
      const timeout = setTimeout(() => {
        setIsHovered(false);
        setShowControls(false);
      }, 300);
      setHoverTimeout(timeout);
    }
  }, [hoverTimeout, mode]);

  // Cleanup do timeout
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  // Evita renderização no servidor para prevenir hidratação mismatch
  if (!mounted) {
    return <SidebarSkeleton />;
  }

  return (
    <div
      className={`
        relative bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl border-r border-purple-700/50 h-screen 
        transition-all duration-300 ease-in-out z-40 flex flex-col
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

        {/* Logo minificado quando collapsed */}
        {!isExpanded && (
          <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mx-auto shadow-lg'>
            <SparklesIcon className='h-5 w-5 text-white' />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 mt-4 pb-4'>
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

      {/* Controles da Sidebar */}
      <div className='border-t border-purple-700/50'>
        <div className='p-3'>
          <button
            onClick={() => setShowControls((prev) => !prev)}
            className={`
              group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
              text-purple-200 hover:bg-purple-700/50 hover:text-white
              ${!isExpanded ? "justify-center" : ""}
            `}
            title='Controles da Sidebar'>
            <CogIcon
              className={`
                flex-shrink-0 h-5 w-5 transition-colors text-purple-300 group-hover:text-white
                ${isExpanded ? "mr-3" : ""}
              `}
            />
            <span
              className={`
                whitespace-nowrap transition-all duration-300 font-medium
                ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 absolute"}
              `}>
              Sidebar control
            </span>
            {isExpanded && (
              <ChevronRightIcon
                className={`
                  ml-auto h-4 w-4 transition-transform duration-200 text-purple-300 group-hover:text-white
                  ${showControls ? "rotate-90" : ""}
                `}
              />
            )}
          </button>
        </div>

        {/* Painel de controles */}
        {showControls && (
          <div className='px-3 pb-3 space-y-2'>
            <div
              className={`
                bg-purple-800/50 rounded-lg p-3 space-y-3
                transition-opacity duration-200
                ${isExpanded ? "opacity-100" : "opacity-30 pointer-events-none"}
              `}>
              {/* Opções de modo */}
              <div className='space-y-2'>
                {(["expanded", "collapsed", "expand-on-hover"] as SidebarMode[]).map((m) => (
                  <label key={m} className='flex items-center space-x-3 cursor-pointer group'>
                    <input
                      type='radio'
                      name='sidebar-mode'
                      value={m}
                      checked={mode === m}
                      onChange={() => setMode(m)}
                      className='w-3 h-3 text-purple-400 border-2 border-purple-400 focus:ring-purple-400 focus:ring-2'
                    />
                    <span className='text-xs text-purple-200 group-hover:text-white'>
                      {m === "expanded" ? "Expanded" : m === "collapsed" ? "Collapsed" : "Expand on hover"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tooltip para controles quando collapsed */}
        {!isExpanded && (
          <div className='absolute left-full bottom-16 ml-3 z-50 pointer-events-none'>
            <div className='bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-gray-700'>
              Sidebar control
              <div className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700' />
            </div>
          </div>
        )}
      </div>

      {/* Aura effect */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600/20 to-transparent pointer-events-none' />

      {/* Hint para expandir */}
      {!isExpanded && !isHovered && (
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2'>
          <div className='text-purple-400 text-xs text-center'>
            <ChevronRightIcon className='h-4 w-4 mx-auto animate-pulse opacity-60' />
          </div>
        </div>
      )}
    </div>
  );
}
