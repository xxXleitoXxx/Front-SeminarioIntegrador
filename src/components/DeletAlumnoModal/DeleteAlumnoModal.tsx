import { toast } from "react-toastify";
import { AlumnoService } from "../../services/AlumnoService";
import { ModalType, type AlumnoDTO } from "../../types";
import { Button, Modal } from "react-bootstrap";

type DeleteAlumnoModalProps = {
  show: boolean;
  onHide: () => void;
  title: string;
  modalType: ModalType;
  alumno: AlumnoDTO;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteAlumnoModal = ({
  show,
  onHide,
  title,
  modalType,
  alumno,
  refreshData,
}: DeleteAlumnoModalProps) => {
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

  return (
    <div>
      {modalType === ModalType.DELETE && (
        <Modal show={show} onHide={onHide} centered backdrop="static">
          <Modal.Header closeButton className="modal-header-success">
            <Modal.Title>
              <span className="modal-icon">🗑️</span>
              {title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="delete-confirmation">
              <p>¿Está seguro que desea eliminar al alumno?</p>
              <p>
                <strong>Nombre:</strong>{" "}
                {alumno.nombreAlumno + " " + alumno.apellidoAlumno}
              </p>
              <p>
                <strong>DNI:</strong> {alumno.dniAlumno}
              </p>
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
                variant="danger"
                onClick={handleDelete}
                className="btn-delete"
              >
                <span className="btn-icon">🗑️</span>
                Eliminar
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DeleteAlumnoModal;
