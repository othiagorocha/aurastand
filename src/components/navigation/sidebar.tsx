"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  HomeIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  SparklesIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Workspaces", href: "/workspaces", icon: FolderIcon },
  { name: "Projetos", href: "/projects", icon: ClipboardDocumentListIcon },
  { name: "Tarefas", href: "/tasks", icon: ClipboardDocumentListIcon },
];

type SidebarMode = "expanded" | "collapsed" | "expand-on-hover";

export function Sidebar() {
  const pathname = usePathname();
  const { mode, setMode, isExpanded, isHovered, setHovered } = useSidebar();
  const [showControls, setShowControls] = useState(false);

  // Função para verificar se o link está ativo (incluindo subníveis)
  const isLinkActive = useCallback(
    (href: string) => {
      // Caso especial para a página inicial "/"
      if (href === "/") {
        return pathname === "/";
      }
      // Para outras rotas, verifica se a URL atual começa com o href
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // Handlers de mouse para o modo expand-on-hover
  const handleMouseEnter = useCallback(() => {
    if (mode === "expand-on-hover") {
      setHovered(true);
    }
  }, [mode, setHovered]);

  const handleMouseLeave = useCallback(() => {
    if (mode === "expand-on-hover") {
      setHovered(false);
    }
  }, [mode, setHovered]);

  // Handler para mudança de modo
  const handleModeChange = useCallback(
    (newMode: SidebarMode) => {
      setMode(newMode);
      setShowControls(false); // Fecha o painel ao mudar modo
    },
    [setMode]
  );

  // Toggle dos controles
  const handleToggleControls = useCallback(() => {
    setShowControls((prev) => !prev);
  }, []);

  // Componente para item de navegação com tooltip
  const NavigationItem = ({ item }: { item: (typeof navigation)[0] }) => {
    const isActive = isLinkActive(item.href);

    const linkContent = (
      <Link
        href={item.href}
        className={`
          group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative w-full
          ${
            isActive
              ? "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-lg backdrop-blur-sm"
              : "text-purple-200 hover:bg-purple-700/50 hover:text-white"
          }
          ${!isExpanded ? "justify-center" : ""}
        `}>
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
    );

    // Se não está expandida, wrappa com tooltip
    if (!isExpanded) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side='right' className='bg-gray-900 text-white border-gray-700'>
            {item.name}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={`
          fixed left-0 top-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl border-r border-purple-700/50 h-screen 
          transition-all duration-300 ease-in-out z-50 flex flex-col
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
            {navigation.map((item) => (
              <NavigationItem key={item.name} item={item} />
            ))}
          </div>
        </nav>

        {/* Controles da Sidebar */}
        <div className='border-t border-purple-700/50'>
          <div className='p-3'>
            {/* Botão de controle */}
            <div className='relative'>
              {!isExpanded ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleToggleControls}
                      className={`
                        group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                        text-purple-200 hover:bg-purple-700/50 hover:text-white justify-center
                      `}>
                      <CogIcon className='flex-shrink-0 h-5 w-5 transition-colors text-purple-300 group-hover:text-white' />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side='right' className='bg-gray-900 text-white border-gray-700'>
                    Sidebar control
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button
                  onClick={handleToggleControls}
                  className={`
                    group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                    text-purple-200 hover:bg-purple-700/50 hover:text-white
                  `}>
                  <CogIcon className='flex-shrink-0 h-5 w-5 transition-colors text-purple-300 group-hover:text-white mr-3' />
                  <span className='whitespace-nowrap font-medium'>Sidebar control</span>
                  <ChevronRightIcon
                    className={`
                      ml-auto h-4 w-4 transition-transform duration-200 text-purple-300 group-hover:text-white
                      ${showControls ? "rotate-90" : ""}
                    `}
                  />
                </button>
              )}

              {/* Painel de controles - Posicionamento absoluto */}
              {showControls && (
                <div
                  className={`
                    absolute z-50 bg-purple-800/95 backdrop-blur-sm border border-purple-600/50 rounded-lg shadow-xl p-4 w-64
                    ${isExpanded ? "bottom-full mb-2 left-0" : "left-full ml-2 bottom-0"}
                  `}>
                  <div className='space-y-3'>
                    <h4 className='text-sm font-semibold text-purple-200'>Modo da Sidebar</h4>
                    <div className='space-y-2'>
                      {(["expanded", "collapsed", "expand-on-hover"] as SidebarMode[]).map((m) => (
                        <label key={m} className='flex items-center space-x-3 cursor-pointer group'>
                          <input
                            type='radio'
                            name='sidebar-mode'
                            value={m}
                            checked={mode === m}
                            onChange={() => handleModeChange(m)}
                            className='w-3 h-3 text-purple-400 border-2 border-purple-400 focus:ring-purple-400 focus:ring-2 bg-transparent'
                          />
                          <span className='text-xs text-purple-200 group-hover:text-white transition-colors'>
                            {m === "expanded"
                              ? "Sempre expandida"
                              : m === "collapsed"
                              ? "Sempre recolhida"
                              : "Expandir ao passar mouse"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Seta indicadora */}
                  <div
                    className={`
                      absolute w-2 h-2 bg-purple-800/95 border-purple-600/50 transform rotate-45
                      ${isExpanded ? "top-full -mt-1 left-4 border-b border-r" : "right-full -mr-1 top-4 border-l border-b"}
                    `}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay para fechar controles quando clica fora */}
        {showControls && <div className='fixed inset-0 z-40' onClick={() => setShowControls(false)} />}

        {/* Aura effect */}
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-600/20 to-transparent pointer-events-none' />

        {/* Hint para expandir - só mostra quando apropriado */}
        {mode === "expand-on-hover" && !isExpanded && !isHovered && (
          <div className='absolute bottom-6 left-1/2 -translate-x-1/2'>
            <div className='text-purple-400 text-xs text-center'>
              <ChevronRightIcon className='h-4 w-4 mx-auto animate-pulse opacity-60' />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
