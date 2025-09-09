import type { HorarioiDiaxTipoClaseDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const HorarioiDiaxTipoClaseService = {
  getHorariosPorConf: async (confId: number): Promise<HorarioiDiaxTipoClaseDTO[]> => {
    try {
      const result = await apiService.get<HorarioiDiaxTipoClaseDTO[]>(`/horario/${confId}`);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
