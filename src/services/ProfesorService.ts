import type { ProfesorDTO } from "../types/index.ts";
const BASE_URL = 'http://localhost:8080/api/v1/profesores';

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

export const ProfesorService = {
  getProfesores: async (): Promise<ProfesorDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getProfesor: async (id: number): Promise<ProfesorDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createProfesor: async (profesor: ProfesorDTO): Promise<ProfesorDTO> => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profesor)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateProfesor: async (profesor: ProfesorDTO): Promise<ProfesorDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${profesor.dniProfesor}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profesor)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteProfesor: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar el profesor: ${response.statusText}`;
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

  bajaLogicaProfesor: async (profesor: ProfesorDTO): Promise<void> => {
    try {
      console.log(profesor);
      const response = await fetch(`${BASE_URL}/bajaProfesor`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profesor)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  altaLogicaProfesor: async (profesor: ProfesorDTO): Promise<void> => {
    try {
      console.log(profesor);
      const response = await fetch(`${BASE_URL}/altaProfesor`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profesor)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  

  
};
