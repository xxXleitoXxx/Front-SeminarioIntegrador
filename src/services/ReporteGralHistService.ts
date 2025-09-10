import { apiService } from './ApiService';
import { ReporteGralHistDTO } from '../types/ReporteGralHistDTO';

class ReporteGralHistService {
  async getReporteGralHist(): Promise<ReporteGralHistDTO> {
    return apiService.get<ReporteGralHistDTO>('/reporteGralHist');
  }
}

export const reporteGralHistService = new ReporteGralHistService();


