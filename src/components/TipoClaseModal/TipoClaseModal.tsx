import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { TipoClaseDTO } from "../../types/TipoClaseDTO";
import { TipoClaseService } from "../../services/TipoClaseService";
import type { RangoEtarioDTO } from "../../types/RangoEtarioDTO";
import { RangoEtarioService } from "../../services/RangoEtarioService";

type TipoClaseModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  tipoClase: TipoClaseDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const TipoClaseModal = ({
  show,
  onHide,
  title,
  modalType,
  tipoClase,
  refreshData,
}: TipoClaseModalProps) => {
  const [rangos, setRangos] = useState<RangoEtarioDTO[]>([]);

  useEffect(() => {
    const loadRangos = async () => {
      try {
        const data = await RangoEtarioService.getRangos();
        setRangos(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadRangos();
  }, []);

  const handleSaveUpdate = async (entity: TipoClaseDTO) => {
    try {
      const isNew = entity.codTipoClase === 0;
      if (isNew) {
        await TipoClaseService.createTipoClase(entity);
      } else {
        await TipoClaseService.updateTipoClase(entity.codTipoClase, entity);
      }
      toast.success(
        isNew ? "Tipo de clase creado con éxito" : "Tipo de clase actualizado con éxito",
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
      await TipoClaseService.bajaTipoClase(tipoClase.codTipoClase);
      toast.success("Tipo de clase eliminado con éxito", { position: "top-center" });
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
    codTipoClase: modalType === ModalType.CREATE
      ? Yup.number().integer().min(0).optional()
      : Yup.number().integer().min(0).required("El código es requerido"),
    nombreTipoClase: Yup.string().required("El nombre es requerido"),
    descripcionTipoClase: Yup.string().optional(),
    cupoMaxTipoClase: Yup.number().integer().min(0).required("El cupo es requerido"),
    rangoEtario: Yup.object({
      codRangoEtario: Yup.number().integer().min(0).required("El rango etario es requerido"),
      edadDesde: Yup.number().integer().min(0).optional(),
      edadHasta: Yup.number().integer().min(0).optional(),
      fechaBajaRangoEtario: Yup.mixed().optional(),
      fechaAltaRangoEtario: Yup.mixed().optional(),
      nombreRangoEtario: Yup.string().optional(),
    })
  });

  const formik = useFormik({
    initialValues: { ...tipoClase },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleSaveUpdate,
    enableReinitialize: true
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
                ¿Está seguro que desea eliminar el tipo de clase?
              </p>
              <div className="delete-item">
                <strong>{tipoClase.nombreTipoClase}</strong>
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
                  <Form.Group controlId="formCodTipoClase" className="form-group-modern">
                    <Form.Label className="form-label-modern">
                      <span className="label-icon">#</span>
                      Código
                    </Form.Label>
                    <Form.Control
                      name="codTipoClase"
                      type="number"
                      value={formik.values.codTipoClase || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={!!(formik.errors.codTipoClase && formik.touched.codTipoClase)}
                      disabled={true}
                      className="form-control-modern"
                      placeholder="Ingrese el código"
                    />
                    <Form.Control.Feedback type="invalid" className="feedback-modern">
                      {formik.errors.codTipoClase as string}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}
                <Form.Group controlId="formNombreTipoClase" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🏷️</span>
                    Nombre
                  </Form.Label>
                  <Form.Control
                    name="nombreTipoClase"
                    type="text"
                    value={formik.values.nombreTipoClase || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.nombreTipoClase && formik.touched.nombreTipoClase)}
                    className="form-control-modern"
                    placeholder="Ingrese el nombre"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.nombreTipoClase as string}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formDescripcionTipoClase" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">📝</span>
                    Descripción
                  </Form.Label>
                  <Form.Control
                    name="descripcionTipoClase"
                    as="textarea"
                    value={formik.values.descripcionTipoClase || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="form-control-modern"
                    placeholder="Ingrese una descripción"
                  />
                </Form.Group>
                <Form.Group controlId="formCupoMaxTipoClase" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">👥</span>
                    Cupo máximo
                  </Form.Label>
                  <Form.Control
                    name="cupoMaxTipoClase"
                    type="number"
                    value={formik.values.cupoMaxTipoClase || 0}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.errors.cupoMaxTipoClase && formik.touched.cupoMaxTipoClase)}
                    className="form-control-modern"
                    placeholder="Ingrese el cupo máximo"
                  />
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {formik.errors.cupoMaxTipoClase as string}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formRangoEtario" className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🎯</span>
                    Rango Etario
                  </Form.Label>
                  <Form.Select
                    name="rangoEtario.codRangoEtario"
                    value={formik.values.rangoEtario?.codRangoEtario || 0}
                    onChange={(e) => {
                      const cod = Number(e.target.value);
                      const selected = rangos.find(r => r.codRangoEtario === cod);
                      formik.setFieldValue('rangoEtario', selected || { codRangoEtario: 0, edadDesde: 0, edadHasta: 0, fechaBajaRangoEtario: null });
                    }}
                    className="form-control-modern"
                    isInvalid={!!(formik.errors.rangoEtario && formik.touched.rangoEtario)}
                  >
                    <option value={0}>Seleccione un rango</option>
                    {rangos.map(r => (
                      <option key={r.codRangoEtario} value={r.codRangoEtario}>
                        {r.nombreRangoEtario || `${r.edadDesde}-${r.edadHasta}`}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" className="feedback-modern">
                    {typeof formik.errors.rangoEtario === 'string' ? formik.errors.rangoEtario : ''}
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

export default TipoClaseModal;


