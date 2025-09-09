import type { LocalidadDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const LocalidadService = {
  getLocalidades: async (): Promise<LocalidadDTO[]> => {
    try {
      const result = await apiService.get<LocalidadDTO[]>('/localidades');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  // No se utiliza GET por id en los controladores provistos

  createLocalidad: async (localidad: LocalidadDTO): Promise<LocalidadDTO | string> => {
    try {
      const result = await apiService.post<LocalidadDTO | string>('/localidades', localidad);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateLocalidad: async (localidad: LocalidadDTO): Promise<LocalidadDTO | string> => {
    try {
      const result = await apiService.put<LocalidadDTO | string>(`/localidades/${localidad.codLocalidad}`, { 
        codLocalidad: localidad.codLocalidad, 
        nombreLocalidad: localidad.nombreLocalidad 
      });
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  // En backend realizan baja lógica por PUT /{cod}/baja
  deleteLocalidad: async (id: number): Promise<string> => {
    try {
      const result = await apiService.put<string>(`/localidades/${id}/baja`);
      return result || "Localidad eliminada exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
}; 