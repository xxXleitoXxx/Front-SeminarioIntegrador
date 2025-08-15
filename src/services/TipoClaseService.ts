import type { TipoClaseDTO } from "../types/index.ts";
const BASE_URL = 'http://localhost:8080/api/v1/tipoclases';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Error: ${response.statusText}`;
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
  return response.json();
};

export const TipoClaseService = {
  getTipoClases: async (): Promise<TipoClaseDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getTipoClase: async (codTipoClase: number): Promise<TipoClaseDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${codTipoClase}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createTipoClase: async (tipoClase: TipoClaseDTO): Promise<TipoClaseDTO> => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipoClase)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateTipoClase: async (codTipoClase: number, tipoClase: TipoClaseDTO): Promise<TipoClaseDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${codTipoClase}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tipoClase)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaTipoClase: async (codTipoClase: number): Promise<TipoClaseDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${codTipoClase}/baja`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
