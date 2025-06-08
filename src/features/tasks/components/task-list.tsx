"use client";
import { updateTaskStatus, deleteTask } from "@/actions/task-actions";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date | null;
  createdAt: Date;
  project: {
    name: string;
    workspace: {
      name: string;
    };
  };
}

interface TaskListProps {
  tasks: Task[];
}

const statusColors = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-blue-100 text-blue-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

const statusLabels = {
  TODO: "A fazer",
  IN_PROGRESS: "Em andamento",
  IN_REVIEW: "Em revisão",
  DONE: "Concluída",
};

const priorityLabels = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
};

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Nenhuma tarefa encontrada</h3>
        <p className='text-gray-600'>Crie sua primeira tarefa para começar a organizar seu trabalho.</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {tasks.map((task) => (
        <div key={task.id} className='bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6'>
          <div className='flex justify-between items-start'>
            <div className='flex-1'>
              <h3 className='text-lg font-medium text-gray-900'>{task.title}</h3>
              {task.description && <p className='text-gray-600 mt-1'>{task.description}</p>}

              <div className='flex items-center space-x-4 mt-3'>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[task.status]
                  }`}>
                  {statusLabels[task.status]}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    priorityColors[task.priority]
                  }`}>
                  {priorityLabels[task.priority]}
                </span>
              </div>

              <div className='flex items-center space-x-4 mt-3 text-sm text-gray-500'>
                <span>
                  {task.project.workspace.name} / {task.project.name}
                </span>
                {task.dueDate && <span>Vence em {task.dueDate.toLocaleDateString("pt-BR")}</span>}
                <span>Criada em {task.createdAt.toLocaleDateString("pt-BR")}</span>
              </div>
            </div>

            <div className='flex space-x-2'>
              <form action={updateTaskStatus.bind(null, task.id, task.status === "DONE" ? "TODO" : "DONE")}>
                <button
                  type='submit'
                  className={`text-sm ${
                    task.status === "DONE" ? "text-gray-600 hover:text-gray-800" : "text-green-600 hover:text-green-800"
                  }`}>
                  {task.status === "DONE" ? "Reabrir" : "Concluir"}
                </button>
              </form>
              <form action={deleteTask.bind(null, task.id)}>
                <button
                  type='submit'
                  className='text-red-600 hover:text-red-800 text-sm'
                  onClick={(e) => {
                    if (!confirm("Tem certeza que deseja deletar esta tarefa?")) {
                      e.preventDefault();
                    }
                  }}>
                  Deletar
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
