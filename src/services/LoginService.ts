import type { User, Token } from "../types/index.ts";
import { apiService } from './ApiService';

export const LoginService = {
  loginUser: async (user: User): Promise<Token> => {
    try {
      // El login no requiere autenticación previa
      const result = await apiService.post<{token: string, roles: string[]}>('/auth/login', user, false);
      
      // El backend devuelve { token: string, roles: string[] }
      const tokenData: Token = {
        token: result.token,
        roles: result.roles || []
      };
      
      return tokenData;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
}