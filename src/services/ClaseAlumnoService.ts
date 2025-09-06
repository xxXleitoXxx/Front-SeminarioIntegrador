import type { ClaseAlumnoDTO } from "../types/ClaseAlumnoDTO.ts";
import type { ClaseDTO } from "../types/index.ts";
const BASE_URL = 'http://localhost:8080/api/v1/claseAlumno';
import { handleResponse } from './common/handleResponse';

export const ClaseAlumnoService = {
  getClases: async (): Promise<ClaseDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      const result = await handleResponse(response);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getClase: async (nroClase: number): Promise<ClaseAlumnoDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${nroClase}`);
      const result = await handleResponse(response);
      return typeof result === 'object' ? result : {} as ClaseAlumnoDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getAsistenciaClaseAlumno: async (nroClase: number): Promise<ClaseAlumnoDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/asistencia/${nroClase}`);
      const result = await handleResponse(response);
     // return Array.isArray(result) ? result : [];
     return result
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  guardarAsistenciaClaseAlumno: async (claseAlumnoDTOS: ClaseAlumnoDTO[]): Promise<string> => {
    try {
      const response = await fetch(`${BASE_URL}/asistencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claseAlumnoDTOS),
      });
      const result = await handleResponse(response);
      return typeof result === 'string' ? result : '';
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
      }



  
}
};
