import type { LocalidadDTO } from './LocalidadDTO';
import type { ContactoEmergenciaDTO } from './ContactoEmergenciaDTO';
import type { FichaMedicaDTO } from './FichaMedicaDTO';

export interface AlumnoDTO {
    nroAlumno: number;
    dniAlumno: number;
    domicilioAlumno: string;
    fechaNacAlumno: Date;
    nombreAlumno: string;
    apellidoAlumno: string;
    telefonoAlumno: number;
    mailAlumno: string; // Cambiado de MailAlumno a mailAlumno
    localidadAlumno: LocalidadDTO | null;// Cambiado de localidadAlumno a localidad
    contactosEmergencia: ContactoEmergenciaDTO[]; // Cambiado de contactoEmergenciaDTO a contactosEmergencia
    fichaMedicaDTO: FichaMedicaDTO[];
}