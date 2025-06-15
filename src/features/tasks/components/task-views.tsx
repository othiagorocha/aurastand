// src/features/tasks/components/task-views.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Calendar, Kanban } from "lucide-react";
import { TaskViewProps, Task } from "../types";
import { TableView } from "./table-view";
import { CalendarView } from "./calendar-view";
import { KanbanView } from "./kanban-view";

interface TaskViewsProps extends TaskViewProps {
  defaultView?: "table" | "kanban" | "calendar";
  onTaskClick?: (task: Task) => void;
}

export function TaskViews({ tasks, defaultView = "table", onTaskClick }: TaskViewsProps) {
  return (
    <div className='w-full'>
      <Tabs defaultValue={defaultView} className='w-full'>
        <TabsList className='grid w-full grid-cols-3 lg:w-[400px]'>
          <TabsTrigger value='table' className='flex items-center gap-2'>
            <Table className='h-4 w-4' />
            Tabela
          </TabsTrigger>
          <TabsTrigger value='kanban' className='flex items-center gap-2'>
            <Kanban className='h-4 w-4' />
            Kanban
          </TabsTrigger>
          <TabsTrigger value='calendar' className='flex items-center gap-2'>
            <Calendar className='h-4 w-4' />
            Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value='table' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Table className='h-5 w-5' />
                Visualização em Tabela
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TableView tasks={tasks} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='kanban' className='mt-6'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Kanban className='h-5 w-5' />
              <h2 className='text-xl font-semibold'>Board Kanban</h2>
            </div>
            <KanbanView tasks={tasks} onTaskClick={onTaskClick} />
          </div>
        </TabsContent>

        <TabsContent value='calendar' className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Visualização em Calendário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarView tasks={tasks} onTaskClick={onTaskClick} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
