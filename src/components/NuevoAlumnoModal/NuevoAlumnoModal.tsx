import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import type { AlumnoDTO, LocalidadDTO, ContactoEmergenciaDTO, FichaMedicaDTO } from "../../types/index";
import { AlumnoService } from "../../services/AlumnoService";
import { LocalidadService } from "../../services/LocalidadService";
import "./NuevoAlumnoModal.css";

type NuevoAlumnoModalProps = {
  show: boolean;
  onHide: () => void;
  refreshData: (callback: (prevState: boolean) => boolean) => void;
};

const NuevoAlumnoModal = ({
  show,
  onHide,
  refreshData,
}: NuevoAlumnoModalProps) => {
  const [alumnoData, setAlumnoData] = useState<AlumnoDTO>({
    nroAlumno: 0,
    dniAlumno: 0,
    domicilioAlumno: "",
    fechaNacAlumno: new Date(),
    nombreAlumno: "",
    apellidoAlumno: "",
    telefonoAlumno: 0,
    mailAlumno: "",
    localidadAlumno: null,
    contactosEmergencia: [],
    fichaMedicaDTO: [],
    fechaBajaAlumno: null,
  });

  const [localidades, setLocalidades] = useState<LocalidadDTO[]>([]);
  const [contactosEmergencia, setContactosEmergencia] = useState<ContactoEmergenciaDTO[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (show) {
      loadLocalidades();
      resetForm();
    }
  }, [show]);

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

  const resetForm = () => {
    setAlumnoData({
      nroAlumno: 0,
      dniAlumno: 0,
      domicilioAlumno: "",
      fechaNacAlumno: new Date(),
      nombreAlumno: "",
      apellidoAlumno: "",
      telefonoAlumno: 0,
      mailAlumno: "",
      localidadAlumno: null,
      contactosEmergencia: [],
      fichaMedicaDTO: [],
      fechaBajaAlumno: null,
    });
    setContactosEmergencia([]);
    setSelectedFile(null);
    setErrors({});
  };

  const handleInputChange = (field: keyof AlumnoDTO, value: any) => {
    setAlumnoData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleContactoChange = (index: number, field: keyof ContactoEmergenciaDTO, value: any) => {
    const newContactos = [...contactosEmergencia];
    newContactos[index] = {
      ...newContactos[index],
      [field]: value
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!alumnoData.dniAlumno) newErrors.dniAlumno = "El DNI es obligatorio";
    if (!alumnoData.nombreAlumno.trim()) newErrors.nombreAlumno = "El nombre es obligatorio";
    if (!alumnoData.apellidoAlumno.trim()) newErrors.apellidoAlumno = "El apellido es obligatorio";
    if (!alumnoData.telefonoAlumno) newErrors.telefonoAlumno = "El teléfono es obligatorio";
    if (!alumnoData.mailAlumno.trim()) newErrors.mailAlumno = "El email es obligatorio";
    if (!alumnoData.domicilioAlumno.trim()) newErrors.domicilioAlumno = "El domicilio es obligatorio";
    if (!alumnoData.localidadAlumno) newErrors.localidadAlumno = "La localidad es obligatoria";

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
      // Procesar archivo PDF si se seleccionó uno
      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const fichaMedica: FichaMedicaDTO = {
          id: 0,
          vigenciaDesde: new Date(),
          vigenciaHasta: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 año de vigencia por defecto
          archivo: uint8Array,
        };

        alumnoData.fichaMedicaDTO = [fichaMedica];
      } else {
        // Si no se seleccionó archivo, crear una ficha médica por defecto
        const fichaMedica: FichaMedicaDTO = {
          id: 0,
          vigenciaDesde: new Date(),
          vigenciaHasta: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 año de vigencia por defecto
          archivo: new Uint8Array([1, 2, 3, 4, 5]), // Archivo por defecto
        };

        alumnoData.fichaMedicaDTO = [fichaMedica];
      }

      // Agregar contactos de emergencia
      alumnoData.contactosEmergencia = contactosEmergencia;

      await AlumnoService.createAlumno(alumnoData);

      toast.success("Alumno creado con éxito", { position: "top-center" });
      onHide();
      refreshData((prevState) => !prevState);
    } catch (error) {
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
      <Modal.Header closeButton className="modal-header-primary">
        <Modal.Title>
          <span className="modal-icon">👨‍🎓</span>
          Nuevo Alumno
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>DNI *</Form.Label>
                <Form.Control
                  type="number"
                  value={alumnoData.dniAlumno || ""}
                  onChange={(e) => handleInputChange("dniAlumno", parseInt(e.target.value) || 0)}
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
                  value={alumnoData.fechaNacAlumno instanceof Date ? alumnoData.fechaNacAlumno.toISOString().split('T')[0] : ""}
                  onChange={(e) => handleInputChange("fechaNacAlumno", new Date(e.target.value))}
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
                  onChange={(e) => handleInputChange("nombreAlumno", e.target.value)}
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
                  onChange={(e) => handleInputChange("apellidoAlumno", e.target.value)}
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
                  onChange={(e) => handleInputChange("telefonoAlumno", parseInt(e.target.value) || 0)}
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
                  onChange={(e) => handleInputChange("mailAlumno", e.target.value)}
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
                  onChange={(e) => handleInputChange("domicilioAlumno", e.target.value)}
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
                    const localidad = localidades.find(l => l.codLocalidad === parseInt(e.target.value));
                    handleInputChange("localidadAlumno", localidad || null);
                  }}
                  isInvalid={!!errors.localidadAlumno}
                >
                  <option value="">Seleccionar localidad</option>
                  {localidades.map((localidad) => (
                    <option key={localidad.codLocalidad} value={localidad.codLocalidad}>
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

          {/* Sección de Ficha Médica */}
          <div className="ficha-medica-section">
            <h6 className="section-title">🏥 Ficha Médica</h6>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Archivo PDF (Opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    placeholder="Seleccionar archivo PDF"
                  />
                  <Form.Text className="text-muted">
                    Si no se selecciona un archivo, se creará una ficha médica por defecto.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>

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
                    onChange={(e) => handleContactoChange(index, "nombreContacto", e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Dirección del contacto"
                    value={contacto.direccionContacto}
                    onChange={(e) => handleContactoChange(index, "direccionContacto", e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    placeholder="Teléfono"
                    value={contacto.telefonoContacto || ""}
                    onChange={(e) => handleContactoChange(index, "telefonoContacto", parseInt(e.target.value) || 0)}
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
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Creando...
              </>
            ) : (
              "Crear Alumno"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default NuevoAlumnoModal;
