import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { LocalidadDTO } from "../../types/LocalidadDTO";
import { LocalidadService } from "../../services/LocalidadService";

type LocalidadModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  localidad: LocalidadDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const LocalidadModal = ({
  show,
  onHide,
  title,
  modalType,
  localidad,
  refreshData,
}: LocalidadModalProps) => {
  const handleSaveUpdate = async (entity: LocalidadDTO) => {
    try {
      const isNew = entity.codLocalidad === 0;
      if (isNew) {
        await LocalidadService.createLocalidad(entity);
      } else {
        await LocalidadService.updateLocalidad(entity);
      }
      toast.success(
        isNew ? "Localidad creada con éxito" : "Localidad actualizada con éxito",
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

  const handleDelete = async () => {
    try {
      await LocalidadService.deleteLocalidad(localidad.codLocalidad);
      toast.success("Localidad eliminada con éxito", { position: "top-center" });
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

  const validationSchema = Yup.object().shape({
    codLocalidad: modalType === ModalType.CREATE
      ? Yup.number().integer().min(0).optional()
      : Yup.number().integer().min(0).required("El código es requerido"),
    nombreLocalidad: Yup.string().required("El nombre es requerido"),
  });

  const formik = useFormik({
    initialValues: { ...localidad },
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
                ¿Está seguro que desea eliminar la localidad?
              </p>
              <div className="delete-item">
                <strong>{localidad.nombreLocalidad}</strong>
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
                {modalType !== ModalType.CREATE && (
                  <Form.Group controlId="formCodLocalidad" className="form-group-modern">
                    <Form.Label className="form-label-modern">
                      <span className="label-icon">#</span>
                      Código
                    </Form.Label>
                    <Form.Control
                      name="codLocalidad"
                      type="number"
                      value={formik.values.codLocalidad || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!(formik.errors.codLocalidad && formik.touched.codLocalidad)}
                      disabled={true}
                      className="form-control-modern"
                      placeholder="Ingrese el código"
                    />
                    <Form.Control.Feedback type="invalid" className="feedback-modern">
                      {formik.errors.codLocalidad as string}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
                <Form.Group controlId="formNombreLocalidad" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🏙️</span>
                    Nombre
                  </Form.Label>
                  <Form.Control
                    name="nombreLocalidad"
                    type="text"
                    value={formik.values.nombreLocalidad || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.nombreLocalidad && formik.touched.nombreLocalidad)}
                    className="form-control-modern"
                    placeholder="Ingrese el nombre"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.nombreLocalidad as string}
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

export default LocalidadModal;


