import type { RangoEtarioDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const RangoEtarioService = {
  getRangos: async (): Promise<RangoEtarioDTO[]> => {
    try {
      const result = await apiService.get<RangoEtarioDTO[]>('/rangosetarios');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getRango: async (codRangoEtario: number): Promise<RangoEtarioDTO> => {
    try {
      const result = await apiService.get<RangoEtarioDTO>(`/rangosetarios/${codRangoEtario}`);
      return typeof result === 'object' ? result : {} as RangoEtarioDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createRango: async (rango: RangoEtarioDTO): Promise<RangoEtarioDTO | string> => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rango)
      });

      if (!response.ok) {
        let errorMessage = `Error al crear rango etario: ${response.statusText}`;
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

  updateRango: async (codRangoEtario: number, rango: RangoEtarioDTO): Promise<RangoEtarioDTO | string> => {
    try {
      const response = await fetch(`${BASE_URL}/${codRangoEtario}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rango)
      });

      if (!response.ok) {
        let errorMessage = `Error al actualizar rango etario: ${response.statusText}`;
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

  bajaRango: async (codRangoEtario: number): Promise<RangoEtarioDTO | string> => {
    try {
      const response = await fetch(`${BASE_URL}/${codRangoEtario}/baja`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = `Error al dar de baja rango etario: ${response.statusText}`;
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


