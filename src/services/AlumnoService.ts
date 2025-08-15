import type { AlumnoDTO } from "../types/index.ts";
const BASE_URL = 'http://localhost:8080/api/v1/alumnos';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Error: ${response.statusText}`;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.error("Error response from backend:", errorData);
        errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
      } else {
        const text = await response.text();
        console.error("Error response text from backend:", text);
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
      // Normalizar propiedad de localidad (aceptar 'localidad' o 'localidadAlumno')
    
     const localidad = alumno.localidadAlumno

     // Preparar los datos para el envío, manejando las fechas correctamente
  
     
     const alumnoData: any = {
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
        contactosEmergencia: alumno.contactosEmergencia && alumno.contactosEmergencia.length > 0 
          ? alumno.contactosEmergencia.filter(contacto => 
              contacto.nombreContacto && contacto.nombreContacto.trim() !== "" && 
              contacto.telefonoContacto && contacto.telefonoContacto > 0
            )
          : [],
        fichaMedicaDTO: {
          id: alumno.fichaMedicaDTO?.id || 0,
          fechaBajaFichaMedica: alumno.fichaMedicaDTO?.fechaBajaFichaMedica instanceof Date 
            ? alumno.fichaMedicaDTO.fechaBajaFichaMedica.toISOString().split('T')[0] 
            : alumno.fichaMedicaDTO?.fechaBajaFichaMedica || null,
          archivo: alumno.fichaMedicaDTO?.archivo && alumno.fichaMedicaDTO.archivo.length > 0
            ? Array.from(alumno.fichaMedicaDTO.archivo) // Convertir Uint8Array a array normal
            : [1,2,3,4,5] // Archivo por defecto si no se selecciona uno
        }
      };

      // Solo incluir nroAlumno si no es 0 (para nuevos registros)
      
      // if (alumno.nroAlumno !== 0) {
      //   alumnoData.nroAlumno = alumno.nroAlumno;
      // }

    //  console.log('[AlumnoService.createAlumno] Payload a enviar:', alumnoData);

      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(alumnoData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateAlumno: async (alumno: AlumnoDTO): Promise<AlumnoDTO> => {
    try {
      // Normalizar propiedad de localidad (aceptar 'localidad' o 'localidadAlumno')
      const localidad = (alumno as any).localidadAlumno ?? (alumno as any).localidad ?? null;

      // Preparar los datos para el envío, manejando las fechas correctamente
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
        contactosEmergencia: alumno.contactosEmergencia && alumno.contactosEmergencia.length > 0 
          ? alumno.contactosEmergencia.filter(contacto => 
              contacto.nombreContacto && contacto.nombreContacto.trim() !== "" && 
              contacto.telefonoContacto && contacto.telefonoContacto > 0
            )
          : [],
        fichaMedicaDTO: {
          id: alumno.fichaMedicaDTO?.id || 0,
          fechaBajaFichaMedica: alumno.fichaMedicaDTO?.fechaBajaFichaMedica instanceof Date 
            ? alumno.fichaMedicaDTO.fechaBajaFichaMedica.toISOString().split('T')[0] 
            : alumno.fichaMedicaDTO?.fechaBajaFichaMedica || null,
          archivo: alumno.fichaMedicaDTO?.archivo && alumno.fichaMedicaDTO.archivo.length > 0
            ? Array.from(alumno.fichaMedicaDTO.archivo)
            : [1,2,3,4,5]
        }
      };

      console.log('[AlumnoService.updateAlumno] Payload a enviar:', alumnoData);

      const response = await fetch(`${BASE_URL}/${alumno.dniAlumno}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(alumnoData)
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

      console.log('[AlumnoService.bajaLogicaAlumno] Payload a enviar:', alumnoData);

      const response = await fetch(`${BASE_URL}/bajaAlumno`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(alumnoData)
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
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
}; 