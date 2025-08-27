import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { DiaDTO } from "../../types/DiaDTO";
import { DiaService } from "../../services/DiaService";

type DiaModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  dia: DiaDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const DiaModal = ({
  show,
  onHide,
  title,
  modalType,
  dia,
  refreshData,
}: DiaModalProps) => {
  const handleSaveUpdate = async (entity: DiaDTO) => {
    try {
      const isNew = entity.codDia === 0;
      if (isNew) {
        await DiaService.createDia(entity);
      } else {
        await DiaService.updateDia(entity.codDia, entity);
      }
      toast.success(
        isNew ? "Día creado con éxito" : "Día actualizado con éxito",
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
      await DiaService.bajaDia(dia.codDia);
      toast.success("Día eliminado con éxito", { position: "top-center" });
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
    codDia: modalType === ModalType.CREATE
      ? Yup.number().integer().min(0).optional()
      : Yup.number().integer().min(0).required("El código es requerido"),
    nombreDia: Yup.string().required("El nombre es requerido"),
  });

  const formik = useFormik({
    initialValues: { ...dia },
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
                ¿Está seguro que desea eliminar el día?
              </p>
              <div className="delete-item">
                <strong>{dia.nombreDia}</strong>
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
                  <Form.Group controlId="formCodDia" className="form-group-modern">
                    <Form.Label className="form-label-modern">
                      <span className="label-icon">#</span>
                      Código
                    </Form.Label>
                    <Form.Control
                      name="codDia"
                      type="number"
                      value={formik.values.codDia || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!(formik.errors.codDia && formik.touched.codDia)}
                      disabled={true}
                      className="form-control-modern"
                      placeholder="Ingrese el código"
                    />
                    <Form.Control.Feedback type="invalid" className="feedback-modern">
                      {formik.errors.codDia as string}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
                <Form.Group controlId="formNombreDia" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">📛</span>
                    Nombre
                  </Form.Label>
                  <Form.Control
                    name="nombreDia"
                    type="text"
                    value={formik.values.nombreDia || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.nombreDia && formik.touched.nombreDia)}
                    className="form-control-modern"
                    placeholder="Ingrese el nombre"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.nombreDia as string}
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

export default DiaModal;


