import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import type { ContactoEmergenciaDTO } from "../../types/ContactoEmergenciaDTO";
import "./ContactosModal.css";

type ContactosModalProps = {
  show: boolean;
  onHide: () => void;
  contactos: ContactoEmergenciaDTO[];
  alumnoNombre: string;
};

const ContactosModal = ({
  show,
  onHide,
  contactos,
  alumnoNombre,
}: ContactosModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-modern">
      <Modal.Header closeButton className="modal-header-info">
        <Modal.Title>
          <span className="modal-icon">🚨</span>
          Contactos de Emergencia - {alumnoNombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-info">
        {contactos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-message">No hay contactos de emergencia registrados para este alumno.</p>
          </div>
        ) : (
          <Table striped bordered hover className="contactos-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((contacto, index) => (
                <tr key={index}>
                  <td>{contacto.nombreContacto || "No especificado"}</td>
                  <td>{contacto.telefonoContacto || "No especificado"}</td>
                  <td>{contacto.direccionContacto || "No especificada"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-info">
        <Button variant="outline-secondary" onClick={onHide} className="btn-close">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactosModal; 