import { apiService } from './ApiService';
import type { ReporteGralHistDTO } from '../types/ReporteGralHistDTO';

class ReporteGralHistService {
  async getReporteGralHist(): Promise<ReporteGralHistDTO> {
    return apiService.get<ReporteGralHistDTO>('/reporteGralHist');
  }
}

export const reporteGralHistService = new ReporteGralHistService();


