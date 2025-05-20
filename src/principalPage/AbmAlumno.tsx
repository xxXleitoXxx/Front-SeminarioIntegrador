import { Button, Row, Col } from "react-bootstrap";
import AFiltro from "./AFiltro";

export default function AbmAlumno() {
  // Crear un array con 20 elementos
  const items = Array.from({ length: 20 }, (_, index) => `Alumno ${index + 1}`);

  return (
    <div>
      <div className="d-flex  p-3 justify-content-end">
        <AFiltro />
      </div>

      <div className="p-3">
        <Row xs={1} md={1} lg={1} className="g-4">
          {items.map((item, index) => (
            <Col key={index}>
              <div className="p-2 d-flex justify-content-between align-items-center border">
                <span>{item}</span>
                <div>
                  <Button variant="primary" className="m-2">
                    Actualizar
                  </Button>
                  <Button variant="danger" className="m-2">
                    Eliminar
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
