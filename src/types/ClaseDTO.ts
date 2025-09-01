import type { ProfesorDTO } from './ProfesorDTO';
import type { TipoClaseDTO } from './TipoClaseDTO';
import type { DiaDTO } from './DiaDTO';

export interface ClaseDTO {
  nroClase: number;
  fechaBajaClase: Date | null;
  fechaHoraClase: Date;
  profesores: ProfesorDTO[];
  tipoClase: TipoClaseDTO;
  diaClase: DiaDTO;
}

