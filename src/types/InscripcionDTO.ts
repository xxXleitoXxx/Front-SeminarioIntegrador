export interface InscripcionDTO {
  nroInscripcion: number;
  dniAlumno: number;
  codTipoClase: number;
  fechaInscripcion: Date;
  fechaBajaInscripcion?: Date | null;
}
