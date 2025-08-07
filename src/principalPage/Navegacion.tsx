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
              <Nav.Link href="#controlAsistencia">
                Controlar Asistencia
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/abmprofesor")}>
                Abm Profesor
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/")}>Conf Fechas</Nav.Link>
              <Nav.Link onClick={() => navigate("/altaalumno")}>
                Inscribir Alumnos
              </Nav.Link>
              
              <Nav.Link onClick={() => navigate("/abmalumno")}>
                AbmAlumno
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/paginaProps")}>
                PaginaProps
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/abmprueba")}>
                ABM Prueba
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
export default Navegacion;
