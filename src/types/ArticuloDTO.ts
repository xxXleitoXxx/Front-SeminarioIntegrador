

export interface ArticuloDTO {
    id: number;
    codArt: string;
    nomArt: string;
    precioVenta: number;
    descripcionArt: string;
    fechaHoraBajaArt: string; // Usamos string para representar la fecha en formato ISO
    stock: number;
    stockSeguridad: number;
    demandaDiaria: number;
    desviacionEstandar: number;
    proveedorDTO?: {
        nomProv: string;
    };
}