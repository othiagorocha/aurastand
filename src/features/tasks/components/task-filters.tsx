// src/features/tasks/components/task-filters.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Filter className='h-5 w-5' />
            Filtros
            {stats && (
              <Badge variant='outline'>
                {stats.filtered} de {stats.total}
              </Badge>
            )}
          </CardTitle>
          <div className='flex items-center gap-2'>
            {hasActiveFilters && (
              <Button variant='ghost' size='sm' onClick={onClearFilters} className='text-red-600 hover:text-red-700'>
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
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          <Input
            placeholder='Buscar tarefas...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Filtros Expandidos */}
        {isExpanded && (
          <div className='space-y-4 pt-4 border-t'>
            {/* Status */}
            <div>
              <Label className='text-sm font-medium mb-3 block'>Status</Label>
              <div className='grid grid-cols-2 gap-2'>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <div key={status} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status as TaskStatus)}
                      onCheckedChange={() => handleStatusToggle(status as TaskStatus)}
                    />
                    <Label htmlFor={`status-${status}`} className='text-sm cursor-pointer flex items-center gap-2'>
                      <Badge className={config.color} variant='outline'>
                        {config.label}
                      </Badge>
                      {stats && <span className='text-xs text-gray-500'>({stats.byStatus[status as TaskStatus]})</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridade */}
            <div>
              <Label className='text-sm font-medium mb-3 block'>Prioridade</Label>
              <div className='grid grid-cols-2 gap-2'>
                {Object.entries(priorityConfig).map(([priority, config]) => (
                  <div key={priority} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority as TaskPriority)}
                      onCheckedChange={() => handlePriorityToggle(priority as TaskPriority)}
                    />
                    <Label htmlFor={`priority-${priority}`} className='text-sm cursor-pointer flex items-center gap-2'>
                      <Badge className={config.color} variant='outline'>
                        {config.label}
                      </Badge>
                      {stats && <span className='text-xs text-gray-500'>({stats.byPriority[priority as TaskPriority]})</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Range de Data */}
            <div>
              <Label className='text-sm font-medium mb-3 block'>Prazo de Vencimento</Label>
              <div className='grid grid-cols-2 gap-2'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline' className='justify-start text-left font-normal'>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {dueDateRange?.start ? dueDateRange.start.toLocaleDateString("pt-BR") : "Data inicial"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
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
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant='outline' className='justify-start text-left font-normal'>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {dueDateRange?.end ? dueDateRange.end.toLocaleDateString("pt-BR") : "Data final"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      mode='single'
                      selected={dueDateRange?.end}
                      onSelect={(date) =>
                        onDateRangeChange({
                          ...dueDateRange,
                          end: date,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {(dueDateRange?.start || dueDateRange?.end) && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => onDateRangeChange({})}
                  className='mt-2 text-red-600 hover:text-red-700'>
                  <X className='h-3 w-3 mr-1' />
                  Limpar datas
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Filtros Ativos */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 pt-2 border-t'>
            {selectedStatuses.map((status) => (
              <Badge
                key={status}
                variant='secondary'
                className='cursor-pointer hover:bg-red-100'
                onClick={() => handleStatusToggle(status)}>
                {statusConfig[status].label}
                <X className='h-3 w-3 ml-1' />
              </Badge>
            ))}
            {selectedPriorities.map((priority) => (
              <Badge
                key={priority}
                variant='secondary'
                className='cursor-pointer hover:bg-red-100'
                onClick={() => handlePriorityToggle(priority)}>
                {priorityConfig[priority].label}
                <X className='h-3 w-3 ml-1' />
              </Badge>
            ))}
            {searchTerm && (
              <Badge variant='secondary' className='cursor-pointer hover:bg-red-100' onClick={() => onSearchChange("")}>
                "{searchTerm}"
                <X className='h-3 w-3 ml-1' />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
