import React, { useState, useEffect } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import type { InscripcionProfesorDTO } from "../../types";
import { InscripcionProfesorService } from "../../services/InscripcionProfesorService";
import InscripcionProfesorModal from "./InscripcionProfesorModal";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import EmptyState from "../EmptyState/EmptyState";

type InscripcionProfesorTableProps = {
  refreshData: boolean;
  setRefreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const InscripcionProfesorTable = ({
  refreshData,
  setRefreshData,
}: InscripcionProfesorTableProps) => {
  const [inscripcionesProfesores, setInscripcionesProfesores] = useState<
    InscripcionProfesorDTO[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState<string>("");
  const [inscripcionProfesor, setInscripcionProfesor] = useState<InscripcionProfesorDTO>(
    {} as InscripcionProfesorDTO
  );

  const loadInscripcionesProfesores = async () => {
    setLoading(true);
    try {
      const data = await InscripcionProfesorService.getInscripcionesProfesores();
      setInscripcionesProfesores(data);
    } catch (error) {
      console.error("Error al cargar inscripciones de profesores:", error);
      toast.error("Error al cargar las inscripciones de profesores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInscripcionesProfesores();
  }, [refreshData]);

  const handleCreate = () => {
    setModalType(ModalType.CREATE);
    setTitle("Nueva Inscripción de Profesor");
    setInscripcionProfesor({} as InscripcionProfesorDTO);
    setShowModal(true);
  };

  const handleDelete = (inscripcionProfesor: InscripcionProfesorDTO) => {
    setModalType(ModalType.DELETE);
    setTitle("Dar de Baja Inscripción de Profesor");
    setInscripcionProfesor(inscripcionProfesor);
    setShowModal(true);
  };

  const formatDate = (date: Date | string | null): string => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("es-AR");
    } catch {
      return "Fecha inválida";
    }
  };

  const getStatusBadge = (fechaBaja: Date | string | null) => {
    if (fechaBaja) {
      return <Badge bg="danger">Dado de Baja</Badge>;
    }
    return <Badge bg="success">Activo</Badge>;
  };

  if (loading) {
    return <Loader />;
  }

  if (inscripcionesProfesores.length === 0) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title">
            <span className="title-icon">👨‍🏫</span>
            Inscripciones de Profesores
          </h2>
          <Button
            variant="primary"
            onClick={handleCreate}
            className="btn-create"
          >
            <span className="btn-icon">➕</span>
            Nueva Inscripción
          </Button>
        </div>
        <EmptyState
          title="No hay inscripciones de profesores"
          message="Comienza creando una nueva inscripción de profesor"
          icon="👨‍🏫"
          actionButton={
            <Button variant="primary" onClick={handleCreate}>
              Crear Primera Inscripción
            </Button>
          }
        />
        <InscripcionProfesorModal
          show={showModal}
          onHide={() => setShowModal(false)}
          title={title}
          modalType={modalType}
          inscripcionProfesor={inscripcionProfesor}
          refreshData={setRefreshData}
        />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">
          <span className="title-icon">👨‍🏫</span>
          Inscripciones de Profesores
        </h2>
        <Button
          variant="primary"
          onClick={handleCreate}
          className="btn-create"
        >
          <span className="btn-icon">➕</span>
          Nueva Inscripción
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="table-modern">
          <thead className="table-header">
            <tr>
              <th>Nro. Inscripción</th>
              <th>Profesor</th>
              <th>DNI</th>
              <th>Tipo de Clase</th>
              <th>Fecha de Inscripción</th>
              <th>Fecha de Baja</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripcionesProfesores.map((inscripcionProfesor) => (
              <tr key={inscripcionProfesor.nroInscripcionProfesor}>
                <td className="text-center">
                  <strong>#{inscripcionProfesor.nroInscripcionProfesor}</strong>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <span className="user-avatar">👨‍🏫</span>
                    <div className="ms-2">
                      <div className="fw-bold">
                        {inscripcionProfesor.profesor?.nombreProfesor || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <Badge bg="info" className="dni-badge">
                    {inscripcionProfesor.profesor?.dniProfesor || "N/A"}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <span className="class-icon">📚</span>
                    <div className="ms-2">
                      <div className="fw-bold">
                        {inscripcionProfesor.tipoClase?.nombreTipoClase || "N/A"}
                      </div>
                      {inscripcionProfesor.tipoClase?.rangoEtarioDTO && (
                        <small className="text-muted">
                          Rango: {inscripcionProfesor.tipoClase.rangoEtarioDTO.edadDesde}-{inscripcionProfesor.tipoClase.rangoEtarioDTO.edadHasta} años
                        </small>
                      )}
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  {formatDate(inscripcionProfesor.fechaInscripcionProfesor)}
                </td>
                <td className="text-center">
                  {formatDate(inscripcionProfesor.fechaBajaInscripcionProfesor)}
                </td>
                <td className="text-center">
                  {getStatusBadge(inscripcionProfesor.fechaBajaInscripcionProfesor)}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    {!inscripcionProfesor.fechaBajaInscripcionProfesor && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(inscripcionProfesor)}
                        className="btn-action"
                        title="Dar de baja"
                      >
                        <span className="btn-icon">🗑️</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <InscripcionProfesorModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={title}
        modalType={modalType}
        inscripcionProfesor={inscripcionProfesor}
        refreshData={setRefreshData}
      />
    </div>
  );
};

export default InscripcionProfesorTable;
