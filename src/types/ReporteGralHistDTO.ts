export interface ReporteGralHistLocalidadDTO {
  nombreLocalidad: string;
  alumnosXLocalidadDTO: number;
  presenteTotalClases?: number; // por si backend extiende luego
  ausenteTotalClases?: number;  // por si backend extiende luego
}

export interface ReporteGralHistTipoClaseDTO {
  inscriptos: number;
  nombreTipoClase: string;
  presenteTotalClases: number;
  ausenteTotalClases: number;
  porcentajeAsistencia: number;
}

export interface ReporteGralHistDTO {
  alumnoTotalesInscriptos: number;
  alumnoTotalesNoInscriptos: number;
  alumnoTotalesActivos: number;
  alumnoTotalesInactivos: number;
  reporteXTipoClase: ReporteGralHistTipoClaseDTO[];
  reporteXLocalidad: ReporteGralHistLocalidadDTO[];
}


