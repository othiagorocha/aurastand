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
import { TaskStatus, TaskPriority, FilterStats } from "../types";
import { statusConfig, priorityConfig } from "../config/task-config";

export interface TaskFiltersProps {
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
  stats?: FilterStats;
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
          <CardTitle className='text-lg font-medium flex items-center gap-2'>
            <Filter className='h-4 w-4' />
            Filtros
            {stats && (
              <Badge variant='secondary' className='ml-2'>
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
            type='text'
            placeholder='Buscar tarefas...'
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className='pl-10'
          />
        </div>

        {isExpanded && (
          <>
            {/* Status */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Status</Label>
              <div className='flex flex-wrap gap-2'>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <div
                    key={status}
                    className='flex items-center space-x-2 cursor-pointer'
                    onClick={() => handleStatusToggle(status as TaskStatus)}>
                    <Checkbox checked={selectedStatuses.includes(status as TaskStatus)} onChange={() => {}} />
                    <div className='flex items-center gap-2'>
                      <div className={`w-3 h-3 rounded-full ${config.color}`} />
                      <span className='text-sm'>{config.label}</span>
                      {stats && (
                        <Badge variant='outline' className='text-xs'>
                          {stats.byStatus[status as TaskStatus] || 0}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridade */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Prioridade</Label>
              <div className='flex flex-wrap gap-2'>
                {Object.entries(priorityConfig).map(([priority, config]) => (
                  <div
                    key={priority}
                    className='flex items-center space-x-2 cursor-pointer'
                    onClick={() => handlePriorityToggle(priority as TaskPriority)}>
                    <Checkbox checked={selectedPriorities.includes(priority as TaskPriority)} onChange={() => {}} />
                    <div className='flex items-center gap-2'>
                      <div className={`w-3 h-3 rounded-full ${config.color}`} />
                      <span className='text-sm'>{config.label}</span>
                      {stats && (
                        <Badge variant='outline' className='text-xs'>
                          {stats.byPriority[priority as TaskPriority] || 0}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data de Vencimento */}
            <div className='space-y-2'>
              <Label className='text-sm font-medium'>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='w-full justify-start'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <div className='p-3 space-y-3'>
                    <div>
                      <Label className='text-sm'>Data de início</Label>
                      <Calendar
                        mode='single'
                        selected={dueDateRange?.start}
                        onSelect={(date) =>
                          onDateRangeChange({
                            start: date,
                            end: dueDateRange?.end,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className='text-sm'>Data de fim</Label>
                      <Calendar
                        mode='single'
                        selected={dueDateRange?.end}
                        onSelect={(date) =>
                          onDateRangeChange({
                            start: dueDateRange?.start,
                            end: date,
                          })
                        }
                      />
                    </div>
                    <Button variant='outline' size='sm' onClick={() => onDateRangeChange({})} className='w-full'>
                      Limpar datas
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        {/* Filtros Ativos */}
        {hasActiveFilters && (
          <div className='flex flex-wrap gap-2 pt-2 border-t'>
            {selectedStatuses.map((status) => (
              <Badge key={status} variant='secondary' className='cursor-pointer'>
                {statusConfig[status].label}
                <X className='h-3 w-3 ml-1' onClick={() => handleStatusToggle(status)} />
              </Badge>
            ))}
            {selectedPriorities.map((priority) => (
              <Badge key={priority} variant='secondary' className='cursor-pointer'>
                {priorityConfig[priority].label}
                <X className='h-3 w-3 ml-1' onClick={() => handlePriorityToggle(priority)} />
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
