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
    MailAlumno: string;
    localidadAlumno: LocalidadDTO;
    contactoEmergenciaDTO: ContactoEmergenciaDTO[];
    fichaMedicaDTO: FichaMedicaDTO;
}