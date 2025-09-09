import type { AlumnoDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const AlumnoService = {
  getAlumnos: async (): Promise<AlumnoDTO[]> => {
    try {
      const result = await apiService.get<AlumnoDTO[]>('/alumnos');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getAlumno: async (id: number): Promise<AlumnoDTO> => {
    try {
      const result = await apiService.get<AlumnoDTO>(`/alumnos/${id}`);
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

    const result = await apiService.post<void>('/alumnos', alumnoData);
    return result;
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

    await apiService.put<void>(`/alumnos/${alumno.nroAlumno}`, alumnoData);
  },

  deleteAlumno: async (id: number): Promise<string> => {
    try {
      const result = await apiService.delete<string>(`/alumnos/${id}`);
      return result || "Alumno eliminado exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaLogicaAlumno: async (alumno: AlumnoDTO): Promise<string> => {
    try {
      const result = await apiService.put<string>(`/alumnos/${alumno.dniAlumno}/baja`);
      return result || "Alumno dado de baja exitosamente";
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

      const result = await apiService.put<string>('/alumnos/altaAlumno', alumnoData);
      return result || "Alumno dado de alta exitosamente";
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
};