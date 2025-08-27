import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types";
import type { DiaDTO } from "../../types";
import { DiaService } from "../../services/DiaService";
import EmptyState from "../EmptyState/EmptyState";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import DiaModal from "../DiaModal/DiaModal";

const DiaTable = () => {
  const initializableNewDia = (): DiaDTO => ({
    codDia: 0,
    nombreDia: "",
    fechaBajaDia: null,
  });

  const [dia, setDia] = useState<DiaDTO>(initializableNewDia());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");
  const [dias, setDias] = useState<DiaDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const handleClick = (
    newTitle: string,
    entity: DiaDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setDia(entity);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchDias = async () => {
      const data = await DiaService.getDias();
      setDias(data);
      setIsLoading(false);
    };
    fetchDias();
  }, [refreshData]);

  return (
    <div className="articulo-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📅 Gestión de Días</h1>
          <p className="page-subtitle">Administra los días del sistema</p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick(
              "Añadir Día",
              initializableNewDia(),
              ModalType.CREATE
            )
          }
        >
          <span className="btn-icon">+</span>
          Nuevo Día
        </Button>
      </div>
      {isLoading ? (
        <div className="loader-container">
          <Loader variant="container" />
        </div>
      ) : dias.length === 0 ? (
        <EmptyState
          title="No hay días registrados"
          message="Haz clic en 'Nuevo Día' para agregar uno."
          icon="📅"
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
              {dias.map((d) => (
                <tr key={d.codDia} className="table-row-modern">
                  <td className="text-center">{d.codDia}</td>
                  <td>{d.nombreDia}</td>
                  <td className="text-center">
                    <span className={`status-badge ${d.fechaBajaDia ? 'inactive' : 'active'}`}>{d.fechaBajaDia ? 'Inactivo' : 'Activo'}</span>
                  </td>
                  <td className="text-center">
                    {d.fechaBajaDia ? (
                      <span className="fecha-baja">
                        {new Date(d.fechaBajaDia).toLocaleString('es-ES', {
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
                          handleClick("Editar día", d, ModalType.UPDATE)
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar día", d, ModalType.DELETE)
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
        <DiaModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          dia={dia}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default DiaTable;


