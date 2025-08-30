import type { ProfesorDTO } from './ProfesorDTO';
import type { TipoClaseDTO } from './TipoClaseDTO';

export interface InscripcionProfesorDTO {
  nroInscripcionProfesor: number;
  fechaBajaInscripcionProfesor: Date | null;
  fechaInscripcionProfesor: Date;
  profesor: ProfesorDTO;
  tipoClase: TipoClaseDTO;
}
