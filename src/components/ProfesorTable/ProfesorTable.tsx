import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types";
import ProfesorModal from "../ProfesorModal/ProfesorModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import type { ProfesorDTO } from "../../types";
import { ProfesorService } from "../../services/ProfesorService";
import { ButtonAlta } from "../ButtonAlta/ButtonAlta";
import EmptyState from "../EmptyState/EmptyState";

const ProfesorTable = () => {
  const initializableNewProfesor = (): ProfesorDTO => ({
    nroProfesor: 0,
    dniProfesor: 0,
    nombreProfesor: "",
    telefonoProfesor: 0,
    fechaBajaProfesor: null,
  });

  const [profesor, setProfesor] = useState<ProfesorDTO>(initializableNewProfesor());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");
  const [profesores, setProfesores] = useState<ProfesorDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const handleClick = (
    newTitle: string,
    prof: ProfesorDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setProfesor(prof);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchProfesores = async () => {
      const data = await ProfesorService.getProfesores();
      setProfesores(data);
      setIsLoading(false);
    };
    fetchProfesores();
  }, [refreshData]);

  return (
    <div className="articulo-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>👨‍🏫 Gestión de Profesores</h1>
          <p className="page-subtitle">Administra los profesores del sistema</p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick(
              "Añadir Profesor",
              initializableNewProfesor(),
              ModalType.CREATE
            )
          }
        >
          <span className="btn-icon">+</span>
          Nuevo Profesor
        </Button>
      </div>
      {isLoading ? (
        <div className="loader-container">
          <Loader variant="container" />
        </div>
      ) : profesores.length === 0 ? (
        <EmptyState
          title="No hay profesores registrados"
          message="Aún no se han registrado profesores en el sistema. Haz clic en 'Nuevo Profesor' para comenzar a agregar profesores."
          icon="👨‍🏫"
        />
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profesores.map((prof) => (
                <tr key={prof.nroProfesor} className="table-row-modern">
                  <td className="text-center">{prof.nroProfesor}</td>
                  <td className="text-center">{prof.dniProfesor}</td>
                  <td>{prof.nombreProfesor}</td>
                  <td className="text-center">{prof.telefonoProfesor}</td>
                  <td className="text-center">
                    <span className={`status-badge ${prof.fechaBajaProfesor ? 'inactive' : 'active'}`}>{prof.fechaBajaProfesor ? 'Inactivo' : 'Activo'}</span>
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <EditButton
                        onClick={() =>
                          handleClick("Editar profesor", prof, ModalType.UPDATE)
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar Profesor", prof, ModalType.DELETE)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {showModal && (
        <ProfesorModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          profesor={profesor}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default ProfesorTable; 