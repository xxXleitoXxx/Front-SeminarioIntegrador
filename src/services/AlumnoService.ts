import type { AlumnoDTO } from "../types/index.ts";
import { handleResponse } from './common/handleResponse';

const BASE_URL = 'http://localhost:8080/api/v1/alumnos';

export const AlumnoService = {
  getAlumnos: async (): Promise<AlumnoDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}`);
      const result = await handleResponse(response);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getAlumno: async (id: number): Promise<AlumnoDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      const result = await handleResponse(response);
      return typeof result === 'object' ? result : {} as AlumnoDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createAlumno: async (alumno: AlumnoDTO): Promise<void> => {
    try{
    const alumnoData = {
      ...alumno,
      fechaNacAlumno: alumno.fechaNacAlumno instanceof Date
        ? alumno.fechaNacAlumno.toISOString().split("T")[0]
        : alumno.fechaNacAlumno,
      localidadAlumno: alumno.localidadAlumno
        ? {
            ...alumno.localidadAlumno,
            fechaBajaLocalidad: alumno.localidadAlumno.fechaBajaLocalidad instanceof Date
              ? alumno.localidadAlumno.fechaBajaLocalidad.toISOString().split("T")[0]
              : alumno.localidadAlumno.fechaBajaLocalidad,
          }
        : null,
      fichaMedicaDTO: Array.isArray(alumno.fichaMedicaDTO)
        ? alumno.fichaMedicaDTO.map(ficha => ({
            ...ficha,
            archivo: Array.isArray(ficha.archivo)
              ? ficha.archivo
              : Object.values(ficha.archivo || {}),
          }))
        : [],
    };

    console.log("Contenido de fichaMedicaDTO antes de enviar:", alumnoData.fichaMedicaDTO);

    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumnoData),
    });
    
    const result = await handleResponse(response);
  }catch(error){
    console.error("Error en la solicitud:", error);
    throw error;
  }
  },

  updateAlumno: async (alumno: AlumnoDTO): Promise<void> => {
    const alumnoData = {
      ...alumno,
      fechaNacAlumno: alumno.fechaNacAlumno instanceof Date
        ? alumno.fechaNacAlumno.toISOString().split("T")[0]
        : alumno.fechaNacAlumno,
      localidadAlumno: alumno.localidadAlumno
        ? {
            ...alumno.localidadAlumno,
            fechaBajaLocalidad: alumno.localidadAlumno.fechaBajaLocalidad instanceof Date
              ? alumno.localidadAlumno.fechaBajaLocalidad.toISOString().split("T")[0]
              : alumno.localidadAlumno.fechaBajaLocalidad,
          }
        : null,
      fichaMedicaDTO: Array.isArray(alumno.fichaMedicaDTO)
        ? alumno.fichaMedicaDTO.map(ficha => ({
            ...ficha,
            archivo: Array.isArray(ficha.archivo)
              ? ficha.archivo
              : Object.values(ficha.archivo || {}),
          }))
        : [],
    };

    const response = await fetch(`${BASE_URL}/${alumno.nroAlumno}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alumnoData),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el alumno");
    }
  },

  deleteAlumno: async (id: number): Promise<string> => {
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
        return "Alumno eliminado exitosamente";
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

  bajaLogicaAlumno: async (alumno: AlumnoDTO): Promise<string> => {
    try {
      const response = await fetch(`${BASE_URL}/${alumno.dniAlumno}/baja`, {
        method: "PUT"
      });

      if (!response.ok) {
        let errorMessage = `Error al dar de baja alumno: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
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
        return typeof data === 'string' ? data : JSON.stringify(data);
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  altaLogicaAlumno: async (alumno: AlumnoDTO): Promise<string> => {
    try {
      console.log(alumno);
      // Normalizar propiedad de localidad (aceptar 'localidad' o 'localidadAlumno')
      const localidad = (alumno as any).localidadAlumno ?? (alumno as any).localidad ?? null;

      // Preparar los datos para el envío
      const alumnoData: any = {
        nroAlumno: alumno.nroAlumno,
        dniAlumno: alumno.dniAlumno,
        domicilioAlumno: alumno.domicilioAlumno,
        fechaNacAlumno: alumno.fechaNacAlumno instanceof Date 
          ? alumno.fechaNacAlumno.toISOString().split('T')[0] 
          : alumno.fechaNacAlumno,
        nombreAlumno: alumno.nombreAlumno,
        apellidoAlumno: alumno.apellidoAlumno,
        telefonoAlumno: alumno.telefonoAlumno,
        mailAlumno: alumno.mailAlumno,
        localidadAlumno: localidad && localidad.codLocalidad > 0 ? {
          codLocalidad: localidad.codLocalidad,
          nombreLocalidad: localidad.nombreLocalidad,
          fechaBajaLocalidad: localidad.fechaBajaLocalidad instanceof Date 
            ? localidad.fechaBajaLocalidad.toISOString().split('T')[0] 
            : localidad.fechaBajaLocalidad
        } : null,
        contactosEmergencia: alumno.contactosEmergencia || [],
        fichaMedicaDTO: alumno.fichaMedicaDTO
      };

      console.log('[AlumnoService.altaLogicaAlumno] Payload a enviar:', alumnoData);

      const response = await fetch(`${BASE_URL}/altaAlumno`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(alumnoData)
      });

      if (!response.ok) {
        let errorMessage = `Error al dar de alta alumno: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
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
        return typeof data === 'string' ? data : JSON.stringify(data);
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
};