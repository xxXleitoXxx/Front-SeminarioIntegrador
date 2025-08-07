import type { AlumnoDTO } from "../types/index.ts";
const BASE_URL = 'http://localhost:8080/api/v1/alumnos';

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

export const AlumnoService = {
  getAlumnos: async (): Promise<AlumnoDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getAlumno: async (id: number): Promise<AlumnoDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createAlumno: async (alumno: AlumnoDTO): Promise<AlumnoDTO> => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alumno)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateAlumno: async (alumno: AlumnoDTO): Promise<AlumnoDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${alumno.dniAlumno}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alumno)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteAlumno: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar el alumno: ${response.statusText}`;
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

  bajaLogicaAlumno: async (alumno: AlumnoDTO): Promise<void> => {
    try {
      console.log(alumno);
      const response = await fetch(`${BASE_URL}/bajaAlumno`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alumno)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  altaLogicaAlumno: async (alumno: AlumnoDTO): Promise<void> => {
    try {
      console.log(alumno);
      const response = await fetch(`${BASE_URL}/altaAlumno`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alumno)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
}; 