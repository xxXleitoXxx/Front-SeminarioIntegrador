import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Spinner } from "react-bootstrap";
import type { FichaMedicaDTO } from "../../types/FichaMedicaDTO";
import { FichaMedicaService } from "../../services/FichaMedicaService";
import "./FichasMedicasModal.css";

type FichasMedicasModalProps = {
  show: boolean;
  onHide: () => void;
  alumnoId: number;
  alumnoNombre: string;
};

const FichasMedicasModal = ({
  show,
  onHide,
  alumnoId,
  alumnoNombre,
}: FichasMedicasModalProps) => {
  const [fichasMedicas, setFichasMedicas] = useState<FichaMedicaDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show && alumnoId) {
      loadFichasMedicas();
    }
  }, [show, alumnoId]);

  const loadFichasMedicas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fichas = await FichaMedicaService.fichaMedicaPorAlumno(alumnoId);
      setFichasMedicas(fichas);
    } catch (error) {
      console.error("Error cargando fichas médicas:", error);
      setError("Error al cargar las fichas médicas");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusBadge = (fechaBaja: Date | null) => {
    if (fechaBaja) {
      return <span className="badge badge-danger">Inactiva</span>;
    }
    return <span className="badge badge-success">Activa</span>;
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-modern modal-lg">
      <Modal.Header closeButton className="modal-header-medical">
        <Modal.Title>
          <span className="modal-icon">🏥</span>
          Fichas Médicas - {alumnoNombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-medical">
        {isLoading ? (
          <div className="loading-container">
            <Spinner animation="border" role="status" className="loading-spinner">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="loading-text">Cargando fichas médicas...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <Button variant="outline-primary" onClick={loadFichasMedicas} size="sm">
              Reintentar
            </Button>
          </div>
        ) : fichasMedicas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-message">No hay fichas médicas registradas para este alumno.</p>
          </div>
        ) : (
          <Table striped bordered hover className="fichas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estado</th>
                <th>Fecha de Baja</th>
                <th>Archivo</th>
              </tr>
            </thead>
            <tbody>
              {fichasMedicas.map((ficha, index) => (
                <tr key={index}>
                  <td>{ficha.id}</td>
                  <td>{getStatusBadge(ficha.fechaBajaFichaMedica)}</td>
                  <td>{formatDate(ficha.fechaBajaFichaMedica)}</td>
                  <td>
                    {ficha.archivo && ficha.archivo.length > 0 ? (
                      <span className="file-info">
                        📄 Archivo disponible ({(ficha.archivo.length / 1024).toFixed(2)} KB)
                      </span>
                    ) : (
                      <span className="no-file">Sin archivo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-medical">
        <Button variant="outline-secondary" onClick={onHide} className="btn-close">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FichasMedicasModal; 