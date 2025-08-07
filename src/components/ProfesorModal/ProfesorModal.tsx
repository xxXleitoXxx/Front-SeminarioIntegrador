import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { ProfesorDTO } from "../../types/ProfesorDTO";
import { ProfesorService } from "../../services/ProfesorService";

type ProfesorModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  profesor: ProfesorDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfesorModal = ({
  show,
  onHide,
  title,
  modalType,
  profesor,
  refreshData,
}: ProfesorModalProps) => {
  // Guardar o actualizar
  const handleSaveUpdate = async (prof: ProfesorDTO) => {
    try {
      const isNew = prof.nroProfesor === 0;
      console.log("el codigo del profesor es: ");
      console.log(prof.nroProfesor);
      if (isNew) {
        await ProfesorService.createProfesor(prof);
      } else {
        await ProfesorService.updateProfesor(prof);
      }
      toast.success(
        isNew ? "Profesor creado con éxito" : "Profesor actualizado con éxito",
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
      await ProfesorService.bajaLogicaProfesor(profesor);
      toast.success("Profesor eliminado con éxito", { position: "top-center" });
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
      await ProfesorService.altaLogicaProfesor(profesor);
      toast.success("Profesor dado de alta con éxito", { position: "top-center" });
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
    nroProfesor: Yup.number().integer().min(0).required("El código es requerido"),
    dniProfesor: Yup.number().integer().min(0).required("El DNI es requerido"),
    nombreProfesor: Yup.string().required("El nombre es requerido"),
    telefonoProfesor: Yup.number().integer().min(0).required("El teléfono es requerido"),
  });

  const formik = useFormik({
    initialValues: { ...profesor },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSaveUpdate,
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
                ¿Está seguro que desea eliminar el profesor?
              </p>
              <div className="delete-item">
                <strong>{profesor.nombreProfesor}</strong>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer-danger">
            <Button variant="outline-secondary" onClick={onHide} className="btn-cancel">
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete} className="btn-delete">
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
                <Form.Group controlId="formNroProfesor" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">#</span>
                    Código
                  </Form.Label>
                  <Form.Control
                    name="nroProfesor"
                    type="number"
                    value={formik.values.nroProfesor || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.nroProfesor && formik.touched.nroProfesor)}
                    disabled={modalType !== ModalType.CREATE}
                    className="form-control-modern"
                    placeholder="Ingrese el código"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.nroProfesor}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formDniProfesor" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🆔</span>
                    DNI
                  </Form.Label>
                  <Form.Control
                    name="dniProfesor"
                    type="number"
                    value={formik.values.dniProfesor || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.dniProfesor && formik.touched.dniProfesor)}
                    className="form-control-modern"
                    placeholder="Ingrese el DNI"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.dniProfesor}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formNombreProfesor" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">👤</span>
                    Nombre
                  </Form.Label>
                  <Form.Control
                    name="nombreProfesor"
                    type="text"
                    value={formik.values.nombreProfesor || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.nombreProfesor && formik.touched.nombreProfesor)}
                    className="form-control-modern"
                    placeholder="Ingrese el nombre"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.nombreProfesor}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formTelefonoProfesor" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">📞</span>
                    Teléfono
                  </Form.Label>
                  <Form.Control
                    name="telefonoProfesor"
                    type="number"
                    value={formik.values.telefonoProfesor || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.telefonoProfesor && formik.touched.telefonoProfesor)}
                    className="form-control-modern"
                    placeholder="Ingrese el teléfono"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.telefonoProfesor}
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

export default ProfesorModal; 