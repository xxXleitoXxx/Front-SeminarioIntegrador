import type { FichaMedicaDTO } from "../types/index.ts";
import { apiService } from './ApiService';
const BASE_URL = '/fichaMedica';

export const FichaMedicaService = {
  getFichasMedicas: async (): Promise<FichaMedicaDTO[]> => {
    try {
      const result = await apiService.get<FichaMedicaDTO[]>(BASE_URL);
      
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;  
    }
  },

  getFichaMedica: async (id: number): Promise<FichaMedicaDTO> => {
    try {
      const result = await apiService.get<FichaMedicaDTO>(`${BASE_URL}/${id}`);
      return typeof result === 'object' ? result : {} as FichaMedicaDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createFichaMedica: async (fichaMedica: FichaMedicaDTO): Promise<FichaMedicaDTO | string> => {
    try {
      const result = await apiService.post<FichaMedicaDTO | string>(BASE_URL, fichaMedica);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }

      // if (!response.ok) {
      //   let errorMessage = `Error al crear ficha médica: ${response.statusText}`;
      //   try {
      //     const contentType = response.headers.get("content-type");
      //     if (contentType && contentType.includes("application/json")) {
      //       const errorData = await response.json();
      //       errorMessage = errorData.error || JSON.stringify(errorData);
      //     } else {
      //       const text = await response.text();
      //       errorMessage = text || errorMessage;
      //     }
      //   } catch (error) {
      //     console.error("Error parsing error response:", error);
      //   }
      //   throw new Error(errorMessage);
      // }

      // Manejar la respuesta exitosa
      // const contentType = response.headers.get("content-type");
    //   if (contentType && contentType.includes("application/json")) {
    //     const data = await response.json();
    //     return typeof data === 'object' ? data : data;
    //   } else {
    //     return await response.text();
    //   }
    // } catch (error) {
    //   console.error("Error en la solicitud:", error);
    //   throw error;
    // }
  },

  updateFichaMedica: async (fichaMedica: FichaMedicaDTO): Promise<FichaMedicaDTO | string> => {
    try {
      const result = await apiService.put<FichaMedicaDTO | string>(`${BASE_URL}/${fichaMedica.id}`, fichaMedica);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }

      // const response = await fetch(`${BASE_URL}/${fichaMedica.id}`, {
      //   method: "PUT",
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(fichaMedica)
      // });

      // if (!response.ok) {
      //   let errorMessage = `Error al actualizar ficha médica: ${response.statusText}`;
      //   try {
      //     const contentType = response.headers.get("content-type");
      //     if (contentType && contentType.includes("application/json")) {
      //       const errorData = await response.json();
      //       errorMessage = errorData.error || JSON.stringify(errorData);
      //     } else {
      //       const text = await response.text();
      //       errorMessage = text || errorMessage;
      //     }
      //   } catch (error) {
      //     console.error("Error parsing error response:", error);
      //   }
      //   throw new Error(errorMessage);
      // }

      // Manejar la respuesta exitosa
    //   const contentType = response.headers.get("content-type");
    //   if (contentType && contentType.includes("application/json")) {
    //     const data = await response.json();
    //     return typeof data === 'object' ? data : data;
    //   } else {
    //     return await response.text();
    //   }
    // } catch (error) {
    //   console.error("Error en la solicitud:", error);
    //   throw error;
    // }
  },

  
  fichaMedicaPorAlumno: async (alumnoId: number): Promise<FichaMedicaDTO[]> => {
    try {
      const result = await apiService.get<FichaMedicaDTO[]>(`${BASE_URL}/${alumnoId}`);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  agregarFichaMedica: async (alumnoId: number, fichaMedica: FichaMedicaDTO): Promise<string> => {
    try {
      // Transformar la ficha médica de la misma manera que AlumnoService
      const fichaMedicaTransformada = {
        ...fichaMedica,
        archivo: Array.isArray(fichaMedica.archivo)
          ? fichaMedica.archivo
          : Object.values(fichaMedica.archivo || {}),
      };

      const result = await apiService.post<string>(`${BASE_URL}/${alumnoId}/agregar`, fichaMedicaTransformada);
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
};
      //     const contentType = response.headers.get("content-type");
      //     if (contentType && contentType.includes("application/json")) {
      //       const errorData = await response.json();
      //       errorMessage = errorData.error || JSON.stringify(errorData);
      //     } else {
      //       const text = await response.text();
      //       errorMessage = text || errorMessage;
      //     }
      //   } catch (error) {
      //     console.error("Error parsing error response:", error);
      //   }
      //   throw new Error(errorMessage);
      // }

      // Manejar la respuesta exitosa
    //   const contentType = response.headers.get("content-type");
    //   if (contentType && contentType.includes("application/json")) {
    //     const data = await response.json();
    //     return typeof data === 'string' ? data : JSON.stringify(data);
    //   } else {
    //     return await response.text();
    //   }
    // } catch (error) {
    //   console.error("Error en la solicitud:", error);
    //   throw error;
    // }
