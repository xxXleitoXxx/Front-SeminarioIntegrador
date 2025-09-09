import type { ProfesorDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const ProfesorService = {
  getProfesores: async (): Promise<ProfesorDTO[]> => {
    try {
      const result = await apiService.get<ProfesorDTO[]>('/profesores');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getProfesor: async (id: number): Promise<ProfesorDTO> => {
    try {
      const result = await apiService.get<ProfesorDTO>(`/profesores/${id}`);
      return typeof result === 'object' ? result : {} as ProfesorDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createProfesor: async (profesor: ProfesorDTO): Promise<ProfesorDTO | string> => {
    try {
      const result = await apiService.post<ProfesorDTO | string>('/profesores', profesor);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateProfesor: async (profesor: ProfesorDTO): Promise<ProfesorDTO | string> => {
    try {
      const result = await apiService.put<ProfesorDTO | string>(`/profesores/${profesor.nroProfesor}`, profesor);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteProfesor: async (id: number): Promise<string> => {
    try {
      const result = await apiService.delete<string>(`/profesores/${id}`);
      return result || "Profesor eliminado exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaLogicaProfesor: async (profesor: ProfesorDTO): Promise<string> => {
    try {
      console.log(profesor);
      const result = await apiService.put<string>(`/profesores/${profesor.nroProfesor}/baja`);
      return result || "Profesor dado de baja exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  altaLogicaProfesor: async (profesor: ProfesorDTO): Promise<string> => {
    try {
      console.log(profesor);
      const result = await apiService.put<string>('/profesores/altaProfesor', profesor);
      return result || "Profesor dado de alta exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  

  
};
