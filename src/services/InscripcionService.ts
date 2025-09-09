import type { InscripcionDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const InscripcionService = {
  getInscripciones: async (): Promise<InscripcionDTO[]> => {
    try {
      const result = await apiService.get<InscripcionDTO[]>('/Inscripcion');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getInscripcion: async (nroInscripcion: number): Promise<InscripcionDTO> => {
    try {
      const result = await apiService.get<InscripcionDTO>(`/Inscripcion/${nroInscripcion}`);
      return typeof result === 'object' ? result : {} as InscripcionDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  inscribirAlumno: async (dni: number, codTipoClase: number): Promise<InscripcionDTO | string> => {
    try {
      const result = await apiService.post<InscripcionDTO | string>(`/Inscripcion/${dni}/${codTipoClase}`);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaInscripcion: async (nroInscripcion: number): Promise<string> => {
    try {
      const result = await apiService.put<string>(`/Inscripcion/${nroInscripcion}`);
      return result || "Inscripción dada de baja exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
