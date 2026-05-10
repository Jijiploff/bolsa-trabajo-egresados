// Tipos reutilizables para el backend

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  rol: string;
}