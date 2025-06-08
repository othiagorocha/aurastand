// src/types/actions.ts

export interface FormState<T = any> {
  success?: boolean;
  errors?: {
    [K in keyof T]?: string[];
  } & {
    _form?: string[];
  };
  data?: T;
}

export interface AuthFormState extends FormState {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
}

export interface WorkspaceFormState extends FormState {
  errors?: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export interface ProjectFormState extends FormState {
  errors?: {
    name?: string[];
    description?: string[];
    workspaceId?: string[];
    priority?: string[];
    startDate?: string[];
    endDate?: string[];
    _form?: string[];
  };
}

export interface TaskFormState extends FormState {
  errors?: {
    title?: string[];
    description?: string[];
    projectId?: string[];
    priority?: string[];
    status?: string[];
    dueDate?: string[];
    _form?: string[];
  };
}
