import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from "react-bootstrap/NavDropdown";

function Navegacion() {
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
              <Nav.Link href="#ConfFechas">Conf Fechas</Nav.Link>
              <Nav.Link href="#Inscrip">Inscribir Alumnos</Nav.Link>
              <Nav.Link href="#AbmAlumno">AbmAlumno</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
export default Navegacion;
