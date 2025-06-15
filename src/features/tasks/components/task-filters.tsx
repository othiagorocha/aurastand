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
import { TaskStatus, TaskPriority, FilterStats } from "../types";

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
          <CardTitle className='flex items-center gap-2'>
            <Filter className='h-4 w-4' />
            Filtros
          </CardTitle>
          <div className='flex items-center gap-2'>
            {hasActiveFilters && (
              <Button variant='outline' size='sm' onClick={onClearFilters}>
                <X className='h-3 w-3 mr-1' />
                Limpar
              </Button>
            )}
            <Button variant='ghost' size='sm' onClick={() => setIsExpanded(!isExpanded)}>
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </div>

        {stats && (
          <div className='flex items-center gap-4 text-sm text-gray-600'>
            <span>Total: {stats.total}</span>
            <span>Filtrado: {stats.filtered}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Busca */}
        <div className='space-y-2'>
          <Label htmlFor='search'>Buscar tarefas</Label>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              id='search'
              placeholder='Digite para buscar...'
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
              <div className='flex flex-wrap gap-2'>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <div key={status} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`status-${status}`}
                      checked={selectedStatuses.includes(status as TaskStatus)}
                      onCheckedChange={() => handleStatusToggle(status as TaskStatus)}
                    />
                    <Label htmlFor={`status-${status}`} className='text-sm font-normal cursor-pointer'>
                      <Badge variant='secondary' className={config.color}>
                        {config.label}
                        {stats && ` (${stats.byStatus[status as TaskStatus] || 0})`}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Prioridade */}
            <div className='space-y-3'>
              <Label>Prioridade</Label>
              <div className='flex flex-wrap gap-2'>
                {Object.entries(priorityConfig).map(([priority, config]) => (
                  <div key={priority} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={selectedPriorities.includes(priority as TaskPriority)}
                      onCheckedChange={() => handlePriorityToggle(priority as TaskPriority)}
                    />
                    <Label htmlFor={`priority-${priority}`} className='text-sm font-normal cursor-pointer'>
                      <Badge variant='secondary' className={config.color}>
                        {config.label}
                        {stats && ` (${stats.byPriority[priority as TaskPriority] || 0})`}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Data de vencimento */}
            <div className='space-y-3'>
              <Label>Data de vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' className='w-full justify-start text-left font-normal'>
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='range'
                    selected={{
                      from: dueDateRange?.start,
                      to: dueDateRange?.end,
                    }}
                    onSelect={(range) => {
                      onDateRangeChange({
                        start: range?.from,
                        end: range?.to,
                      });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
