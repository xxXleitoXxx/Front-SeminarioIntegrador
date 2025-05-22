import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import AltaAlumno from "./AltaAlumno";

export default function AFiltro() {
  const [show, setShow] = useState(false);

  //const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);

  return (
    <div className="d-flex align-items-end">
      <Button variant="success" onClick={() => setShow(true)}>
        Agregar Alumno
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Alta Alumno
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <AltaAlumno />
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
