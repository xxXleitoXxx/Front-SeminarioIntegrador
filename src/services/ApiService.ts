import { handleResponse } from './common/handleResponse';

const BASE_URL = 'http://localhost:8080/api/v1';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      requiresAuth = true
    } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Agregar token de autenticación si es requerido
    if (requiresAuth) {
      Object.assign(requestHeaders, this.getAuthHeaders());
    }

    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body) {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error en ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET', requiresAuth });
  }

  async post<T>(endpoint: string, data?: any, requiresAuth: boolean = true): Promise<T> {
    return this.makeRequest<T>(endpoint, { 
      method: 'POST', 
      body: data, 
      requiresAuth 
    });
  }

  async put<T>(endpoint: string, data?: any, requiresAuth: boolean = true): Promise<T> {
    return this.makeRequest<T>(endpoint, { 
      method: 'PUT', 
      body: data, 
      requiresAuth 
    });
  }

  async delete<T>(endpoint: string, requiresAuth: boolean = true): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', requiresAuth });
  }

  async patch<T>(endpoint: string, data?: any, requiresAuth: boolean = true): Promise<T> {
    return this.makeRequest<T>(endpoint, { 
      method: 'PATCH', 
      body: data, 
      requiresAuth 
    });
  }
}

export const apiService = new ApiService();
