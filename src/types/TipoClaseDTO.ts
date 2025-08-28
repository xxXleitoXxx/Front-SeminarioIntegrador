import type { RangoEtarioDTO } from './RangoEtarioDTO';
export interface TipoClaseDTO {
  codTipoClase: number;
  nombreTipoClase: string;
  fechaBajaTipoClase: Date | null;
  cupoMaxTipoClase: number;
  rangoEtarioDTO: RangoEtarioDTO;
}
