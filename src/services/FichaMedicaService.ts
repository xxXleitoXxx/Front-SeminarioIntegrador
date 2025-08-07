import type { FichaMedicaDTO } from "../types/index.ts";
const BASE_URL = 'http://localhost:8080/api/v1/fichas-medicas';

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

export const FichaMedicaService = {
  getFichas: async (): Promise<FichaMedicaDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getFicha: async (id: number): Promise<FichaMedicaDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createFicha: async (ficha: FichaMedicaDTO): Promise<FichaMedicaDTO> => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ficha)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateFicha: async (ficha: FichaMedicaDTO): Promise<FichaMedicaDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${ficha.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ficha)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteFicha: async (id: number): Promise<void> => {
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
        return;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
}; 