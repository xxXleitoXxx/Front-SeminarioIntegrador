import React from 'react';
import { Card, Badge, Row, Col, ProgressBar } from 'react-bootstrap';
import './FichasMedicasProximas.css';

interface FichaMedica {
  id: number;
  nombre: string;
  apellido: string;
  fechaVencimiento: string;
  diasRestantes: number;
  tipoFicha: string;
  estado: 'vigente' | 'por_vencer' | 'vencida';
  porcentajeVigencia: number;
}

const FichasMedicasProximas: React.FC = () => {
  // Datos de ejemplo - en un caso real vendrían de una API
  const fichasMedicas: FichaMedica[] = [
    {
      id: 1,
      nombre: "Sofía",
      apellido: "Hernández",
      fechaVencimiento: "2024-12-30",
      diasRestantes: 8,
      tipoFicha: "Apto Médico",
      estado: 'por_vencer',
      porcentajeVigencia: 15
    },
    {
      id: 2,
      nombre: "Diego",
      apellido: "Fernández",
      fechaVencimiento: "2025-01-05",
      diasRestantes: 14,
      tipoFicha: "Certificado Médico",
      estado: 'por_vencer',
      porcentajeVigencia: 25
    },
    {
      id: 3,
      nombre: "Valentina",
      apellido: "Silva",
      fechaVencimiento: "2024-12-25",
      diasRestantes: 3,
      tipoFicha: "Apto Médico",
      estado: 'por_vencer',
      porcentajeVigencia: 8
    },
    {
      id: 4,
      nombre: "Mateo",
      apellido: "Torres",
      fechaVencimiento: "2024-12-20",
      diasRestantes: -2,
      tipoFicha: "Certificado Médico",
      estado: 'vencida',
      porcentajeVigencia: 0
    },
    {
      id: 5,
      nombre: "Isabella",
      apellido: "Morales",
      fechaVencimiento: "2025-01-15",
      diasRestantes: 24,
      tipoFicha: "Apto Médico",
      estado: 'vigente',
      porcentajeVigencia: 60
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'vencida': return 'danger';
      case 'por_vencer': return 'warning';
      case 'vigente': return 'success';
      default: return 'secondary';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'vencida': return 'Vencida';
      case 'por_vencer': return 'Por Vencer';
      case 'vigente': return 'Vigente';
      default: return 'Desconocido';
    }
  };

  const getDiasText = (dias: number) => {
    if (dias < 0) return `Vencida hace ${Math.abs(dias)} días`;
    if (dias === 0) return 'Vence hoy';
    if (dias === 1) return 'Vence mañana';
    return `Vence en ${dias} días`;
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Apto Médico': return 'bi-heart-pulse';
      case 'Certificado Médico': return 'bi-file-medical';
      default: return 'bi-file-earmark-text';
    }
  };

  return (
    <div className="fichas-medicas-container">
      <div className="section-header">
        <div className="header-icon">
          <i className="bi bi-heart-pulse-fill"></i>
        </div>
        <div className="header-content">
          <h3 className="section-title">🏥 Fichas Médicas Próximas a Vencer</h3>
          <p className="section-subtitle">Controla la vigencia de los certificados médicos</p>
        </div>
      </div>
      
      <Row className="g-3">
        {fichasMedicas.map((ficha) => (
          <Col key={ficha.id} xs={12} sm={6} lg={4}>
            <Card className={`ficha-medica-card ${ficha.estado}`}>
              <Card.Body>
                <div className="card-header-section">
                  <div className="tipo-ficha">
                    <i className={`bi ${getTipoIcon(ficha.tipoFicha)}`}></i>
                    <span>{ficha.tipoFicha}</span>
                  </div>
                  <Badge 
                    bg={getEstadoColor(ficha.estado)} 
                    className="estado-badge"
                  >
                    {getEstadoText(ficha.estado)}
                  </Badge>
                </div>
                
                <div className="estudiante-info">
                  <div className="avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <div className="nombre-completo">
                    <h5>{ficha.nombre} {ficha.apellido}</h5>
                  </div>
                </div>
                
                <div className="fecha-info">
                  <i className="bi bi-calendar-exclamation me-2"></i>
                  <span>{new Date(ficha.fechaVencimiento).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</span>
                </div>
                
                <div className="dias-restantes">
                  <i className="bi bi-clock me-2"></i>
                  <span className={ficha.estado === 'vencida' ? 'text-danger' : ''}>
                    {getDiasText(ficha.diasRestantes)}
                  </span>
                </div>
                
                {ficha.estado !== 'vencida' && (
                  <div className="vigencia-progress">
                    <div className="progress-label">
                      <span>Vigencia</span>
                      <span>{ficha.porcentajeVigencia}%</span>
                    </div>
                    <ProgressBar 
                      now={ficha.porcentajeVigencia} 
                      variant={getEstadoColor(ficha.estado)}
                      className="progress-bar-custom"
                    />
                  </div>
                )}
                
                <div className="card-actions">
                  {ficha.estado === 'vencida' ? (
                    <button className="btn-renovar btn-danger">
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Renovar Urgente
                    </button>
                  ) : ficha.estado === 'por_vencer' ? (
                    <button className="btn-renovar btn-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Renovar Pronto
                    </button>
                  ) : (
                    <button className="btn-renovar btn-success">
                      <i className="bi bi-check-circle me-2"></i>
                      Vigente
                    </button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {fichasMedicas.length === 0 && (
        <div className="no-fichas">
          <i className="bi bi-check-circle"></i>
          <p>Todas las fichas médicas están vigentes</p>
        </div>
      )}
    </div>
  );
};

export default FichasMedicasProximas;

