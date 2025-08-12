import type { ContactoEmergenciaDTO } from "../types/index.ts";

const BASE_URL = 'http://localhost:8080/api/v1/contactosEmergencia';

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

export const ContactoEmergenciaService = {
  getContactos: async (): Promise<ContactoEmergenciaDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getContacto: async (id: number): Promise<ContactoEmergenciaDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createContacto: async (contacto: ContactoEmergenciaDTO): Promise<ContactoEmergenciaDTO> => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacto)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateContacto: async (contacto: ContactoEmergenciaDTO): Promise<ContactoEmergenciaDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${contacto.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacto)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteContacto: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar el contacto: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || JSON.stringify(errorData);
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  contactosPorAlumno: async (nroAlumno: number): Promise<ContactoEmergenciaDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/alumno/${nroAlumno}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
}; 