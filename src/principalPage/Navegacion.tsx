import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
function Navegacion() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="d-flex w-100 justify-content-between">
              <Nav.Link onClick={() => navigate("/asistenciaalumno")}>
                Asistencia
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/gestionprofesor")}>
                Gestion Profesor
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/gestiondia")}>
                Gestion Día
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/gestiontipoclase")}>
                Gestion Tipo Clase
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/gestionlocalidad")}>
                Gestion Localidad
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/gestionrangoetario")}>
                Gestion Rango Etario
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/")}>Inicio</Nav.Link>
              <Nav.Link onClick={() => navigate("/gestionalumno")}>
                Gestion Alumno
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/inscripcion-clase")}>
                Inscripción a Clase
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/inscripcion-profesor")}>
                Inscripción Profesor
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/cronograma")}>
                Ver Cronograma
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/configurar-cronograma")}>
                Configurar Cronograma
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
export default Navegacion;
