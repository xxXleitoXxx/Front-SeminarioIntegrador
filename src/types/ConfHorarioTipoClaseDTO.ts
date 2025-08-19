import type { HorarioiDiaxTipoClaseDTO } from './HorarioiDiaxTipoClaseDTO';

export interface ConfHorarioTipoClaseDTO {
  nroConfTC: number;
  fechaVigenciaConf: Date | null;
  fechaFinVigenciaConf: Date | null;
  horarioiDiaxTipoClaseList: HorarioiDiaxTipoClaseDTO[];
}
