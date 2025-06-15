// src/app/(dashboard)/tasks/complete/complete-tasks-client.tsx (CLIENT)
"use client";

import { TaskViews } from "@/features/tasks/components/task-views";
import { TaskFilters } from "@/features/tasks/components/task-filters";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { Task } from "@/features/tasks/types";

interface CompleteTasksClientProps {
  initialTasks: Task[];
}

export function CompleteTasksClient({ initialTasks }: CompleteTasksClientProps) {
  const { filteredTasks, filters, updateFilter } = useTaskFilters(initialTasks);

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked:", task);
    // Handle task click
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-1'>
          <TaskFilters
            searchTerm={filters.searchTerm}
            onSearchChange={(term) => updateFilter("searchTerm", term)}
            // ... other filter props
          />
        </div>
        <div className='lg:col-span-3'>
          <TaskViews tasks={filteredTasks} onTaskClick={handleTaskClick} />
        </div>
      </div>
    </div>
  );
}
