// src/types/form-states.ts

// Tipo base para estados de formulário
export interface BaseFormState {
  success?: boolean;
  message?: string;
}

// Estados específicos para cada formulário
export interface AuthFormState extends BaseFormState {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
}

export interface WorkspaceFormState extends BaseFormState {
  errors?: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export interface ProjectFormState extends BaseFormState {
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

export interface TaskFormState extends BaseFormState {
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
