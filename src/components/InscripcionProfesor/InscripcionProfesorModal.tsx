import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { InscripcionProfesorDTO, TipoClaseDTO, ProfesorDTO } from "../../types";
import { InscripcionProfesorService } from "../../services/InscripcionProfesorService";
import { TipoClaseService } from "../../services/TipoClaseService";
import { ProfesorService } from "../../services/ProfesorService";

type InscripcionProfesorModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  inscripcionProfesor: InscripcionProfesorDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const InscripcionProfesorModal = ({
  show,
  onHide,
  title,
  modalType,
  inscripcionProfesor,
  refreshData,
}: InscripcionProfesorModalProps) => {
  const [tipoClases, setTipoClases] = useState<TipoClaseDTO[]>([]);
  const [profesores, setProfesores] = useState<ProfesorDTO[]>([]);
  const [filteredProfesores, setFilteredProfesores] = useState<ProfesorDTO[]>([]);
  const [searchProfesor, setSearchProfesor] = useState("");

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

    const fetchProfesores = async () => {
      try {
        const data = await ProfesorService.getProfesores();
        setProfesores(data);
        setFilteredProfesores(data);
      } catch (error) {
        console.error("Error al cargar profesores:", error);
        toast.error("Error al cargar los profesores");
      }
    };

    if (show) {
      fetchTipoClases();
      fetchProfesores();
    }
  }, [show]);

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '');

  // Debounce del filtro de profesores
  useEffect(() => {
    const handler = setTimeout(() => {
      const query = normalize(searchProfesor);
      if (!query) {
        setFilteredProfesores(profesores);
        return;
      }
      const filtered = profesores.filter((profesor) => {
        const dni = profesor.dniProfesor.toString();
        const nombre = normalize(profesor.nombreProfesor || "");
        return (
          dni.includes(query) ||
          nombre.includes(query)
        );
      });
      setFilteredProfesores(filtered);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchProfesor, profesores]);

  // Crear nueva inscripción
  const handleCreate = async (values: {
    dniProfesor: number;
    codTipoClase: number;
  }) => {
    try {
      const result = await InscripcionProfesorService.inscribirProfesor(
        values.dniProfesor,
        values.codTipoClase
      );
      const message =
        typeof result === "string" ? result : "Inscripción de profesor creada con éxito";
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
      const result = await InscripcionProfesorService.bajaInscripcionProfesor(
        inscripcionProfesor.nroInscripcionProfesor
      );
      const message =
        typeof result === "string"
          ? result
          : "Inscripción de profesor dada de baja con éxito";
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
    dniProfesor: Yup.number()
      .integer()
      .min(0)
      .required("El DNI del profesor es requerido"),
    codTipoClase: Yup.number()
      .integer()
      .min(0)
      .required("El tipo de clase es requerido"),
  });

  const formik = useFormik({
    initialValues: {
      dniProfesor: inscripcionProfesor?.profesor?.dniProfesor || 0,
      codTipoClase: inscripcionProfesor?.tipoClase?.codTipoClase || 0,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: handleCreate,
  });

  const selectedProfesor: ProfesorDTO | undefined = profesores.find(p => p.dniProfesor === formik.values.dniProfesor);
  const selectedTipoClase: TipoClaseDTO | undefined = tipoClases.find(tc => tc.codTipoClase === formik.values.codTipoClase);

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
                ¿Está seguro que desea dar de baja esta inscripción de profesor?
              </p>
              <div className="delete-item">
                <strong>Inscripción #{inscripcionProfesor.nroInscripcionProfesor}</strong>
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
                <Form.Group className="form-group-modern">
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">🔍</span>
                    Buscar Profesor
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por DNI o nombre"
                    value={searchProfesor}
                    onChange={(e) => setSearchProfesor(e.target.value)}
                    className="form-control-modern mb-2"
                  />
                </Form.Group>

                <Form.Group
                  controlId="formProfesor"
                  className="form-group-modern"
                >
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">👨‍🏫</span>
                    Seleccionar Profesor
                  </Form.Label>
                  <Form.Select
                    name="dniProfesor"
                    value={formik.values.dniProfesor || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(formik.errors.dniProfesor && formik.touched.dniProfesor)
                    }
                    className="form-control-modern"
                  >
                    <option value="">Seleccione un profesor</option>
                    {filteredProfesores.map((profesor) => (
                      <option key={profesor.dniProfesor} value={profesor.dniProfesor}>
                        {profesor.nombreProfesor} - DNI: {profesor.dniProfesor}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback
                    type="invalid"
                    className="feedback-modern"
                  >
                    {formik.errors.dniProfesor}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  controlId="formCodTipoClase"
                  className="form-group-modern"
                >
                  <Form.Label className="form-label-modern">
                    <span className="label-icon">📚</span>
                    Tipo de Clase
                  </Form.Label>
                  <Form.Select
                    name="codTipoClase"
                    value={formik.values.codTipoClase || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!(
                        formik.errors.codTipoClase &&
                        formik.touched.codTipoClase
                      )
                    }
                    className="form-control-modern"
                  >
                    <option value="">Seleccione un tipo de clase</option>
                    {tipoClases.map((tipoClase) => (
                      <option
                        key={tipoClase.codTipoClase}
                        value={tipoClase.codTipoClase}
                      >
                        {tipoClase.nombreTipoClase}
                        {tipoClase.rangoEtarioDTO ? ` (${tipoClase.rangoEtarioDTO.edadDesde}-${tipoClase.rangoEtarioDTO.edadHasta})` : ""}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback
                    type="invalid"
                    className="feedback-modern"
                  >
                    {formik.errors.codTipoClase}
                  </Form.Control.Feedback>
                  {selectedTipoClase?.rangoEtarioDTO && (
                    <div className="mt-2 text-muted">
                      Rango etario: {selectedTipoClase.rangoEtarioDTO.edadDesde}-{selectedTipoClase.rangoEtarioDTO.edadHasta}
                    </div>
                  )}
                </Form.Group>
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
                  Inscribir Profesor
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default InscripcionProfesorModal;
