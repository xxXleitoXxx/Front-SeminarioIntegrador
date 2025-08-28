import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { AlumnoDTO } from "../../types/AlumnoDTO";
import type { LocalidadDTO } from "../../types/LocalidadDTO";
import type { ContactoEmergenciaDTO } from "../../types/ContactoEmergenciaDTO";
import type { FichaMedicaDTO } from "../../types/FichaMedicaDTO";
import { AlumnoService } from "../../services/AlumnoService";
import { LocalidadService } from "../../services/LocalidadService";

import "./AlumnoModal.css";

type AlumnoModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  alumno: AlumnoDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const AlumnoModal = ({
  show,
  onHide,
  title,
  modalType,
  alumno,
  refreshData,
}: AlumnoModalProps) => {
  const [localidades, setLocalidades] = useState<LocalidadDTO[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [contactosEmergencia, setContactosEmergencia] = useState<
    ContactoEmergenciaDTO[]
  >([]);

  // Cargar localidades al abrir el modal
  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        const data = await LocalidadService.getLocalidades();
        setLocalidades(data);
      } catch (error) {
        console.error("Error cargando localidades:", error);
      }
    };
    if (show) {
      fetchLocalidades();
    }
  }, [show]);

  // Inicializar contactos de emergencia
  useEffect(() => {
    if (alumno.contactosEmergencia && alumno.contactosEmergencia.length > 0) {
      setContactosEmergencia(alumno.contactosEmergencia);
    } else {
      // Siempre agregar al menos un contacto de emergencia por defecto
      const defaultContacto: ContactoEmergenciaDTO = {
        id: 0,
        direccionContacto: "",
        nombreContacto: "",
        telefonoContacto: 0,
      };
      setContactosEmergencia([defaultContacto]);
    }
  }, [alumno]);

  // Guardar o actualizar
  const handleSaveUpdate = async (alumnoData: AlumnoDTO) => {
    try {
      const isNew = alumnoData.nroAlumno === 0;
      console.log("el nro del alumno es: ", alumnoData.nroAlumno);

      // Normalizar propiedad de localidad a 'localidadAlumno'
      // const anyAlumno: any = alumnoData as any;
      // anyAlumno.localidadAlumno = anyAlumno.localidadAlumno ?? anyAlumno.localidad ?? null;
      // if (Object.prototype.hasOwnProperty.call(anyAlumno, 'localidad')) {
      //   delete anyAlumno.localidad;
      // }

      // Procesar archivo PDF si se seleccionó uno
      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const fichaMedica: FichaMedicaDTO = {
          id:
            alumnoData.fichaMedicaDTO && alumnoData.fichaMedicaDTO.length > 0
              ? alumnoData.fichaMedicaDTO[0].id
              : 0,
          vigenciaDesde: new Date(),
          vigenciaHasta: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Por defecto 1 año de vigencia
          archivo: uint8Array,
        };

        alumnoData.fichaMedicaDTO = [fichaMedica]; // Asegurarse de que sea un arreglo
      } else {
        // Si no se seleccionó archivo, crear una ficha médica por defecto
        const fichaMedica: FichaMedicaDTO = {
          id:
            alumnoData.fichaMedicaDTO && alumnoData.fichaMedicaDTO.length > 0
              ? alumnoData.fichaMedicaDTO[0].id
              : 0,
          vigenciaDesde: new Date(),
          vigenciaHasta: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Por defecto 1 año de vigencia
          archivo: new Uint8Array([1, 2, 3, 4, 5]), // Archivo por defecto
        };

        alumnoData.fichaMedicaDTO = [fichaMedica]; // Asegurarse de que sea un arreglo
      }

      // Agregar contactos de emergencia
      alumnoData.contactosEmergencia = contactosEmergencia;

      if (isNew) {
        await AlumnoService.createAlumno(alumnoData);
      } else {
        await AlumnoService.updateAlumno(alumnoData);
      }

      toast.success(
        isNew ? "Alumno creado con éxito" : "Alumno actualizado con éxito",
        { position: "top-center" }
      );
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
    }
  };

  // Baja lógica
  const handleDelete = async () => {
    try {
      await AlumnoService.bajaLogicaAlumno(alumno);
      toast.success("Alumno eliminado con éxito", { position: "top-center" });
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
    }
  };

  // Alta lógica
  const handleAltaLogica = async () => {
    try {
      await AlumnoService.altaLogicaAlumno(alumno);
      toast.success("Alumno dado de alta con éxito", {
        position: "top-center",
      });
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
    }
  };

  // Manejar archivo seleccionado
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      toast.success("Archivo PDF seleccionado correctamente", {
        position: "top-center",
      });
    } else {
      toast.error("Por favor seleccione un archivo PDF válido", {
        position: "top-center",
      });
      event.target.value = "";
    }
  };

  // Agregar contacto de emergencia
  const addContactoEmergencia = () => {
    const nuevoContacto: ContactoEmergenciaDTO = {
      id: 0,
      direccionContacto: "",
      nombreContacto: "",
      telefonoContacto: 0,
    };
    setContactosEmergencia([...contactosEmergencia, nuevoContacto]);
  };

  // Eliminar contacto de emergencia
  const removeContactoEmergencia = (index: number) => {
    setContactosEmergencia(contactosEmergencia.filter((_, i) => i !== index));
  };

  // Actualizar contacto de emergencia
  const updateContactoEmergencia = (
    index: number,
    field: keyof ContactoEmergenciaDTO,
    value: any
  ) => {
    const updatedContactos = [...contactosEmergencia];
    updatedContactos[index] = { ...updatedContactos[index], [field]: value };
    setContactosEmergencia(updatedContactos);
  };

  // Validación
  const validationSchema = Yup.object().shape({
    nroAlumno:
      modalType === ModalType.CREATE
        ? Yup.number().integer().min(0).optional()
        : Yup.number().integer().min(0).required("El AlumnoNro es requerido"),
    dniAlumno: Yup.number()
      .integer()
      .min(1, "El DNI debe ser un número mayor a 0")
      .required("El DNI es requerido"),
    nombreAlumno: Yup.string()
      .trim()
      .min(1, "El nombre es requerido")
      .required("El nombre es requerido"),
    apellidoAlumno: Yup.string()
      .trim()
      .min(1, "El apellido es requerido")
      .required("El apellido es requerido"),
    domicilioAlumno: Yup.string()
      .trim()
      .min(1, "El domicilio es requerido")
      .required("El domicilio es requerido"),
    fechaNacAlumno: Yup.date().required("La fecha de nacimiento es requerida"),
    telefonoAlumno: Yup.number()
      .integer()
      .min(1, "El teléfono debe ser mayor a 0")
      .required("El teléfono es requerido"),
    mailAlumno: Yup.string()
      .email("Email inválido")
      .required("El email es requerido"),
  });

  const formik = useFormik({
    initialValues: { ...alumno },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      // Validación adicional para la localidad
      if (
        !values.localidadAlumno ||
        values.localidadAlumno.codLocalidad === 0
      ) {
        toast.error("Debe seleccionar una localidad", {
          position: "top-center",
        });
        return;
      }

      // Validación para contactos de emergencia
      const contactosValidos = contactosEmergencia.filter(
        (contacto) =>
          contacto.nombreContacto.trim() !== "" && contacto.telefonoContacto > 0
      );

      if (contactosValidos.length === 0) {
        toast.error("Debe agregar al menos un contacto de emergencia válido", {
          position: "top-center",
        });
        return;
      }

      handleSaveUpdate(values);
    },
  });

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <Modal
          show={show}
          onHide={onHide}
          centered
          backdrop="static"
          className="modal-modern"
        >
          <Modal.Header closeButton className="modal-header-danger">
            <Modal.Title>
              <span className="modal-icon">🗑️</span>
              {title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-danger">
            <div className="delete-confirmation">
              <div className="delete-icon">⚠️</div>
              <p className="delete-message">
                ¿Está seguro que desea eliminar el alumno?
              </p>
              <div className="delete-item">
                <strong>
                  {alumno.nombreAlumno} {alumno.apellidoAlumno}
                </strong>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer-danger">
            <Button
              variant="outline-secondary"
              onClick={onHide}
              className="btn-cancel"
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="btn-delete"
            >
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          show={show}
          onHide={onHide}
          centered
          backdrop="static"
          className="modal-modern modal-xl"
          size="xl"
        >
          <Modal.Header closeButton className="modal-header-form">
            <Modal.Title>
              <span className="modal-icon">
                {modalType === ModalType.CREATE ? "➕" : "✏️"}
              </span>
              {title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-form">
            <Form onSubmit={formik.handleSubmit} className="form-modern">
              <div className="form-grid">
                {modalType !== ModalType.CREATE && (
                  <Form.Group
                    controlId="formNroAlumno"
                    className="form-group-modern"
                  >
                    <Form.Label className="form-label-modern">
                      <span className="label-icon">#</span>
                      AlumnoNro
                    </Form.Label>
                    <Form.Control
                      name="nroAlumno"
                      type="number"
                      value={formik.values.nroAlumno || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!(formik.errors.nroAlumno && formik.touched.nroAlumno)
                      }
                      disabled={true}
                      className="form-control-modern"
                      placeholder="Ingrese el AlumnoNro"
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="feedback-modern"
                    >
                      {formik.errors.nroAlumno}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                <Row>
                  <Col md={6}>
                    <Form.Group
                      controlId="formDniAlumno"
                      className="form-group-modern"
                    >
                      <Form.Label className="form-label-modern">
                        <span className="label-icon">🆔</span>
                        DNI
                      </Form.Label>
                      <Form.Control
                        name="dniAlumno"
                        type="number"
                        value={formik.values.dniAlumno || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          !!(
                            formik.errors.dniAlumno && formik.touched.dniAlumno
                          )
                        }
                        className="form-control-modern"
                        placeholder="Ingrese el DNI"
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="feedback-modern"
                      >
                        {formik.errors.dniAlumno}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      controlId="formFechaNacAlumno"
                      className="form-group-modern"
                    >
                      <Form.Label className="form-label-modern">
                        <span className="label-icon">📅</span>
                        Fecha de Nacimiento
                      </Form.Label>
                      <Form.Control
                        name="fechaNacAlumno"
                        type="date"
                        value={
                          formik.values.fechaNacAlumno
                            ? new Date(formik.values.fechaNacAlumno)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          !!(
                            formik.errors.fechaNacAlumno &&
                            formik.touched.fechaNacAlumno
                          )
                        }
                        className="form-control-modern"
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="feedback-modern"
                      >
                        {formik.errors.fechaNacAlumno as string}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group
                      controlId="formNombreAlumno"
                      className="form-group-modern"
                    >
                      <Form.Label className="form-label-modern">
                        <span className="label-icon">👤</span>
                        Nombre
                      </Form.Label>
                      <Form.Control
                        name="nombreAlumno"
                        type="text"
                        value={formik.values.nombreAlumno || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          !!(
                            formik.errors.nombreAlumno &&
                            formik.touched.nombreAlumno
                          )
                        }
                        className="form-control-modern"
                        placeholder="Ingrese el nombre"
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="feedback-modern"
                      >
                        {formik.errors.nombreAlumno}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      controlId="formApellidoAlumno"
                      className="form-group-modern"
                    >
                      <Form.Label className="form-label-modern">
                        <span className="label-icon">👤</span>
                        Apellido
                      </Form.Label>
                      <Form.Control
                        name="apellidoAlumno"
                        type="text"
                        value={formik.values.apellidoAlumno || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          !!(
                            formik.errors.apellidoAlumno &&
                            formik.touched.apellidoAlumno
                          )
                        }
                        className="form-control-modern"
                        placeholder="Ingrese el apellido"
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="feedback-modern"
                      >
                        {formik.errors.apellidoAlumno}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group
                      controlId="formTelefonoAlumno"
                      className="form-group-modern"
                    >
                      <Form.Label className="form-label-modern">
                        <span className="label-icon">📞</span>
                        Teléfono
                      </Form.Label>
                      <Form.Control
                        name="telefonoAlumno"
                        type="number"
                        value={formik.values.telefonoAlumno || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          !!(
                            formik.errors.telefonoAlumno &&
                            formik.touched.telefonoAlumno
                          )
                        }
                        className="form-control-modern"
                        placeholder="Ingrese el teléfono"
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="feedback-modern"
                      >
                        {formik.errors.telefonoAlumno}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group
                      controlId="formMailAlumno"
                      className="form-group-modern"
                    >
                      <Form.Label className="form-label-modern">
                        <span className="label-icon">📧</span>
                        Email
                      </Form.Label>
                      <Form.Control
                        name="mailAlumno"
                        type="email"
                        value={formik.values.mailAlumno || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          !!(
                            formik.errors.mailAlumno &&
                            formik.touched.mailAlumno
                          )
                        }
                        className="form-control-modern"
                        placeholder="Ingrese el email"
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className="feedback-modern"
                      >
                        {formik.errors.mailAlumno}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group
                  controlId="formDomicilioAlumno"
                  className="form-group-modern"
                >
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🏠</span>
                    Domicilio
                  </Form.Label>
                  <Form.Control
                    name="domicilioAlumno"
                    type="text"
                    value={formik.values.domicilioAlumno || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(
                        formik.errors.domicilioAlumno &&
                        formik.touched.domicilioAlumno
                      )
                    }
                    className="form-control-modern"
                    placeholder="Ingrese el domicilio"
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="feedback-modern"
                  >
                    {formik.errors.domicilioAlumno}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  controlId="formLocalidadAlumno"
                  className="form-group-modern"
                >
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🏘️</span>
                    Localidad
                  </Form.Label>
                  <Form.Select
                    name="localidadAlumno"
                    value={formik.values.localidadAlumno?.codLocalidad || ""}
                    onChange={(e) => {
                      const selectedLocalidad = localidades.find(
                        (l) => l.codLocalidad === parseInt(e.target.value)
                      );
                      formik.setFieldValue(
                        "localidadAlumno",
                        selectedLocalidad
                      );
                    }}
                    onBlur={formik.handleBlur}
                    isInvalid={!formik.values.localidadAlumno}
                    className="form-control-modern"
                  >
                    <option value="">Seleccione una localidad</option>
                    {localidades.map((localidad) => (
                      <option
                        key={localidad.codLocalidad}
                        value={localidad.codLocalidad}
                      >
                        {localidad.nombreLocalidad}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback
                    type="invalid"
                    className="feedback-modern"
                  >
                    La localidad es requerida
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Sección de Contactos de Emergencia */}
                <div className="contactos-emergencia-section">
                  <h5 className="section-title">
                    <span className="section-icon">🚨</span>
                    Contactos de Emergencia
                  </h5>
                  {contactosEmergencia.map((contacto, index) => (
                    <div key={index} className="contacto-emergencia-item">
                      <Row>
                        <Col md={4}>
                          <Form.Group className="form-group-modern">
                            <Form.Label className="form-label-modern">
                              Nombre
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={contacto.nombreContacto}
                              onChange={(e) =>
                                updateContactoEmergencia(
                                  index,
                                  "nombreContacto",
                                  e.target.value
                                )
                              }
                              className="form-control-modern"
                              placeholder="Nombre del contacto"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="form-group-modern">
                            <Form.Label className="form-label-modern">
                              Teléfono
                            </Form.Label>
                            <Form.Control
                              type="number"
                              value={contacto.telefonoContacto || ""}
                              onChange={(e) =>
                                updateContactoEmergencia(
                                  index,
                                  "telefonoContacto",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="form-control-modern"
                              placeholder="Teléfono del contacto"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="form-group-modern">
                            <Form.Label className="form-label-modern">
                              Dirección
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={contacto.direccionContacto}
                              onChange={(e) =>
                                updateContactoEmergencia(
                                  index,
                                  "direccionContacto",
                                  e.target.value
                                )
                              }
                              className="form-control-modern"
                              placeholder="Dirección del contacto"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={1}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeContactoEmergencia(index)}
                            className="btn-remove-contacto"
                          >
                            🗑️
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={addContactoEmergencia}
                    className="btn-add-contacto"
                  >
                    ➕ Agregar Contacto de Emergencia
                  </Button>
                </div>

                {/* Sección de Ficha Médica */}
                <div className="ficha-medica-section">
                  <h5 className="section-title">
                    <span className="section-icon">🏥</span>
                    Ficha Médica
                  </h5>
                  <Form.Group
                    controlId="formFichaMedica"
                    className="form-group-modern"
                  >
                    <Form.Label className="form-label-modern">
                      <span className="label-icon">📄</span>
                      Archivo PDF
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="form-control-modern"
                    />
                    <Form.Text className="text-muted">
                      Seleccione un archivo PDF con la ficha médica del alumno
                    </Form.Text>
                    {selectedFile && (
                      <div className="selected-file">
                        <span className="file-name">
                          📎 {selectedFile.name}
                        </span>
                        <span className="file-size">
                          ({(selectedFile.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                    )}
                  </Form.Group>
                </div>
              </div>

              <Modal.Footer className="modal-footer-form">
                <Button
                  variant="outline-secondary"
                  onClick={onHide}
                  className="btn-cancel"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!formik.isValid}
                  className="btn-save"
                >
                  <span className="btn-icon">💾</span>
                  Guardar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default AlumnoModal;
