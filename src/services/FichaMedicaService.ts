import type { FichaMedicaDTO } from "../types/index.ts";
import { handleResponse } from './common/handleResponse';

const BASE_URL = 'http://localhost:8080/api/v1/fichaMedica';

export const FichaMedicaService = {
  getFichasMedicas: async (): Promise<FichaMedicaDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      const result = await handleResponse(response);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getFichaMedica: async (id: number): Promise<FichaMedicaDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const result = await handleResponse(response);
      return typeof result === 'object' ? result : {} as FichaMedicaDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createFichaMedica: async (fichaMedica: FichaMedicaDTO): Promise<FichaMedicaDTO | string> => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fichaMedica)
      });

      if (!response.ok) {
        let errorMessage = `Error al crear ficha médica: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || JSON.stringify(errorData);
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      // Manejar la respuesta exitosa
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return typeof data === 'object' ? data : data;
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateFichaMedica: async (fichaMedica: FichaMedicaDTO): Promise<FichaMedicaDTO | string> => {
    try {
      const response = await fetch(`${BASE_URL}/${fichaMedica.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fichaMedica)
      });

      if (!response.ok) {
        let errorMessage = `Error al actualizar ficha médica: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || JSON.stringify(errorData);
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      // Manejar la respuesta exitosa
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return typeof data === 'object' ? data : data;
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteFichaMedica: async (id: number): Promise<string> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar la ficha médica: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || JSON.stringify(errorData);
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return "Ficha médica eliminada exitosamente";
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return typeof data === 'string' ? data : JSON.stringify(data);
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  fichaMedicaPorAlumno: async (alumnoId: number): Promise<FichaMedicaDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/${alumnoId}`);
      const result = await handleResponse(response);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
};