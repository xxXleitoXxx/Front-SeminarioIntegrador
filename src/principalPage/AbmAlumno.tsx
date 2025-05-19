import { Button, ListGroup } from "react-bootstrap";

export default function AbmAlumno() {
  // Crear un array con 20 elementos
  const items = Array.from({ length: 20 }, (_, index) => `Alumno ${index + 1}`);

  return (
    <div className="w-auto d-flex flex-row p-3">
      <ListGroup>
        {items.map((item, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            <span>{item}</span>
            <div>
              <Button variant="primary" className="m-2">
                Actualizar
              </Button>
              <Button variant="danger" className="m-2">
                Eliminar
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
