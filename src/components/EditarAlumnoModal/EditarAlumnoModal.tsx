import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import type {
  AlumnoDTO,
  LocalidadDTO,
  ContactoEmergenciaDTO,
} from "../../types/index";
import { AlumnoService } from "../../services/AlumnoService";
import { LocalidadService } from "../../services/LocalidadService";
import "./EditarAlumnoModal.css";

type EditarAlumnoModalProps = {
  show: boolean;
  onHide: () => void;
  alumno: AlumnoDTO;
  refreshData: (callback: (prevState: boolean) => boolean) => void;
};

const EditarAlumnoModal = ({
  show,
  onHide,
  alumno,
  refreshData,
}: EditarAlumnoModalProps) => {
  const [alumnoData, setAlumnoData] = useState<AlumnoDTO>(alumno);
  const [localidades, setLocalidades] = useState<LocalidadDTO[]>([]);
  const [contactosEmergencia, setContactosEmergencia] = useState<
    ContactoEmergenciaDTO[]
  >(alumno.contactosEmergencia || []);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (show) {
      loadLocalidades();
      setAlumnoData(alumno);
      setContactosEmergencia(alumno.contactosEmergencia || []);
    }
  }, [show, alumno]);

  const loadLocalidades = async () => {
    try {
      const data = await LocalidadService.getLocalidades();
      setLocalidades(data);
    } catch (error) {
      console.error("Error cargando localidades:", error);
      toast.error("Error al cargar las localidades", {
        position: "top-center",
      });
    }
  };

  const handleInputChange = (field: keyof AlumnoDTO, value: any) => {
    setAlumnoData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleContactoChange = (
    index: number,
    field: keyof ContactoEmergenciaDTO,
    value: any
  ) => {
    const newContactos = [...contactosEmergencia];
    newContactos[index] = {
      ...newContactos[index],
      [field]: value,
    };
    setContactosEmergencia(newContactos);
  };

  const addContacto = () => {
    setContactosEmergencia([
      ...contactosEmergencia,
      {
        id: 0,
        direccionContacto: "",
        nombreContacto: "",
        telefonoContacto: 0,
      },
    ]);
  };

  const removeContacto = (index: number) => {
    setContactosEmergencia(contactosEmergencia.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!alumnoData.dniAlumno) newErrors.dniAlumno = "El DNI es obligatorio";
    if (!alumnoData.nombreAlumno.trim())
      newErrors.nombreAlumno = "El nombre es obligatorio";
    if (!alumnoData.apellidoAlumno.trim())
      newErrors.apellidoAlumno = "El apellido es obligatorio";
    if (!alumnoData.telefonoAlumno)
      newErrors.telefonoAlumno = "El teléfono es obligatorio";
    if (!alumnoData.mailAlumno.trim())
      newErrors.mailAlumno = "El email es obligatorio";
    if (!alumnoData.domicilioAlumno.trim())
      newErrors.domicilioAlumno = "El domicilio es obligatorio";
    if (!alumnoData.localidadAlumno)
      newErrors.localidadAlumno = "La localidad es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Mantener la ficha médica existente (no se modifica en edición)
      alumnoData.fichaMedicaDTO = alumno.fichaMedicaDTO;

      // Agregar contactos de emergencia
      alumnoData.contactosEmergencia = contactosEmergencia;

      await AlumnoService.updateAlumno(alumnoData);

      toast.success("Alumno actualizado con éxito", { position: "top-center" });
      onHide();
      refreshData((prevState) => !prevState);
    } catch (error) {
      refreshData((prevState) => !prevState);
      console.error(error);
      toast.error(
        `Ha ocurrido un error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        { position: "top-center" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="modal-header-warning">
        <Modal.Title>
          <span className="modal-icon">✏️</span>
          Editar Alumno
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Alert variant="info" className="mb-3">
            <strong>Nota:</strong> Las fichas médicas se gestionan desde el
            modal de fichas médicas. Aquí solo puedes editar la información
            personal del alumno.
          </Alert>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>DNI *</Form.Label>
                <Form.Control
                  type="number"
                  value={alumnoData.dniAlumno || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "dniAlumno",
                      parseInt(e.target.value) || 0
                    )
                  }
                  isInvalid={!!errors.dniAlumno}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.dniAlumno}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Nacimiento</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    alumnoData.fechaNacAlumno instanceof Date
                      ? alumnoData.fechaNacAlumno.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "fechaNacAlumno",
                      new Date(e.target.value)
                    )
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  value={alumnoData.nombreAlumno}
                  onChange={(e) =>
                    handleInputChange("nombreAlumno", e.target.value)
                  }
                  isInvalid={!!errors.nombreAlumno}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombreAlumno}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  value={alumnoData.apellidoAlumno}
                  onChange={(e) =>
                    handleInputChange("apellidoAlumno", e.target.value)
                  }
                  isInvalid={!!errors.apellidoAlumno}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.apellidoAlumno}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  type="number"
                  value={alumnoData.telefonoAlumno || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "telefonoAlumno",
                      parseInt(e.target.value) || 0
                    )
                  }
                  isInvalid={!!errors.telefonoAlumno}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.telefonoAlumno}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={alumnoData.mailAlumno}
                  onChange={(e) =>
                    handleInputChange("mailAlumno", e.target.value)
                  }
                  isInvalid={!!errors.mailAlumno}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mailAlumno}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Domicilio *</Form.Label>
                <Form.Control
                  type="text"
                  value={alumnoData.domicilioAlumno}
                  onChange={(e) =>
                    handleInputChange("domicilioAlumno", e.target.value)
                  }
                  isInvalid={!!errors.domicilioAlumno}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.domicilioAlumno}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Localidad *</Form.Label>
                <Form.Select
                  value={alumnoData.localidadAlumno?.codLocalidad || ""}
                  onChange={(e) => {
                    const localidad = localidades.find(
                      (l) => l.codLocalidad === parseInt(e.target.value)
                    );
                    handleInputChange("localidadAlumno", localidad || null);
                  }}
                  isInvalid={!!errors.localidadAlumno}
                >
                  <option value="">Seleccionar localidad</option>
                  {localidades.map((localidad) => (
                    <option
                      key={localidad.codLocalidad}
                      value={localidad.codLocalidad}
                    >
                      {localidad.nombreLocalidad}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.localidadAlumno}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Sección de Contactos de Emergencia */}
          <div className="contactos-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="section-title">🚨 Contactos de Emergencia</h6>
              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                onClick={addContacto}
              >
                + Agregar Contacto
              </Button>
            </div>

            {contactosEmergencia.map((contacto, index) => (
              <Row key={index} className="contacto-row mb-3">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Nombre del contacto"
                    value={contacto.nombreContacto}
                    onChange={(e) =>
                      handleContactoChange(
                        index,
                        "nombreContacto",
                        e.target.value
                      )
                    }
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Dirección del contacto"
                    value={contacto.direccionContacto}
                    onChange={(e) =>
                      handleContactoChange(
                        index,
                        "direccionContacto",
                        e.target.value
                      )
                    }
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    placeholder="Teléfono"
                    value={contacto.telefonoContacto || ""}
                    onChange={(e) =>
                      handleContactoChange(
                        index,
                        "telefonoContacto",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                </Col>
                <Col md={1}>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeContacto(index)}
                  >
                    🗑️
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="warning" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Actualizando...
              </>
            ) : (
              "Actualizar Alumno"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditarAlumnoModal;
