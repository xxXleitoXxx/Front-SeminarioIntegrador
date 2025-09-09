import type { ConfHorarioTipoClaseDTO } from "../types/index.ts";
import { apiService } from './ApiService';

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
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configuracion)
      });

      if (!response.ok) {
        let errorMessage = `Error al crear configuración: ${response.statusText}`;
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
  }
};
