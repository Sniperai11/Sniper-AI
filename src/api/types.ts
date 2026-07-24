export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp?: string;
}

// Re-export specific models below
export * from '../types/models';
