export interface FichaMedicaDTO {
    id: number;
    fechaHoraBaja: Date | null;
    archivo: Uint8Array; // For PDF or image data
} 