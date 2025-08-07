import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
export default function Formulario() {
  return (
    <div className="p-4 formulario">
      <FloatingLabel controlId="floatingDni" label="DNI" className="mb-3">
        <Form.Control type="text" placeholder="12345678" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingNombreAlumno"
        label="Nombre"
        className="mb-3"
      >
        <Form.Control type="text" placeholder="Juan Pérez" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingDomicilio"
        label="Domicilio"
        className="mb-3"
      >
        <Form.Control type="text" placeholder="Calle Falsa 123" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingFechaNacimiento"
        label="Fecha de Nacimiento"
        className="mb-3"
      >
        <Form.Control type="date" placeholder="01/01/1990" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingTelefonoAlumno"
        label="Teléfono"
        className="mb-3"
      >
        <Form.Control type="text" placeholder="1234567890" />
      </FloatingLabel>
    </div>
  );
}
