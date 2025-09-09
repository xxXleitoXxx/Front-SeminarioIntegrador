import type { ClaseAlumnoDTO } from "../types/ClaseAlumnoDTO.ts";
import type { ClaseDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const ClaseAlumnoService = {
  getClases: async (): Promise<ClaseDTO[]> => {
    try {
      const result = await apiService.get<ClaseDTO[]>('/claseAlumno');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getClase: async (nroClase: number): Promise<ClaseAlumnoDTO> => {
    try {
      const result = await apiService.get<ClaseAlumnoDTO>(`/claseAlumno/${nroClase}`);
      return typeof result === 'object' ? result : {} as ClaseAlumnoDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getAsistenciaClaseAlumno: async (nroClase: number): Promise<ClaseAlumnoDTO[]> => {
    try {
      const result = await apiService.get<ClaseAlumnoDTO[]>(`/claseAlumno/asistencia/${nroClase}`);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  guardarAsistenciaClaseAlumno: async (claseAlumnoDTOS: ClaseAlumnoDTO[]): Promise<string> => {
    try {
      const result = await apiService.post<string>('/claseAlumno/asistencia', claseAlumnoDTOS);
      return result || "Asistencia guardada exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
