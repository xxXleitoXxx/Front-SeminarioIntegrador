import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { RangoEtarioDTO } from "../../types/RangoEtarioDTO";
import { RangoEtarioService } from "../../services/RangoEtarioService";

type RangoEtarioModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  rango: RangoEtarioDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const RangoEtarioModal = ({
  show,
  onHide,
  title,
  modalType,
  rango,
  refreshData,
}: RangoEtarioModalProps) => {
  const handleSaveUpdate = async (entity: RangoEtarioDTO) => {
    try {
      const isNew = entity.codRangoEtario === 0;
      if (isNew) {
        await RangoEtarioService.createRango(entity);
      } else {
        await RangoEtarioService.updateRango(entity.codRangoEtario, entity);
      }
      toast.success(
        isNew ? "Rango etario creado con éxito" : "Rango etario actualizado con éxito",
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
      await RangoEtarioService.bajaRango(rango.codRangoEtario);
      toast.success("Rango etario eliminado con éxito", { position: "top-center" });
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
    codRangoEtario: modalType === ModalType.CREATE
      ? Yup.number().integer().min(0).optional()
      : Yup.number().integer().min(0).required("El código es requerido"),
    edadDesde: Yup.number().integer().min(0).required("Edad desde es requerida"),
    edadHasta: Yup.number().integer().min(0).required("Edad hasta es requerida"),
    nombreRangoEtario: Yup.string().required("El nombre es requerido"),
  });

  const formik = useFormik({
    initialValues: { ...rango },
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
                ¿Está seguro que desea eliminar el rango etario?
              </p>
              <div className="delete-item">
                <strong>{rango.edadDesde}-{rango.edadHasta}</strong>
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
                  <Form.Group controlId="formCodRangoEtario" className="form-group-modern">
                    <Form.Label className="form-label-modern">
                      <span className="label-icon">#</span>
                      Código
                    </Form.Label>
                    <Form.Control
                      name="codRangoEtario"
                      type="number"
                      value={formik.values.codRangoEtario || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!(formik.errors.codRangoEtario && formik.touched.codRangoEtario)}
                      disabled={true}
                      className="form-control-modern"
                      placeholder="Ingrese el código"
                    />
                    <Form.Control.Feedback type="invalid" className="feedback-modern">
                      {formik.errors.codRangoEtario as string}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
                <Form.Group controlId="formNombreRango" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🏷️</span>
                    Nombre
                  </Form.Label>
                  <Form.Control
                    name="nombreRangoEtario"
                    type="text"
                    value={formik.values.nombreRangoEtario || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.nombreRangoEtario && formik.touched.nombreRangoEtario)}
                    className="form-control-modern"
                    placeholder="Ingrese el nombre del rango"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.nombreRangoEtario as string}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formEdadDesde" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🔢</span>
                    Edad desde
                  </Form.Label>
                  <Form.Control
                    name="edadDesde"
                    type="number"
                    value={formik.values.edadDesde || 0}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.edadDesde && formik.touched.edadDesde)}
                    className="form-control-modern"
                    placeholder="Ingrese edad desde"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.edadDesde as string}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formEdadHasta" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🔢</span>
                    Edad hasta
                  </Form.Label>
                  <Form.Control
                    name="edadHasta"
                    type="number"
                    value={formik.values.edadHasta || 0}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.edadHasta && formik.touched.edadHasta)}
                    className="form-control-modern"
                    placeholder="Ingrese edad hasta"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.edadHasta as string}
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

export default RangoEtarioModal;


