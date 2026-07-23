import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details?: any;

  constructor(message: string, statusCode = 500, errorCode = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

// Enterprise Axios Instance
export const httpClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Platform': 'Sniper-AI-Security-Platform',
    'X-Client-Version': '2.4.0-enterprise',
  },
});

// Request Interceptor: Auth & AbortController tracking
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('sniper_token') || 'demo_jwt_token_sha256';
    const companyId = localStorage.getItem('sniper_company_id') || 'comp_saudi_aramco_001';

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    if (companyId) {
      config.headers.set('X-Company-ID', companyId);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Error Normalization & Retry logic
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    // Retry transient 5xx errors up to 2 times with exponential delay
    if (error.response && error.response.status >= 500 && config && (config._retryCount || 0) < 2) {
      config._retryCount = (config._retryCount || 0) + 1;
      const backoffDelay = config._retryCount * 1000;
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return httpClient(config);
    }

    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      const message = responseData?.message || error.message || 'حدث خطأ في الاتصال بالخادم الرئيسي';
      const errorCode = responseData?.meta?.errorCode || `HTTP_${status}`;

      throw new AppError(message, status, errorCode, responseData?.data);
    } else if (error.request) {
      throw new AppError('تعذر الاتصال بخوادم الفحص الأمنية. يرجى التحقق من الشبكة.', 0, 'NETWORK_ERROR');
    }

    throw new AppError(error.message, 500, 'UNKNOWN_ERROR');
  }
);

// Helper function to create an AbortController for cancellable API calls
export const createAbortController = () => {
  return new AbortController();
};
