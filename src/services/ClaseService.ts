import type { ClaseDTO } from "../types/index.ts";
const BASE_URL = 'http://localhost:8080/api/v1/clases';

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
  
  // Manejar tanto JSON como string
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return response.text();
  }
};

export const ClaseService = {
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

  getClase: async (nroClase: number): Promise<ClaseDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${nroClase}`);
      const result = await handleResponse(response);
      return typeof result === 'object' ? result : {} as ClaseDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};

