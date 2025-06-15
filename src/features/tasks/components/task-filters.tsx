// src/features/tasks/components/task-filters.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, X, CalendarIcon, ChevronDown } from "lucide-react";
import { statusConfig, priorityConfig } from "../config/task-config";
import { TaskStatus, TaskPriority } from "../types";

interface TaskFiltersProps {
  searchTerm?: string;
  onSearchChange: (term: string) => void;
  selectedStatuses?: TaskStatus[];
  onStatusChange: (statuses: TaskStatus[]) => void;
  selectedPriorities?: TaskPriority[];
  onPriorityChange: (priorities: TaskPriority[]) => void;
  dueDateRange?: { start?: Date; end?: Date };
  onDateRangeChange: (range: { start?: Date; end?: Date }) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  stats?: {
    total: number;
    filtered: number;
    byStatus: Record<TaskStatus, number>;
    byPriority: Record<TaskPriority, number>;
  };
}

export function TaskFilters({
  searchTerm = "",
  onSearchChange,
  selectedStatuses = [],
  onStatusChange,
  selectedPriorities = [],
  onPriorityChange,
  dueDateRange,
  onDateRangeChange,
  onClearFilters,
  hasActiveFilters,
  stats,
}: TaskFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusToggle = (status: TaskStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusChange(newStatuses);
  };

  const handlePriorityToggle = (priority: TaskPriority) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter((p) => p !== priority)
      : [...selectedPriorities, priority];
    onPriorityChange(newPriorities);
  };

  const formatDateRange = () => {
    if (!dueDateRange?.start && !dueDateRange?.end) return "Selecionar período";

    const start = dueDateRange.start ? dueDateRange.start.toLocaleDateString() : "...";
    const end = dueDateRange.end ? dueDateRange.end.toLocaleDateString() : "...";

    return `${start} - ${end}`;
  };

  return (
    <Card className='w-full'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg font-semibold flex items-center gap-2'>
            <Filter className='h-5 w-5' />
            Filtros
            {hasActiveFilters && (
              <Badge variant='secondary' className='ml-2'>
                {stats?.filtered || 0} de {stats?.total || 0}
              </Badge>
            )}
          </CardTitle>
          <div className='flex items-center gap-2'>
            {hasActiveFilters && (
              <Button variant='ghost' size='sm' onClick={onClearFilters}>
                <X className='h-4 w-4 mr-1' />
                Limpar
              </Button>
            )}
            <Button variant='ghost' size='sm' onClick={() => setIsExpanded(!isExpanded)}>
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Busca */}
        <div className='space-y-2'>
          <Label htmlFor='search'>Buscar</Label>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              id='search'
              placeholder='Buscar por título, descrição ou projeto...'
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className='pl-9'
            />
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Status */}
            <div className='space-y-3'>
              <Label>Status</Label>
              <div className='grid grid-cols-2 gap-2'>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <div key={status} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status as TaskStatus)}
                      onCheckedChange={() => handleStatusToggle(status as TaskStatus)}
                    />
                    <Label htmlFor={`status-${status}`} className='text-sm font-normal cursor-pointer flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full' style={{ backgroundColor: config.color }} />
                      {config.label}
                      {stats && (
                        <Badge variant='outline' className='text-xs'>
                          {stats.byStatus[status as TaskStatus] || 0}
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridade */}
            <div className='space-y-3'>
              <Label>Prioridade</Label>
              <div className='grid grid-cols-2 gap-2'>
                {Object.entries(priorityConfig).map(([priority, config]) => (
                  <div key={priority} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority as TaskPriority)}
                      onCheckedChange={() => handlePriorityToggle(priority as TaskPriority)}
                    />
                    <Label
                      htmlFor={`priority-${priority}`}
                      className='text-sm font-normal cursor-pointer flex items-center gap-2'>
                      <div className='w-2 h-2 rounded-full' style={{ backgroundColor: config.color }} />
                      {config.label}
                      {stats && (
                        <Badge variant='outline' className='text-xs'>
                          {stats.byPriority[priority as TaskPriority] || 0}
                        </Badge>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Data de Vencimento */}
            <div className='space-y-3'>
              <Label>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='w-full justify-start text-left font-normal'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <div className='p-3 space-y-3'>
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Data Inicial</Label>
                      <Calendar
                        mode='single'
                        selected={dueDateRange?.start}
                        onSelect={(date) =>
                          onDateRangeChange({
                            ...dueDateRange,
                            start: date,
                          })
                        }
                        initialFocus
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-sm font-medium'>Data Final</Label>
                      <Calendar
                        mode='single'
                        selected={dueDateRange?.end}
                        onSelect={(date) =>
                          onDateRangeChange({
                            ...dueDateRange,
                            end: date,
                          })
                        }
                      />
                    </div>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='sm' onClick={() => onDateRangeChange({})} className='flex-1'>
                        Limpar
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtros Rápidos */}
            <div className='space-y-3'>
              <Label>Filtros Rápidos</Label>
              <div className='flex flex-wrap gap-2'>
                <Button variant='outline' size='sm' onClick={() => onStatusChange(["TODO", "IN_PROGRESS"])}>
                  Tarefas Ativas
                </Button>
                <Button variant='outline' size='sm' onClick={() => onPriorityChange(["HIGH", "URGENT"])}>
                  Alta Prioridade
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    const today = new Date();
                    const endOfWeek = new Date(today);
                    endOfWeek.setDate(today.getDate() + 7);
                    onDateRangeChange({ start: today, end: endOfWeek });
                  }}>
                  Vence esta Semana
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Resumo dos Filtros Ativos */}
        {hasActiveFilters && (
          <div className='pt-3 border-t'>
            <div className='flex flex-wrap gap-2'>
              {selectedStatuses.length > 0 && (
                <Badge variant='secondary'>
                  Status: {selectedStatuses.join(", ")}
                  <Button variant='ghost' size='sm' className='ml-1 h-auto p-0' onClick={() => onStatusChange([])}>
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              )}
              {selectedPriorities.length > 0 && (
                <Badge variant='secondary'>
                  Prioridade: {selectedPriorities.join(", ")}
                  <Button variant='ghost' size='sm' className='ml-1 h-auto p-0' onClick={() => onPriorityChange([])}>
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              )}
              {searchTerm && (
                <Badge variant='secondary'>
                  Busca: &quot;{searchTerm}&quot;
                  <Button variant='ghost' size='sm' className='ml-1 h-auto p-0' onClick={() => onSearchChange("")}>
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              )}
              {dueDateRange && (dueDateRange.start || dueDateRange.end) && (
                <Badge variant='secondary'>
                  Data: {formatDateRange()}
                  <Button variant='ghost' size='sm' className='ml-1 h-auto p-0' onClick={() => onDateRangeChange({})}>
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
