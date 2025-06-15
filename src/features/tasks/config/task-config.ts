// src/features/tasks/config/task-config.ts
import { Circle, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { StatusConfig, PriorityConfig, TaskStatus, TaskPriority } from "../types";

export const statusConfig: Record<TaskStatus, StatusConfig> = {
  TODO: {
    label: "A fazer",
    color: "bg-gray-100 text-gray-800",
    icon: Circle,
  },
  IN_PROGRESS: {
    label: "Em andamento",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
  },
  IN_REVIEW: {
    label: "Em revisão",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  DONE: {
    label: "Concluída",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
};

export const priorityConfig: Record<TaskPriority, PriorityConfig> = {
  LOW: {
    label: "Baixa",
    color: "bg-gray-100 text-gray-800",
  },
  MEDIUM: {
    label: "Média",
    color: "bg-blue-100 text-blue-800",
  },
  HIGH: {
    label: "Alta",
    color: "bg-orange-100 text-orange-800",
  },
  URGENT: {
    label: "Urgente",
    color: "bg-red-100 text-red-800",
  },
};

export const statusOrder: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

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

export const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
