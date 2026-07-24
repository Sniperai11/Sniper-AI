export class ApiError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(message: string, statusCode: number = 500, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network failure. Please check your connection.') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized. Please login again.') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden. You do not have permission to perform this action.') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}
