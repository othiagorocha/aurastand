// src/app/(dashboard)/tasks/complete/page.tsx (SERVER)
import { getAllTasks } from "@/actions/task-actions";
import { CompleteTasksClient } from "./complete-tasks-client";

export default async function CompleteTasksPage() {
  const tasks = await getAllTasks();

  return <CompleteTasksClient initialTasks={tasks} />;
}
