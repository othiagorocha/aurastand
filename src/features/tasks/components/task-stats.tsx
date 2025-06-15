// src/features/tasks/components/task-stats.tsx (SERVER)
import { Task } from "../types";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    inReview: tasks.filter((t) => t.status === "IN_REVIEW").length,
    done: tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <div className='bg-white rounded-lg shadow p-4'>
        <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
        <div className='text-sm text-gray-600'>Total</div>
      </div>
      {/* ... more stats */}
    </div>
  );
}
