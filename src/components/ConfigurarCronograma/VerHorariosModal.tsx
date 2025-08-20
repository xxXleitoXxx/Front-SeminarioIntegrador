import { Modal, Table, Badge, Button } from "react-bootstrap";
import { Clock } from "react-bootstrap-icons";
import type {
  ConfHorarioTipoClaseDTO,
  HorarioiDiaxTipoClaseDTO,
} from "../../types";

const VerHorariosModal = ({
  show,
  onHide,
  selectedConfig,
  selectedHorarios,
}: {
  show: boolean;
  onHide: () => void;
  selectedConfig: ConfHorarioTipoClaseDTO | null;
  selectedHorarios: HorarioiDiaxTipoClaseDTO[];
}) => {
  const formatDate = (date: Date | null) => {
    if (!date) return "No definida";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "--:--";
    return timeString.substring(0, 5);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          📅 Horarios de Configuración #{selectedConfig?.nroConfTC}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedConfig && (
          <div>
            <div className="mb-3">
              <h6>Información de la Configuración:</h6>
              <div className="row">
                <div className="col-md-6">
                  <strong>Fecha de Vigencia:</strong>{" "}
                  {formatDate(selectedConfig.fechaVigenciaConf)}
                </div>
                <div className="col-md-6">
                  <strong>Fecha Fin Vigencia:</strong>{" "}
                  {formatDate(selectedConfig.fechaFinVigenciaConf)}
                </div>
              </div>
            </div>

            <hr />

            {selectedHorarios.length > 0 ? (
              <div>
                <h6>Horarios Configurados:</h6>
                <Table className="table-modern" striped bordered hover>
                  <thead>
                    <tr>
                      <th>Día</th>
                      <th>Hora Desde</th>
                      <th>Hora Hasta</th>
                      <th>Tipo de Clase</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHorarios.map((horario, index) => (
                      <tr key={index} className="table-row-modern">
                        <td className="text-center">
                          <Badge bg="secondary">
                            {horario.diaDTO.nombreDia}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Clock className="me-1" />
                          {formatTime(horario.horaDesde)}
                        </td>
                        <td className="text-center">
                          <Clock className="me-1" />
                          {formatTime(horario.horaHasta)}
                        </td>
                        <td className="text-center">
                          <Badge bg="primary">
                            {horario.tipoClase.nombreTipoClase}
                          </Badge>
                        </td>
                        <td className="text-center">
                          {horario.fechaBajaHFxTC ? (
                            <Badge bg="danger">Inactivo</Badge>
                          ) : (
                            <Badge bg="success">Activo</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p>No hay horarios configurados para esta configuración</p>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VerHorariosModal;
