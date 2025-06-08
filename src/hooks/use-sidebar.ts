import { useState, useEffect, useCallback } from "react";

type SidebarMode = "expanded" | "collapsed" | "expand-on-hover";

export function useSidebar() {
  const [mode, setMode] = useState<SidebarMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-mode") as SidebarMode;
      if (saved && ["expanded", "collapsed", "expand-on-hover"].includes(saved)) {
        return saved;
      }
      // Mantém compatibilidade com o estado anterior
      const oldCollapsed = localStorage.getItem("sidebar-collapsed");
      if (oldCollapsed === "true") {
        return "collapsed";
      }
    }
    return "expanded";
  });

  const [isHovered, setIsHovered] = useState(false);

  // Salva o estado no localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-mode", mode);
      // Remove o antigo localStorage para evitar conflitos
      localStorage.removeItem("sidebar-collapsed");
    }
  }, [mode]);

  const setModeCallback = useCallback((newMode: SidebarMode) => {
    setMode(newMode);
    // Se mudou para um modo que não usa hover, reseta o estado de hover
    if (newMode !== "expand-on-hover") {
      setIsHovered(false);
    }
  }, []);

  const setHovered = useCallback((hovered: boolean) => {
    setIsHovered(hovered);
  }, []);

  // Determina se está expandida com base no modo e hover
  const isExpanded = mode === "expanded" || (mode === "expand-on-hover" && isHovered);
  const isCollapsed = mode === "collapsed" || (mode === "expand-on-hover" && !isHovered);

  // Função toggle para compatibilidade com código existente
  const toggle = useCallback(() => {
    const newMode = mode === "expanded" ? "collapsed" : "expanded";
    setModeCallback(newMode);
  }, [mode, setModeCallback]);

  return {
    // Nova API
    mode,
    setMode: setModeCallback,

    // API compatível com código existente
    isCollapsed,
    isHovered,
    isExpanded,
    toggle,
    setHovered,
  };
}
