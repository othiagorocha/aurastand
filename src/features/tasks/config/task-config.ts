// src/features/tasks/config/task-config.ts
import {
  Circle,
  Clock,
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  // CircleIcon,
  // CircleDotDashed,
  // CircleDot,
  // CircleCheck
} from "lucide-react";
import { StatusConfig, PriorityConfig, TaskStatus, TaskPriority } from "../types";

export const statusConfig: Record<TaskStatus, StatusConfig> = {
  [TaskStatus.BACKLOG]: {
    label: "Backlog",
    color: "border-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
    icon: CircleDashed,
  },
  [TaskStatus.TODO]: {
    label: "A fazer",
    color: "border-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
    icon: Circle,
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "Em andamento",
    color: "border-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-100",
    icon: Clock,
  },
  [TaskStatus.IN_REVIEW]: {
    label: "Em revisão",
    color: "border-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-100",
    icon: AlertCircle,
  },
  [TaskStatus.DONE]: {
    label: "Concluída",
    color: "border-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
    icon: CheckCircle2,
  },
};

export const priorityConfig: Record<TaskPriority, PriorityConfig> = {
  [TaskPriority.LOW]: {
    label: "Baixa",
    color: "bg-gray-100 text-gray-800",
  },
  [TaskPriority.MEDIUM]: {
    label: "Média",
    color: "bg-blue-100 text-blue-800",
  },
  [TaskPriority.HIGH]: {
    label: "Alta",
    color: "bg-orange-100 text-orange-800",
  },
  [TaskPriority.URGENT]: {
    label: "Urgente",
    color: "bg-red-100 text-red-800",
  },
};

// Ordem dos status para o kanban e outras visualizações
export const statusOrder: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

// Nomes dos meses para o calendário
export const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

// Nomes dos dias para o calendário
export const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
