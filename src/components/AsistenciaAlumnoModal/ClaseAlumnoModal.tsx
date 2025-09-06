import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import { toast } from "react-toastify";
import type { ClaseAlumnoDTO } from "../../types/ClaseAlumnoDTO";
import { ClaseAlumnoService } from "../../services/ClaseAlumnoService";

type ClaseAlumnoModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  claseAlumno: ClaseAlumnoDTO[];
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClaseAlumnoModal = ({
  show,
  onHide,
  title,
  modalType,
  claseAlumno,
  refreshData,
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
  // const handleDelete = async () => {
  //   try {
  //     await DiaService.bajaDia(dia.codDia);
  //     toast.success("Día eliminado con éxito", { position: "top-center" });
  //     onHide();
  //     refreshData((prevState) => !prevState);
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(
  //       `Ha ocurrido un error: ${
  //         error instanceof Error ? error.message : String(error)
  //       }`,
  //       { position: "top-center" }
  //     );
  //   }
  // };

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
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="modal-body-form">
            <h3>Alumnos </h3>
            {claseAlumno.map((alumno) => (
              <Form.Check
                key={alumno.alumnodto.nroAlumno}
                type="checkbox"
                label={
                  alumno.alumnodto.nombreAlumno +
                  " " +
                  alumno.alumnodto.apellidoAlumno
                }
                checked={alumno.presenteClaseAlumno}
                onChange={() => {
                  alumno.presenteClaseAlumno = !alumno.presenteClaseAlumno;
                  setClaseAlumnoSent([...claseAlumno]);
                  console.log(claseAlumnoSent);
                }}
              />
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => handleSaveUpdate(claseAlumnoSent)}
            >
              Guardar
            </Button>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
export default ClaseAlumnoModal;
