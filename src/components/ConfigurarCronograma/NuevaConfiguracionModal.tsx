import { useState } from "react";
import { Button, Form, Modal, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import type {
  ConfHorarioTipoClaseDTO,
  HorarioiDiaxTipoClaseDTO,
  TipoClaseDTO,
} from "../../types";
import { ConfHorarioTipoClaseService } from "../../services/ConfHorarioTipoClaseService";

const NuevaConfiguracionModal = ({
  show,
  onHide,
  tiposClase,
  diasSemana,
  fetchData,
}: {
  show: boolean;
  onHide: () => void;
  tiposClase: TipoClaseDTO[];
  diasSemana: { codDia: number; nombreDia: string }[];
  fetchData: () => void;
}) => {
  const [nuevaConfiguracion, setNuevaConfiguracion] =
    useState<ConfHorarioTipoClaseDTO>({
      nroConfTC: 0,
      fechaVigenciaConf: new Date(),
      fechaFinVigenciaConf: null,
      horarioiDiaxTipoClaseList: [],
      fechaHoraBaja: null, // Added missing property
    });

  const [nuevoHorario, setNuevoHorario] = useState<HorarioiDiaxTipoClaseDTO>({
    nroHFxTC: 0,
    fechaBajaHFxTC: null,
    horaDesde: "08:00",
    horaHasta: "09:00",
    diaDTO: {
      codDia: diasSemana?.[0]?.codDia || 0,
      fechaBajaDia: null,
      nombreDia: diasSemana?.[0]?.nombreDia || "",
    },
    tipoClase: {
      codTipoClase: 0,
      fechaBajaTipoClase: null,
      nombreTipoClase: "",
      cupoMaxTipoClase: 0,
      rangoEtarioDTO: {
        codRangoEtario: 0,
        nombreRangoEtario: "",
        fechaBajaRangoEtario: null,
        edadDesde: 0,
        edadHasta: 0,
      },
    },
  });

  const handleAddHorario = () => {
    console.log("Agregando horario:", nuevoHorario);
    console.log("Tipo de clase seleccionado:", nuevoHorario.tipoClase);
    
    setNuevaConfiguracion((prev) => ({
      ...prev,
      horarioiDiaxTipoClaseList: [
        ...prev.horarioiDiaxTipoClaseList,
        { ...nuevoHorario },
      ],
    }));
    setNuevoHorario({
      nroHFxTC: 0,
      fechaBajaHFxTC: null,
      horaDesde: "08:00",
      horaHasta: "09:00",
      diaDTO: {
        codDia: diasSemana?.[0]?.codDia || 0,
        fechaBajaDia: null,
        nombreDia: diasSemana?.[0]?.nombreDia || "",
      },
      tipoClase: {
        codTipoClase: 0,
        fechaBajaTipoClase: null,
        nombreTipoClase: "",
        cupoMaxTipoClase: 0,
        rangoEtarioDTO: {
          codRangoEtario: 0,
          nombreRangoEtario: "",
          fechaBajaRangoEtario: null,
          edadDesde: 0,
          edadHasta: 0,
        },
      },
    });
  };

  const handleRemoveHorario = (index: number) => {
    setNuevaConfiguracion((prev) => ({
      ...prev,
      horarioiDiaxTipoClaseList: prev.horarioiDiaxTipoClaseList.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmitConfiguracion = async () => {
    try {
      if (nuevaConfiguracion.horarioiDiaxTipoClaseList.length === 0) {
        toast.error("Debe agregar al menos un horario");
        return;
      }

      // Formatear las horas para el backend (HH:MM:SS)
      const configuracionFormateada = {
        ...nuevaConfiguracion,
        horarioiDiaxTipoClaseList: nuevaConfiguracion.horarioiDiaxTipoClaseList.map(horario => ({
          ...horario,
          horaDesde: horario.horaDesde + ":00",
          horaHasta: horario.horaHasta + ":00"
        }))
      };

      const result = await ConfHorarioTipoClaseService.crearConfiguracion(
        configuracionFormateada
      );

      if (typeof result === "string") {
        toast.success(result);
      } else {
        toast.success("Configuración creada exitosamente");
      }

      onHide();
      fetchData();
    } catch (error) {
      console.error("Error creando configuración:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error al crear la configuración: ${errorMessage}`);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Nueva Configuración de Cronograma</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Vigencia</Form.Label>
            <Form.Control
              type="date"
              value={
                nuevaConfiguracion.fechaVigenciaConf
                  ? new Date(nuevaConfiguracion.fechaVigenciaConf)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              readOnly
              style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
            />
            <Form.Text className="text-muted">
              La fecha de vigencia se establece automáticamente como la fecha actual
            </Form.Text>
          </Form.Group>

          <hr />
          <h5>Agregar Horarios</h5>

          <div className="row">
            <div className="col-md-3">
              <Form.Group className="mb-3">
                <Form.Label>Día</Form.Label>
                <Form.Select
                  value={nuevoHorario.diaDTO.codDia}
                  onChange={(e) => {
                    const dia = diasSemana.find(
                      (d) => d.codDia === parseInt(e.target.value)
                    );
                    setNuevoHorario((prev) => ({
                      ...prev,
                      diaDTO: {
                        ...prev.diaDTO,
                        codDia: parseInt(e.target.value),
                        nombreDia: dia?.nombreDia || "Lunes",
                      },
                    }));
                  }}
                >
                  {diasSemana.map((dia) => (
                    <option key={dia.codDia} value={dia.codDia}>
                      {dia.nombreDia}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-2">
              <Form.Group className="mb-3">
                <Form.Label>Hora Desde</Form.Label>
                <Form.Control
                  type="time"
                  value={nuevoHorario.horaDesde}
                  onChange={(e) =>
                    setNuevoHorario((prev) => ({
                      ...prev,
                      horaDesde: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-2">
              <Form.Group className="mb-3">
                <Form.Label>Hora Hasta</Form.Label>
                <Form.Control
                  type="time"
                  value={nuevoHorario.horaHasta}
                  onChange={(e) =>
                    setNuevoHorario((prev) => ({
                      ...prev,
                      horaHasta: e.target.value,
                    }))
                  }
                />
              </Form.Group>
            </div>

            <div className="col-md-3">
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Clase</Form.Label>
                <Form.Select
                  value={nuevoHorario.tipoClase.codTipoClase || ""}
                  onChange={(e) => {
                    const codTipoClase = parseInt(e.target.value);
                    const tipoClase = tiposClase.find(
                      (t) => t.codTipoClase === codTipoClase
                    );
                    setNuevoHorario((prev) => ({
                      ...prev,
                      tipoClase: tipoClase || {
                        codTipoClase: 0,
                        fechaBajaTipoClase: null,
                        nombreTipoClase: "",
                        cupoMaxTipoClase: 0,
                        rangoEtarioDTO: {
                          codRangoEtario: 0,
                          nombreRangoEtario: "",
                          fechaBajaRangoEtario: null,
                          edadDesde: 0,
                          edadHasta: 0,
                        },
                      },
                    }));
                  }}
                >
                  <option value="">Seleccionar tipo de clase</option>
                  {tiposClase.map((tipo) => (
                    <option key={tipo.codTipoClase} value={tipo.codTipoClase}>
                      {tipo.nombreTipoClase}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <Button
                variant="outline-primary"
                onClick={handleAddHorario}
                disabled={
                  !nuevoHorario.horaDesde ||
                  !nuevoHorario.horaHasta ||
                  !nuevoHorario.tipoClase.codTipoClase ||
                  nuevoHorario.tipoClase.codTipoClase === 0
                }
              >
                Agregar
              </Button>
            </div>
          </div>

          {nuevaConfiguracion.horarioiDiaxTipoClaseList.length > 0 && (
            <div className="mt-3">
              <h6>Horarios Agregados:</h6>
              <div className="horarios-list">
                {nuevaConfiguracion.horarioiDiaxTipoClaseList.map(
                  (horario, index) => (
                    <Badge
                      key={index}
                      bg="primary"
                      className="me-2 mb-2 p-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveHorario(index)}
                    >
                      {horario.diaDTO.nombreDia} {horario.horaDesde}-
                      {horario.horaHasta}({horario.tipoClase.nombreTipoClase})
                      <span className="ms-2">×</span>
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmitConfiguracion}
          disabled={nuevaConfiguracion.horarioiDiaxTipoClaseList.length === 0}
        >
          Crear Configuración
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NuevaConfiguracionModal;
