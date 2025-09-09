import type { DiaDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const DiaService = {
  getDias: async (): Promise<DiaDTO[]> => {
    try {
      const result = await apiService.get<DiaDTO[]>('/dias');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  // No hay endpoint GET /{id} en el controller provisto

  createDia: async (dia: DiaDTO): Promise<DiaDTO | string> => {
    try {
      const result = await apiService.post<DiaDTO | string>('/dias', dia);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  // PUT /{cod} recibe sólo el nombre en el body (String)
  updateDia: async (codDia: number, dia: DiaDTO): Promise<DiaDTO | string> => {
    try {
      const result = await apiService.put<DiaDTO | string>(`/dias/${codDia}`, dia.nombreDia);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaDia: async (codDia: number): Promise<DiaDTO | string> => {
    try {
      const result = await apiService.put<DiaDTO | string>(`/dias/${codDia}/baja`);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};

  
