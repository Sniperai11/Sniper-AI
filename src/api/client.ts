import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from './config/env';
import { ApiError, NetworkError, UnauthorizedError, ForbiddenError } from './errors/ApiError';
import { getToken, setToken, clearToken, getRefreshToken } from './auth/tokenManager';
import { Logger } from './utils/logger';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Validate request URL against base URL to prevent accidental exposure
    if (config.url?.startsWith('http') && !config.url.startsWith(env.API_URL)) {
      Logger.warn('Security Warning: API request directed to external URL', { url: config.url });
    }

    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = new axios.AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    // If response.data is HTML string from SPA fallback (e.g. <!DOCTYPE html>), treat as endpoint not found
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
      throw new AxiosError('API Endpoint not found (HTML fallback returned)', 'ERR_BAD_REQUEST', response.config, response.request, {
        status: 404,
        statusText: 'Not Found',
        headers: response.headers,
        config: response.config,
        data: { success: false, message: 'API Endpoint not found' }
      });
    }
    // Unpack standard API response envelope if it exists
    if (response.data && typeof response.data === 'object' && response.data.success !== undefined) {
       return response.data;
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config;

    // Network error or timeout
    if (!error.response) {
      Logger.warn('Network connection note:', error.message);
      return Promise.reject(new NetworkError(error.message));
    }

    const { status, data } = error.response;
    const message = data?.message || error.message;
    const errors = data?.errors || [];

    // 401 Unauthorized Handling (with refresh logic)
    if (status === 401 && originalRequest) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            // Attempt token refresh
            const response = await axios.post(`${env.API_URL}/auth/refresh`, { refreshToken });
            const newToken = response.data.data?.token;
            
            if (newToken) {
              setToken(newToken);
              processQueue(null, newToken);
              isRefreshing = false;
              
              if (!originalRequest.headers) {
                originalRequest.headers = new axios.AxiosHeaders();
              }
              originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
              return apiClient(originalRequest);
            }
          }
          throw new Error('No refresh token available or missing token in response');
        } catch (refreshError) {
          clearToken();
          processQueue(refreshError, null);
          isRefreshing = false;
          // Dispatch auth event for application routing
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
          Logger.warn('Session expired due to refresh failure');
          return Promise.reject(new UnauthorizedError('Session expired. Please log in again.'));
        }
      }

      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (!originalRequest.headers) {
          originalRequest.headers = new axios.AxiosHeaders();
        }
        originalRequest.headers.set('Authorization', `Bearer ${token}`);
        return apiClient(originalRequest);
      }).catch((err) => Promise.reject(err));
    }

    // 403 Forbidden Handling
    if (status === 403) {
      Logger.warn('Forbidden access attempt', { url: originalRequest?.url });
      return Promise.reject(new ForbiddenError(message));
    }

    // Generic API Error
    Logger.error(`API Error [${status}]`, { message, errors, url: originalRequest?.url });
    return Promise.reject(new ApiError(message, status, errors));
  }
);
