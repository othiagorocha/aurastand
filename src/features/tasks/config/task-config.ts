// src/features/tasks/config/task-config.ts
import { TaskStatus, TaskPriority } from "../types";

export const statusConfig: Record<TaskStatus, { label: string; color: string; textColor: string; bgColor: string }> = {
  BACKLOG: {
    label: "Backlog",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  TODO: {
    label: "Para Fazer",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  IN_PROGRESS: {
    label: "Em Progresso",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  IN_REVIEW: {
    label: "Em Revisão",
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  DONE: {
    label: "Concluído",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
  },
};

export const priorityConfig: Record<TaskPriority, { label: string; color: string; textColor: string; bgColor: string }> = {
  LOW: {
    label: "Baixa",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  MEDIUM: {
    label: "Média",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  HIGH: {
    label: "Alta",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  URGENT: {
    label: "Urgente",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-100",
  },
};
