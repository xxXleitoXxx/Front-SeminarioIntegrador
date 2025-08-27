import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types";
import type { RangoEtarioDTO } from "../../types";
import { RangoEtarioService } from "../../services/RangoEtarioService";
import EmptyState from "../EmptyState/EmptyState";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import RangoEtarioModal from "../RangoEtarioModal/RangoEtarioModal";

const RangoEtarioTable = () => {
  const initializableNew = (): RangoEtarioDTO => ({
    codRangoEtario: 0,
    edadDesde: 0,
    edadHasta: 0,
    fechaBajaRangoEtario: null,
    fechaAltaRangoEtario: new Date(),
    nombreRangoEtario: "",
  });

  const [rango, setRango] = useState<RangoEtarioDTO>(initializableNew());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState<RangoEtarioDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const handleClick = (
    newTitle: string,
    entity: RangoEtarioDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setRango(entity);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchAll = async () => {
      const data = await RangoEtarioService.getRangos();
      setRows(data);
      setIsLoading(false);
    };
    fetchAll();
  }, [refreshData]);

  return (
    <div className="articulo-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>🎯 Gestión de Rangos Etarios</h1>
          <p className="page-subtitle">Administra los rangos etarios</p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick(
              "Añadir Rango Etario",
              initializableNew(),
              ModalType.CREATE
            )
          }
        >
          <span className="btn-icon">+</span>
          Nuevo Rango Etario
        </Button>
      </div>
      {isLoading ? (
        <div className="loader-container">
          <Loader variant="container" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No hay rangos etarios registrados"
          message="Haz clic en 'Nuevo Rango Etario' para agregar uno."
          icon="🎯"
        />
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Edad Desde</th>
                <th>Edad Hasta</th>
                <th>Estado</th>
                <th>Fecha y Hora de Baja</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.codRangoEtario} className="table-row-modern">
                  <td className="text-center">{r.codRangoEtario}</td>
                  <td>{r.nombreRangoEtario}</td>
                  <td className="text-center">{r.edadDesde}</td>
                  <td className="text-center">{r.edadHasta}</td>
                  <td className="text-center">
                    <span className={`status-badge ${r.fechaBajaRangoEtario ? 'inactive' : 'active'}`}>{r.fechaBajaRangoEtario ? 'Inactivo' : 'Activo'}</span>
                  </td>
                  <td className="text-center">
                    {r.fechaBajaRangoEtario ? (
                      <span className="fecha-baja">
                        {new Date(r.fechaBajaRangoEtario).toLocaleString('es-ES', {
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
                          handleClick("Editar rango etario", r, ModalType.UPDATE)
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar rango etario", r, ModalType.DELETE)
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
        <RangoEtarioModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          rango={rango}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default RangoEtarioTable;


