import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types";
import type { LocalidadDTO } from "../../types";
import { LocalidadService } from "../../services/LocalidadService";
import EmptyState from "../EmptyState/EmptyState";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import LocalidadModal from "../LocalidadModal/LocalidadModal";

const LocalidadTable = () => {
  const initializableNew = (): LocalidadDTO => ({
    codLocalidad: 0,
    nombreLocalidad: "",
    fechaBajaLocalidad: null,
  });

  const [localidad, setLocalidad] = useState<LocalidadDTO>(initializableNew());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState<LocalidadDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const handleClick = (
    newTitle: string,
    entity: LocalidadDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setLocalidad(entity);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchAll = async () => {
      const data = await LocalidadService.getLocalidades();
      setRows(data);
      setIsLoading(false);
    };
    fetchAll();
  }, [refreshData]);

  return (
    <div className="articulo-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>🏙️ Gestión de Localidades</h1>
          <p className="page-subtitle">Administra las localidades</p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick(
              "Añadir Localidad",
              initializableNew(),
              ModalType.CREATE
            )
          }
        >
          <span className="btn-icon">+</span>
          Nueva Localidad
        </Button>
      </div>
      {isLoading ? (
        <div className="loader-container">
          <Loader variant="container" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No hay localidades registradas"
          message="Haz clic en 'Nueva Localidad' para agregar una."
          icon="🏙️"
        />
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Fecha y Hora de Baja</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.codLocalidad} className="table-row-modern">
                  <td className="text-center">{r.codLocalidad}</td>
                  <td>{r.nombreLocalidad}</td>
                  <td className="text-center">
                    <span className={`status-badge ${r.fechaBajaLocalidad ? 'inactive' : 'active'}`}>{r.fechaBajaLocalidad ? 'Inactivo' : 'Activo'}</span>
                  </td>
                  <td className="text-center">
                    {r.fechaBajaLocalidad ? (
                      <span className="fecha-baja">
                        {new Date(r.fechaBajaLocalidad).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    ) : (
                      <span className="no-fecha">-</span>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <EditButton
                        onClick={() =>
                          handleClick("Editar localidad", r, ModalType.UPDATE)
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar localidad", r, ModalType.DELETE)
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
        <LocalidadModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          localidad={localidad}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default LocalidadTable;


