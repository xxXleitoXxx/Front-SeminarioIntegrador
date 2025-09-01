import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Table,
  Spinner,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { toast } from "react-toastify";
import type { FichaMedicaDTO } from "../../types/FichaMedicaDTO";
import { FichaMedicaService } from "../../services/FichaMedicaService";
import "./FichasMedicasModal.css";

type FichasMedicasModalProps = {
  show: boolean;
  onHide: () => void;
  alumnoId: number;
  alumnoNombre: string;
};

type FiltroEstado = "todos" | "vigente" | "pendiente" | "vencida";

const FichasMedicasModal = ({
  show,
  onHide,
  alumnoId,
  alumnoNombre,
}: FichasMedicasModalProps) => {
  const [fichasMedicas, setFichasMedicas] = useState<FichaMedicaDTO[]>([]);
  const [fichasFiltradas, setFichasFiltradas] = useState<FichaMedicaDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddingFicha, setIsAddingFicha] = useState(false);

  useEffect(() => {
    if (show && alumnoId) {
      loadFichasMedicas();
    }
  }, [show, alumnoId]);

  useEffect(() => {
    aplicarFiltros();
  }, [fichasMedicas, filtroEstado]);

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

  const aplicarFiltros = () => {
    let filtradas = [...fichasMedicas];

    if (filtroEstado !== "todos") {
      const fechaActual = new Date();
      filtradas = filtradas.filter((ficha) => {
        const desde = new Date(ficha.vigenciaDesde);
        const hasta = new Date(ficha.vigenciaHasta);

        switch (filtroEstado) {
          case "vigente":
            return fechaActual >= desde && fechaActual <= hasta;
          case "pendiente":
            return fechaActual < desde;
          case "vencida":
            return fechaActual > hasta;
          default:
            return true;
        }
      });
    }

    setFichasFiltradas(filtradas);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      toast.success("Archivo PDF seleccionado correctamente", {
        position: "top-center",
      });
    } else {
      toast.error("Por favor selecciona un archivo PDF válido", {
        position: "top-center",
      });
      setSelectedFile(null);
    }
  };

  const handleAddFicha = async () => {
    if (!selectedFile) {
      toast.error("Por favor selecciona un archivo PDF", {
        position: "top-center",
      });
      return;
    }

    setIsAddingFicha(true);
    try {
      // Convertir archivo a Uint8Array
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Crear nueva ficha médica en el formato exacto que espera el backend
      const nuevaFicha: FichaMedicaDTO = {
        id: 0, // El backend asignará el ID
        vigenciaDesde: new Date(),
        vigenciaHasta: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ), // 1 año de vigencia por defecto
        archivo: uint8Array,
      };

      // Llamar al servicio para agregar la ficha
      const resultado = await FichaMedicaService.agregarFichaMedica(
        alumnoId,
        nuevaFicha
      );

      if (
        typeof resultado === "string" &&
        resultado.includes("correctamente")
      ) {
        toast.success("Ficha médica agregada correctamente", {
          position: "top-center",
        });
        setSelectedFile(null);
        // Recargar las fichas médicas
        await loadFichasMedicas();
      } else {
        toast.error("Error al agregar la ficha médica", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error al agregar ficha médica:", error);
      toast.error(
        `Error al agregar la ficha médica: ${
          error instanceof Error ? error.message : String(error)
        }`,
        {
          position: "top-center",
        }
      );
    } finally {
      setIsAddingFicha(false);
    }
  };

  const handleDownloadFicha = (ficha: FichaMedicaDTO) => {
    if (ficha.archivo) {
      try {
        let archivoBytes: Uint8Array;

        // El backend puede devolver el archivo como string base64 o como array de números
        if (typeof ficha.archivo === "string") {
          // Si es string base64, convertirlo a Uint8Array
          const binaryString = atob(ficha.archivo);
          archivoBytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            archivoBytes[i] = binaryString.charCodeAt(i);
          }
        } else if (Array.isArray(ficha.archivo)) {
          // Si es array de números, convertirlo a Uint8Array
          archivoBytes = new Uint8Array(ficha.archivo);
        } else {
          // Si ya es Uint8Array, usarlo directamente
          archivoBytes = ficha.archivo;
        }

        // Crear blob y descargar
        const blob = new Blob([archivoBytes], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ficha_medica_${alumnoNombre}_${ficha.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Archivo descargado correctamente", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error al procesar archivo:", error);
        toast.error("Error al procesar el archivo para descarga", {
          position: "top-center",
        });
      }
    } else {
      toast.error("No hay archivo disponible para descargar", {
        position: "top-center",
      });
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusBadge = (vigenciaDesde: Date, vigenciaHasta: Date) => {
    const fechaActual = new Date();
    const desde = new Date(vigenciaDesde);
    const hasta = new Date(vigenciaHasta);

    if (fechaActual >= desde && fechaActual <= hasta) {
      return <Badge bg="success">Vigente</Badge>;
    } else if (fechaActual < desde) {
      return (
        <Badge bg="warning" text="dark">
          Pendiente
        </Badge>
      );
    } else {
      return <Badge bg="danger">Vencida</Badge>;
    }
  };

  const getEstadisticas = () => {
    const fechaActual = new Date();
    const vigentes = fichasMedicas.filter((ficha) => {
      const desde = new Date(ficha.vigenciaDesde);
      const hasta = new Date(ficha.vigenciaHasta);
      return fechaActual >= desde && fechaActual <= hasta;
    }).length;

    const pendientes = fichasMedicas.filter((ficha) => {
      const desde = new Date(ficha.vigenciaDesde);
      return fechaActual < desde;
    }).length;

    const vencidas = fichasMedicas.filter((ficha) => {
      const hasta = new Date(ficha.vigenciaHasta);
      return fechaActual > hasta;
    }).length;

    return { vigentes, pendientes, vencidas };
  };

  const estadisticas = getEstadisticas();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      className="modal-modern modal-xl"
    >
      <Modal.Header closeButton className="modal-header-medical">
        <Modal.Title>
          <span className="modal-icon">🏥</span>
          Fichas Médicas - {alumnoNombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-medical">
        {isLoading ? (
          <div className="loading-container">
            <Spinner
              animation="border"
              role="status"
              className="loading-spinner"
            >
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
            <p className="loading-text">Cargando fichas médicas...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{error}</p>
            <Button
              variant="outline-primary"
              onClick={loadFichasMedicas}
              size="sm"
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            {/* Estadísticas */}
            <Row className="mb-3">
              <Col md={3}>
                <div className="stat-card stat-vigente">
                  <h6>Vigentes</h6>
                  <span className="stat-number">{estadisticas.vigentes}</span>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card stat-pendiente">
                  <h6>Pendientes</h6>
                  <span className="stat-number">{estadisticas.pendientes}</span>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card stat-vencida">
                  <h6>Vencidas</h6>
                  <span className="stat-number">{estadisticas.vencidas}</span>
                </div>
              </Col>
              <Col md={3}>
                <div className="stat-card stat-total">
                  <h6>Total</h6>
                  <span className="stat-number">{fichasMedicas.length}</span>
                </div>
              </Col>
            </Row>

            {/* Filtros y Nueva Ficha */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Filtrar por Estado:</Form.Label>
                  <Form.Select
                    value={filtroEstado}
                    onChange={(e) =>
                      setFiltroEstado(e.target.value as FiltroEstado)
                    }
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="vigente">Solo Vigentes</option>
                    <option value="pendiente">Solo Pendientes</option>
                    <option value="vencida">Solo Vencidas</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setFiltroEstado("todos")}
                  disabled={filtroEstado === "todos"}
                >
                  Limpiar Filtros
                </Button>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    size="sm"
                    placeholder="Seleccionar PDF"
                  />
                  <Button
                    variant="success"
                    size="sm"
                    onClick={handleAddFicha}
                    disabled={!selectedFile || isAddingFicha}
                  >
                    {isAddingFicha ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-1"
                        />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">+</span>
                        Nueva Ficha
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Tabla con Scroll */}
            {fichasFiltradas.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p className="empty-message">
                  {fichasMedicas.length === 0
                    ? "No hay fichas médicas registradas para este alumno."
                    : "No hay fichas médicas que coincidan con el filtro seleccionado."}
                </p>
              </div>
            ) : (
              <div className="table-container-scroll">
                <Table striped bordered hover className="fichas-table">
                  <thead className="table-header-sticky">
                    <tr>
                      <th>ID</th>
                      <th>Estado</th>
                      <th>Vigencia Desde</th>
                      <th>Vigencia Hasta</th>
                      <th>Archivo</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fichasFiltradas.map((ficha, index) => (
                      <tr key={index}>
                        <td>{ficha.id}</td>
                        <td>
                          {getStatusBadge(
                            ficha.vigenciaDesde,
                            ficha.vigenciaHasta
                          )}
                        </td>
                        <td>{formatDate(ficha.vigenciaDesde)}</td>
                        <td>{formatDate(ficha.vigenciaHasta)}</td>
                        <td>
                          {(() => {
                            if (!ficha.archivo)
                              return (
                                <span className="no-file">Sin archivo</span>
                              );

                            if (typeof ficha.archivo === "string") {
                              const archivoString = ficha.archivo as string;
                              return archivoString.length > 0 ? (
                                <span className="file-info">
                                  📄 Archivo disponible (
                                  {(archivoString.length / 1024).toFixed(2)} KB)
                                </span>
                              ) : (
                                <span className="no-file">Sin archivo</span>
                              );
                            }

                            if (Array.isArray(ficha.archivo)) {
                              const archivoArray = ficha.archivo as number[];
                              return archivoArray.length > 0 ? (
                                <span className="file-info">
                                  📄 Archivo disponible (
                                  {(archivoArray.length / 1024).toFixed(2)} KB)
                                </span>
                              ) : (
                                <span className="no-file">Sin archivo</span>
                              );
                            }

                            return <span className="no-file">Sin archivo</span>;
                          })()}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleDownloadFicha(ficha)}
                            disabled={!ficha.archivo}
                            title="Descargar PDF"
                          >
                            📥 Descargar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-medical">
        <div className="d-flex justify-content-between w-100">
          <div className="text-muted">
            Mostrando {fichasFiltradas.length} de {fichasMedicas.length} fichas
            médicas
          </div>
          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="btn-close"
          >
            Cerrar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FichasMedicasModal;
