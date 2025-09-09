import type { InscripcionProfesorDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const InscripcionProfesorService = {
  getInscripcionesProfesores: async (): Promise<InscripcionProfesorDTO[]> => {
    try {
      const result = await apiService.get<InscripcionProfesorDTO[]>('/InscripcionProfesor');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getInscripcionProfesor: async (nroInscripcionProfesor: number): Promise<InscripcionProfesorDTO> => {
    try {
      const result = await apiService.get<InscripcionProfesorDTO>(`/InscripcionProfesor/${nroInscripcionProfesor}`);
      return typeof result === 'object' ? result : {} as InscripcionProfesorDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  inscribirProfesor: async (dni: number, codTipoClase: number): Promise<InscripcionProfesorDTO | string> => {
    try {
      const result = await apiService.post<InscripcionProfesorDTO | string>(`/InscripcionProfesor/${dni}/${codTipoClase}`);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaInscripcionProfesor: async (nroInscripcionProfesor: number): Promise<string> => {
    try {
      const result = await apiService.put<string>(`/InscripcionProfesor/${nroInscripcionProfesor}`);
      return result || "Inscripción de profesor dada de baja exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
