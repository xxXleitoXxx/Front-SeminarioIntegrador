import React from "react";
import { Card, Badge, Row, Col } from "react-bootstrap";
import "./CumpleanosProximos.css";
import { toast } from "react-toastify";

interface Cumpleanos {
  id: number;
  nombre: string;
  apellido: string;
  fecha: string;
  diasRestantes: number;
  edad: number;
}

const CumpleanosProximos: React.FC = () => {
  // Datos de ejemplo - en un caso real vendrían de una API
  const cumpleanosProximos: Cumpleanos[] = [
    {
      id: 1,
      nombre: "María",
      apellido: "González",
      fecha: "2024-12-25",
      diasRestantes: 3,
      edad: 15,
    },
    {
      id: 2,
      nombre: "Carlos",
      apellido: "Rodríguez",
      fecha: "2024-12-28",
      diasRestantes: 6,
      edad: 12,
    },
    {
      id: 3,
      nombre: "Ana",
      apellido: "López",
      fecha: "2024-12-30",
      diasRestantes: 8,
      edad: 14,
    },
    {
      id: 4,
      nombre: "Luis",
      apellido: "Martínez",
      fecha: "2025-01-02",
      diasRestantes: -1,
      edad: 13,
    },
  ];

  const getDiasColor = (dias: number) => {
    if (dias <= 3) return "danger";
    if (dias <= 7) return "warning";
    return "info";
  };

  const getDiasText = (dias: number) => {
    if (dias === 0) return "¡Hoy!";
    if (dias === 1) return "Mañana";
    if (dias === -1) return "Ayer";
    if (dias === -2) return "Anteayer";
    if (dias < -2) return `${Math.abs(dias)} días atrás`;
    return `${dias} días`;
  };

  return (
    <div className="cumpleanos-container">
      <div className="section-header">
        <div className="header-icon">
          <i className="bi bi-gift-fill"></i>
        </div>
        <div className="header-content">
          <h3 className="section-title">🎉 Cumpleaños Próximos</h3>
          <p className="section-subtitle">Celebra con nuestros estudiantes</p>
        </div>
      </div>

      <Row className="g-3">
        {cumpleanosProximos.map((cumpleanos) => (
          <Col key={cumpleanos.id} xs={12} sm={6} lg={3}>
            <Card className="cumpleanos-card">
              <Card.Body className="text-center">
                <div className="avatar-container">
                  <div className="avatar">
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <Badge
                    bg={getDiasColor(cumpleanos.diasRestantes)}
                    className="dias-badge"
                  >
                    {getDiasText(cumpleanos.diasRestantes)}
                  </Badge>
                </div>

                <Card.Title className="nombre-completo">
                  {cumpleanos.nombre} {cumpleanos.apellido}
                </Card.Title>

                <div className="fecha-info">
                  <i className="bi bi-calendar-event me-2"></i>
                  <span>
                    {new Date(cumpleanos.fecha).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>

                <div className="edad-info">
                  <i className="bi bi-cake2 me-2"></i>
                  <span>Cumple {cumpleanos.edad} años</span>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-felicitacion"
                    onClick={() => {
                      toast.info(`Proximamente ....`);
                    }}
                  >
                    <i className="bi bi-emoji-smile me-2"></i>
                    Felicitar
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {cumpleanosProximos.length === 0 && (
        <div className="no-cumpleanos">
          <i className="bi bi-calendar-x"></i>
          <p>No hay cumpleaños próximos</p>
        </div>
      )}
    </div>
  );
};

export default CumpleanosProximos;
