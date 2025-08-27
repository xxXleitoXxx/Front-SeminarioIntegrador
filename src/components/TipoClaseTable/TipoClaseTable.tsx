import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types";
import type { TipoClaseDTO } from "../../types";
import { TipoClaseService } from "../../services/TipoClaseService";
import EmptyState from "../EmptyState/EmptyState";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import TipoClaseModal from "../TipoClaseModal/TipoClaseModal";

const TipoClaseTable = () => {
  const initializableNew = (): TipoClaseDTO => ({
    codTipoClase: 0,
    nombreTipoClase: "",
    descripcionTipoClase: "",
    fechaBajaTipoClase: null,
    cupoMaxTipoClase: 0,
    rangoEtario: { codRangoEtario: 0, edadDesde: 0, edadHasta: 0, fechaBajaRangoEtario: null, fechaAltaRangoEtario: new Date(), nombreRangoEtario: "" }
  });

  const [tipoClase, setTipoClase] = useState<TipoClaseDTO>(initializableNew());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState<TipoClaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const handleClick = (
    newTitle: string,
    entity: TipoClaseDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setTipoClase(entity);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchAll = async () => {
      const data = await TipoClaseService.getTipoClases();
      setRows(data);
      setIsLoading(false);
    };
    fetchAll();
  }, [refreshData]);

  return (
    <div className="articulo-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>🏷️ Gestión de Tipos de Clase</h1>
          <p className="page-subtitle">Administra los tipos de clase</p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick(
              "Añadir Tipo de Clase",
              initializableNew(),
              ModalType.CREATE
            )
          }
        >
          <span className="btn-icon">+</span>
          Nuevo Tipo de Clase
        </Button>
      </div>
      {isLoading ? (
        <div className="loader-container">
          <Loader variant="container" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No hay tipos de clase registrados"
          message="Haz clic en 'Nuevo Tipo de Clase' para agregar uno."
          icon="🏷️"
        />
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cupo Máximo</th>
                <th>Rango Etario</th>
                <th>Estado</th>
                <th>Fecha y Hora de Baja</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.codTipoClase} className="table-row-modern">
                  <td className="text-center">{r.codTipoClase}</td>
                  <td>{r.nombreTipoClase}</td>
                  <td>{r.descripcionTipoClase || '-'}</td>
                  <td className="text-center">{r.cupoMaxTipoClase}</td>
                  <td className="text-center">{r.rangoEtario?.nombreRangoEtario || `${r.rangoEtario?.edadDesde}-${r.rangoEtario?.edadHasta}`}</td>
                  <td className="text-center">
                    <span className={`status-badge ${r.fechaBajaTipoClase ? 'inactive' : 'active'}`}>{r.fechaBajaTipoClase ? 'Inactivo' : 'Activo'}</span>
                  </td>
                  <td className="text-center">
                    {r.fechaBajaTipoClase ? (
                      <span className="fecha-baja">
                        {new Date(r.fechaBajaTipoClase).toLocaleString('es-ES', {
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
                          handleClick("Editar tipo de clase", r, ModalType.UPDATE)
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar tipo de clase", r, ModalType.DELETE)
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
        <TipoClaseModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          tipoClase={tipoClase}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default TipoClaseTable;


