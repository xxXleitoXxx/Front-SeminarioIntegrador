import type { ContactoEmergenciaDTO } from "../types/index.ts";
import { handleResponse } from './common/handleResponse';

const BASE_URL = 'http://localhost:8080/api/v1/contactosEmergencia';

export const ContactoEmergenciaService = {
  getContactos: async (): Promise<ContactoEmergenciaDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      const result = await handleResponse(response);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getContacto: async (id: number): Promise<ContactoEmergenciaDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const result = await handleResponse(response);
      return typeof result === 'object' ? result : {} as ContactoEmergenciaDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createContacto: async (contacto: ContactoEmergenciaDTO): Promise<ContactoEmergenciaDTO | string> => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacto)
      });

      if (!response.ok) {
        let errorMessage = `Error al crear contacto: ${response.statusText}`;
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

  updateContacto: async (contacto: ContactoEmergenciaDTO): Promise<ContactoEmergenciaDTO | string> => {
    try {
      const response = await fetch(`${BASE_URL}/${contacto.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacto)
      });

      if (!response.ok) {
        let errorMessage = `Error al actualizar contacto: ${response.statusText}`;
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

  deleteContacto: async (id: number): Promise<string> => {
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

      if (response.status === 204) {
        return "Contacto eliminado exitosamente";
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

  contactosPorAlumno: async (nroAlumno: number): Promise<ContactoEmergenciaDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/alumno/${nroAlumno}`);
      const result = await handleResponse(response);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
};