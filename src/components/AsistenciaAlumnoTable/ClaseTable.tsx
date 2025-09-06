import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types";
import type { AlumnoDTO, ClaseDTO } from "../../types";
import EmptyState from "../EmptyState/EmptyState";
import { ClaseService } from "../../services/ClaseService";
import type { ClaseAlumnoDTO } from "../../types/ClaseAlumnoDTO";
import { ClaseAlumnoService } from "../../services/ClaseAlumnoService";
import ClaseAlumnoModal from "../AsistenciaAlumnoModal/ClaseAlumnoModal";

const ClaseTable = () => {
  const initializableNewClaseAlumno = (): ClaseAlumnoDTO[] => [
    {
      nroClaseAlumno: 0,
      presenteClaseAlumno: false,
      alumnodto: {} as AlumnoDTO,
    },
  ];
  const [claseAlumno, setClaseAlumno] = useState<ClaseAlumnoDTO[]>(
    initializableNewClaseAlumno()
  );
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");
  const [clases, setClases] = useState<ClaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const handleClick = (
    newTitle: string,
    entity: ClaseAlumnoDTO[],
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setClaseAlumno(entity);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchClases = async () => {
      const data = await ClaseService.getClases();
      setClases(data);
      setIsLoading(false);
    };
    fetchClases();
  }, [refreshData]);

  const handleClaseAlumno = (idClase: number): void => {
    const fetchClaseAlumno = async () => {
      const data = await ClaseAlumnoService.getAsistenciaClaseAlumno(idClase);
      setClaseAlumno(data);
    };
    fetchClaseAlumno();
  };

  return (
    <div className="articulo-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>Tomar Asistencia</h1>
          <p className="page-subtitle">Tomar Asistencia a los alumnos</p>
        </div>
        {/* <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick("Añadir Clase", initializableNewClase(), ModalType.CREATE)
          }
        >
          <span className="btn-icon">+</span>
          Nueva Clase
        </Button> */}
      </div>
      {isLoading ? (
        <div className="loader-container">
          <Loader variant="container" />
        </div>
      ) : clases.length === 0 ? (
        <EmptyState
          title="No hay clases registradas"
          message="Haz clic en 'Nueva Clase' para agregar una."
          icon="📅"
        />
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>nroClase</th>
                <th>Tipo Clase</th>
                <th>Estado</th>
                <th>Fecha Clase</th>
                <th>Hora Clase</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((d) => (
                <tr key={d.nroClase} className="table-row-modern">
                  <td className="text-center">{d.nroClase}</td>
                  <td>{d.tipoClase.nombreTipoClase}</td>
                  <td className="text-center">
                    <span
                      className={`status-badge ${
                        d.fechaBajaClase ? "inactive" : "active"
                      }`}
                    >
                      {d.fechaBajaClase ? "Inactivo" : "Activo"}
                    </span>
                  </td>
                  <td className="text-center">
                    {d.fechaHoraClase ? (
                      <span className="fecha">
                        {new Date(d.fechaHoraClase).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </span>
                    ) : (
                      <span className="no-fecha">-</span>
                    )}
                  </td>
                  <td>
                    <span className="fecha">
                      {new Date(d.fechaHoraClase).toLocaleString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>

                  <td className="text-center">
                    <div className="action-buttons">
                      <Button
                        variant="success"
                        onClick={() => {
                          handleClaseAlumno(d.nroClase);
                          handleClick(
                            "Tomar asistencia",
                            claseAlumno,
                            ModalType.UPDATE
                          );
                        }}
                      >
                        Tomar Asistencia
                      </Button>

                      {/* <EditButton
                        onClick={() =>
                          handleClick("Editar día", d, ModalType.UPDATE)
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar día", d, ModalType.DELETE)
                        }
                      /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {showModal && (
        <ClaseAlumnoModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          claseAlumno={claseAlumno}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default ClaseTable;
