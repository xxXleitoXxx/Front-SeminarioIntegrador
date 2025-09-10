import type { ConfHorarioTipoClaseDTO } from "../types/index.ts";
import { apiService } from './ApiService';
const BASE_URL= "/cronograma"
export const ConfHorarioTipoClaseService = {
  getConfiguraciones: async (): Promise<ConfHorarioTipoClaseDTO[]> => {
    try {
      const result = await apiService.get<ConfHorarioTipoClaseDTO[]>('/cronograma');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  crearConfiguracion: async (configuracion: ConfHorarioTipoClaseDTO): Promise<ConfHorarioTipoClaseDTO | string> => {
    try {
const result = await apiService.post<ConfHorarioTipoClaseDTO>(`${BASE_URL}`,configuracion);
return result;

    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
