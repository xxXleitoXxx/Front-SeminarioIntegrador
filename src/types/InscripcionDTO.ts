import type { AlumnoDTO } from './AlumnoDTO';
import type { TipoClaseDTO } from './TipoClaseDTO';

export interface InscripcionDTO {
  nroInscripcion: number;
  fechaBajaInscripcion: Date | null;
  fechaInscripcion: Date;
  alumnoDto: AlumnoDTO;
  tipoClaseDTO: TipoClaseDTO;
}
