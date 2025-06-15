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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Dias do mês anterior para completar a primeira semana
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - i);
      days.push({ date: day, isCurrentMonth: false });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push({ date, isCurrentMonth: true });
    }

    // Dias do próximo mês para completar a última semana
    const remainingCells = 42 - days.length; // 6 semanas × 7 dias
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const tasksWithoutDate = tasks.filter((task) => !task.dueDate);

  return (
    <div className='space-y-6'>
      {/* Header do calendário */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={() => navigateMonth("prev")}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='sm' onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <Button variant='outline' size='sm' onClick={() => navigateMonth("next")}>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Grade do calendário */}
      <div className='grid grid-cols-7 gap-1 bg-white rounded-lg border overflow-hidden'>
        {/* Cabeçalho dos dias da semana */}
        {dayNames.map((day: string) => (
          <div key={day} className='p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 border-b'>
            {day}
          </div>
        ))}

        {/* Dias do calendário */}
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dayTasks = getTasksForDate(date);
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-b border-r last:border-r-0 ${isCurrentMonth ? "bg-white" : "bg-gray-50"} ${
                isToday ? "ring-2 ring-blue-500 ring-inset" : ""
              }`}>
              <div
                className={`text-sm font-medium mb-1 ${isCurrentMonth ? "text-gray-900" : "text-gray-400"} ${
                  isToday ? "text-blue-600" : ""
                }`}>
                {date.getDate()}
              </div>

              <div className='space-y-1'>
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                      statusConfig[task.status].bgColor
                    } ${statusConfig[task.status].textColor}`}
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
