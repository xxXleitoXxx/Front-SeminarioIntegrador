import type { ClaseDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const ClaseService = {
  getClases: async (): Promise<ClaseDTO[]> => {
    try {
      const result = await apiService.get<ClaseDTO[]>('/clases');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getClase: async (nroClase: number): Promise<ClaseDTO> => {
    try {
      const result = await apiService.get<ClaseDTO>(`/clases/${nroClase}`);
      return typeof result === 'object' ? result : {} as ClaseDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};

