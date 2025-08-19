import type { DiaDTO } from './DiaDTO';
import type { TipoClaseDTO } from './TipoClaseDTO';

export interface HorarioiDiaxTipoClaseDTO {
  nroHFxTC: number;
  fechaBajaHFxTC: Date | null;
  horaDesde: string; // Formato TIME (HH:MM:SS)
  horaHasta: string; // Formato TIME (HH:MM:SS)
  diaDTO: DiaDTO;
  tipoClase: TipoClaseDTO;
}
