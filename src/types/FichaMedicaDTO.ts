export interface FichaMedicaDTO {
    id: number;
    fechaBajaFichaMedica: Date | null;
    archivo: Uint8Array; // For PDF or image data
} 