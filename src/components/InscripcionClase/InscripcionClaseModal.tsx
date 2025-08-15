import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { InscripcionDTO, TipoClaseDTO } from "../../types";
import { InscripcionService } from "../../services/InscripcionService";
import { TipoClaseService } from "../../services/TipoClaseService";

type InscripcionClaseModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  inscripcion: InscripcionDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const InscripcionClaseModal = ({
  show,
  onHide,
  title,
  modalType,
  inscripcion,
  refreshData,
}: InscripcionClaseModalProps) => {
  const [tipoClases, setTipoClases] = useState<TipoClaseDTO[]>([]);

  useEffect(() => {
    const fetchTipoClases = async () => {
      try {
        const data = await TipoClaseService.getTipoClases();
        setTipoClases(data);
      } catch (error) {
        console.error("Error al cargar tipos de clase:", error);
        toast.error("Error al cargar los tipos de clase");
      }
    };
    if (show) {
      fetchTipoClases();
    }
  }, [show]);

  // Crear nueva inscripción
  const handleCreate = async (values: { dniAlumno: number; codTipoClase: number }) => {
    try {
      const result = await InscripcionService.inscribirAlumno(values.dniAlumno, values.codTipoClase);
      const message = typeof result === 'string' ? result : "Inscripción creada con éxito";
      toast.success(message, { position: "top-center" });
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
      const result = await InscripcionService.bajaInscripcion(inscripcion.nroInscripcion);
      const message = typeof result === 'string' ? result : "Inscripción dada de baja con éxito";
      toast.success(message, { position: "top-center" });
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

  // Validación
  const validationSchema = Yup.object().shape({
    dniAlumno: Yup.number().integer().min(0).required("El DNI del alumno es requerido"),
    codTipoClase: Yup.number().integer().min(0).required("El tipo de clase es requerido"),
  });

  const formik = useFormik({
    initialValues: {
      dniAlumno: inscripcion.dniAlumno || 0,
      codTipoClase: inscripcion.codTipoClase || 0,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleCreate,
  });

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-modern">
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
                ¿Está seguro que desea dar de baja esta inscripción?
              </p>
              <div className="delete-item">
                <strong>Inscripción #{inscripcion.nroInscripcion}</strong>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer-danger">
            <Button variant="outline-secondary" onClick={onHide} className="btn-cancel">
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} className="btn-delete">
              Dar de Baja
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
        >
          <Modal.Header closeButton className="modal-header-form">
            <Modal.Title>
              <span className="modal-icon">➕</span>
              {title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-form">
            <Form onSubmit={formik.handleSubmit} className="form-modern">
              <div className="form-grid">
                <Form.Group controlId="formDniAlumno" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🆔</span>
                    DNI del Alumno
                  </Form.Label>
                  <Form.Control
                    name="dniAlumno"
                    type="number"
                    value={formik.values.dniAlumno || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.dniAlumno && formik.touched.dniAlumno)}
                    className="form-control-modern"
                    placeholder="Ingrese el DNI del alumno"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.dniAlumno}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formCodTipoClase" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">📚</span>
                    Tipo de Clase
                  </Form.Label>
                  <Form.Select
                    name="codTipoClase"
                    value={formik.values.codTipoClase || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.codTipoClase && formik.touched.codTipoClase)}
                    className="form-control-modern"
                  >
                    <option value="">Seleccione un tipo de clase</option>
                    {tipoClases.map((tipoClase) => (
                      <option key={tipoClase.codTipoClase} value={tipoClase.codTipoClase}>
                        {tipoClase.nombreTipoClase} - {tipoClase.descripcionTipoClase}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.codTipoClase}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <Modal.Footer className="modal-footer-form">
                <Button variant="outline-secondary" onClick={onHide} className="btn-cancel">
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!formik.isValid}
                  className="btn-save"
                >
                  <span className="btn-icon">💾</span>
                  Inscribir
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default InscripcionClaseModal;
