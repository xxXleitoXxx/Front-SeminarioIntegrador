import type { TipoClaseDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const TipoClaseService = {
  getTipoClases: async (): Promise<TipoClaseDTO[]> => {
    try {
      const result = await apiService.get<TipoClaseDTO[]>('/tipoclases');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getTipoClase: async (codTipoClase: number): Promise<TipoClaseDTO> => {
    try {
      const result = await apiService.get<TipoClaseDTO>(`/tipoclases/${codTipoClase}`);
      return typeof result === 'object' ? result : {} as TipoClaseDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createTipoClase: async (tipoClase: TipoClaseDTO): Promise<TipoClaseDTO | string> => {
    try {
      const result = await apiService.post<TipoClaseDTO | string>('/tipoclases', tipoClase);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateTipoClase: async (codTipoClase: number, tipoClase: TipoClaseDTO): Promise<TipoClaseDTO | string> => {
    try {
      const result = await apiService.put<TipoClaseDTO | string>(`/tipoclases/${codTipoClase}`, tipoClase);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaTipoClase: async (codTipoClase: number): Promise<TipoClaseDTO | string> => {
    try {
      const result = await apiService.put<TipoClaseDTO | string>(`/tipoclases/${codTipoClase}/baja`);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
