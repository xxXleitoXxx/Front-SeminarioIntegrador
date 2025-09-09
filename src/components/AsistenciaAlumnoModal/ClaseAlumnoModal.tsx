import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { toast } from "react-toastify";
import type { ClaseAlumnoDTO } from "../../types/ClaseAlumnoDTO";
import type { ClaseDTO } from "../../types/ClaseDTO";
import { ClaseAlumnoService } from "../../services/ClaseAlumnoService";
import "./ClaseAlumnoModal.css";

type ClaseAlumnoModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  claseAlumno: ClaseAlumnoDTO[];
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
  clase?: ClaseDTO;
};

const ClaseAlumnoModal = ({
  show,
  onHide,
  title,
  modalType,
  claseAlumno,
  refreshData,
  clase,
}: ClaseAlumnoModalProps) => {
  const handleSaveUpdate = async (entity: ClaseAlumnoDTO[]) => {
    try {
      await ClaseAlumnoService.guardarAsistenciaClaseAlumno(entity);

      toast.success("Asistencia tomada con éxito", { position: "top-center" });
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

  const [claseAlumnoSent, setClaseAlumnoSent] =
    React.useState<ClaseAlumnoDTO[]>(claseAlumno);
  const [searchText, setSearchText] = React.useState("");

  React.useEffect(() => {
    setClaseAlumnoSent(claseAlumno);
  }, [claseAlumno]);

  const getNombreCompleto = (a: ClaseAlumnoDTO) =>
    `${a.alumnodto.nombreAlumno} ${a.alumnodto.apellidoAlumno}`.trim();

  const filteredAlumnos = React.useMemo(
    () =>
      claseAlumnoSent.filter((a) =>
        getNombreCompleto(a).toLowerCase().includes(searchText.toLowerCase())
      ),
    [claseAlumnoSent, searchText]
  );

  const allFilteredSelected =
    filteredAlumnos.length > 0 &&
    filteredAlumnos.every((a) => a.presenteClaseAlumno);

  const toggleAlumno = (nroAlumno: number) => {
    setClaseAlumnoSent((prev) =>
      prev.map((a) =>
        a.alumnodto.nroAlumno === nroAlumno
          ? { ...a, presenteClaseAlumno: !a.presenteClaseAlumno }
          : a
      )
    );
  };

  const toggleSelectAllFiltered = () => {
    setClaseAlumnoSent((prev) =>
      prev.map((a) =>
        filteredAlumnos.some((f) => f.alumnodto.nroAlumno === a.alumnodto.nroAlumno)
          ? { ...a, presenteClaseAlumno: !allFilteredSelected }
          : a
      )
    );
  };

  const fechaClaseStr = React.useMemo(() => {
    if (!clase?.fechaHoraClase) return null;
    const fecha = new Date(clase.fechaHoraClase);
    const fechaStr = fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const horaStr = fecha.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${fechaStr} • ${horaStr}`;
  }, [clase]);

  return (
    <>
      {modalType === ModalType.DELETE ? (
        console.log("Eliminar")
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
              {clase && (
                <div className="modal-subtitle">
                  <span className="tipo-clase">{clase.tipoClase.nombreTipoClase}</span>
                  <span className="dot">•</span>
                  <span>N.° de clase: <strong>{clase.nroClase}</strong></span>
                  {fechaClaseStr && <span className="dot">•</span>}
                  {fechaClaseStr && <span>{fechaClaseStr}</span>}
                </div>
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="modal-body-form clase-alumno-modal">
            <div className="top-actions">
              <Form.Control
                type="text"
                placeholder="Buscar alumno..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
              <Form.Check
                type="checkbox"
                id="select-all"
                label={allFilteredSelected ? "Deseleccionar visibles" : "Seleccionar visibles"}
                checked={allFilteredSelected}
                onChange={toggleSelectAllFiltered}
              />
            </div>

            <div className="alumno-list">
              {filteredAlumnos.length === 0 ? (
                <div className="empty">No hay alumnos que coincidan</div>
              ) : (
                filteredAlumnos.map((alumno) => (
                  <div className="alumno-item" key={alumno.alumnodto.nroAlumno}>
                    <Form.Check
                      type="checkbox"
                      id={`al-${alumno.alumnodto.nroAlumno}`}
                      label={getNombreCompleto(alumno)}
                      checked={alumno.presenteClaseAlumno}
                      onChange={() => toggleAlumno(alumno.alumnodto.nroAlumno)}
                    />
                  </div>
                ))
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer-actions">
            <Button
              variant="primary"
              onClick={() => handleSaveUpdate(claseAlumnoSent)}
            >
              Guardar
            </Button>
            <Button variant="outline-secondary" onClick={onHide}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
export default ClaseAlumnoModal;
