import { Button, FloatingLabel, Form } from "react-bootstrap";

export default function ContactoAbmAlumno() {
  return (
    <div className="p-4">
      <FloatingLabel controlId="floatingNombre" label="Nombre" className="mb-3">
        <Form.Control type="text" placeholder="Juan Pérez" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingDomicilioContactoEmergencia"
        label="Domicilio"
        className="mb-3"
      >
        <Form.Control type="text" placeholder="Calle Falsa 123" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingTelefonoContactoEmergencia1"
        label="Teléfono"
        className="mb-3"
      >
        <Form.Control type="text" placeholder="1234567890" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingTelefonoContactoEmergencia2"
        label="Teléfono 2"
        className="mb-3"
      >
        <Form.Control type="text" placeholder="1234567890" />
      </FloatingLabel>

      <Button>Agregar Contacto</Button>
    </div>
  );
}
