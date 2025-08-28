export interface FichaMedicaDTO {
    id: number;
    vigenciaDesde: Date;
    vigenciaHasta: Date;
    archivo: Uint8Array | null; // For PDF or image data
} 