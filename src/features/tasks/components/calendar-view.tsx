// src/features/tasks/components/calendar-view.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { statusConfig, monthNames, dayNames } from "../config/task-config";
import { TaskViewProps, Task } from "../types";
import { TaskCard } from "./task-card";

interface CalendarViewProps extends TaskViewProps {
  onTaskClick?: (task: Task) => void;
}

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Agrupar tarefas por data
  const tasksByDate = tasks.reduce((acc, task) => {
    if (task.dueDate) {
      const dateKey = task.dueDate.toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  // Gerar dias do mês atual
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());

  const days = [];
  const currentDay = new Date(startDate);

  while (days.length < 42) {
    // 6 semanas
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const tasksWithoutDate = tasks.filter((task) => !task.dueDate);

  return (
    <div className='space-y-6'>
      {/* Cabeçalho do calendário */}
      <div className='flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={() => navigateMonth("prev")}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='sm' onClick={goToToday}>
            Hoje
          </Button>
          <Button variant='outline' size='sm' onClick={() => navigateMonth("next")}>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Grade do calendário */}
      <div className='grid grid-cols-7 gap-1 bg-white rounded-lg border'>
        {/* Cabeçalho dos dias da semana */}
        {dayNames.map((day) => (
          <div key={day} className='p-3 text-center text-sm font-medium text-gray-500 border-b'>
            {day}
          </div>
        ))}

        {/* Células dos dias */}
        {days.map((day, index) => {
          const dayTasks = tasksByDate[day.toDateString()] || [];
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b ${isCurrentMonth ? "bg-white" : "bg-gray-50"} ${
                isToday ? "ring-2 ring-blue-500 ring-inset" : ""
              }`}>
              <div
                className={`text-sm font-medium mb-1 ${isCurrentMonth ? "text-gray-900" : "text-gray-400"} ${
                  isToday ? "text-blue-600" : ""
                }`}>
                {day.getDate()}
              </div>

              <div className='space-y-1'>
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${statusConfig[task.status].color}`}
                    title={task.title}
                    onClick={() => onTaskClick?.(task)}>
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && <div className='text-xs text-gray-500'>+{dayTasks.length - 2} mais</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tarefas sem data */}
      {tasksWithoutDate.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Tarefas sem prazo definido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3'>
              {tasksWithoutDate.map((task) => (
                <TaskCard key={task.id} task={task} compact onClick={onTaskClick} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
