import { useState, useEffect, useRef, type FC } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./Navegacion.css";
import { useAuth } from "../contexts/AuthContext";

// 🔹 Interfaz local para el contexto de autenticación
interface IAuthContext {
  hasRole: (role: string) => boolean;
  username: string | null;
  logout: () => void;
  roles: string[];
}

const Navegacion: FC = () => {
  const { hasRole, username, logout, roles } = useAuth() as IAuthContext;
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [panelWidth, setPanelWidth] = useState<number>(0);
  const collapseRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Navegar y cerrar menú
  const handleNavigate = (path: string): void => {
    navigate(path);
    setExpanded(false);
  };

  // 🔹 Logout y cerrar menú
  const handleLogout = (): void => {
    logout();
    navigate("/login");
    setExpanded(false);
  };

  // 🔹 Medir ancho del panel lateral cuando se abre y en resize
  useEffect(() => {
    const updateWidth = () => {
      const w = collapseRef.current?.getBoundingClientRect().width ?? 0;
      setPanelWidth(Math.round(w));
    };

    if (expanded) {
      const raf = requestAnimationFrame(updateWidth);
      window.addEventListener("resize", updateWidth);
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", updateWidth);
      };
    } else {
      setPanelWidth(0);
    }
  }, [expanded]);

  // 🔹 Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 🔹 Mostrar nombre legible según rol
  const getRoleDisplayName = (role?: string): string => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Administrador";
      case "ROLE_RECEPCIONISTA":
        return "Recepcionista";
      default:
        return role || "Usuario";
    }
  };

  // 🔹 Color por rol
  const getRoleColor = (role?: string): string => {
    switch (role) {
      case "ROLE_ADMIN":
        return "#dc3545";
      case "ROLE_RECEPCIONISTA":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  // 🔹 Evitar que abrir un dropdown cierre el navbar en móvil
  const handleDropdownClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 992) e.stopPropagation();
  };

  return (
    <>
      {/* Overlay (clic afuera cierra el menú) */}
      <div
        className={`nav-overlay ${expanded ? "show" : ""}`}
        onClick={() => setExpanded(false)}
        style={{ left: panelWidth ? `${panelWidth}px` : "0" }}
      />

      <Navbar
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        className="navbar-custom shadow-sm"
        sticky="top"
      >
        <Container>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="navbar-toggler-left"
          />

          <Navbar.Brand
            onClick={() => handleNavigate("/")}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            Atlantis
          </Navbar.Brand>

          <Navbar.Collapse
            id="basic-navbar-nav"
            ref={collapseRef} // ✅ ref corregido
          >
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavigate("/")}>Inicio</Nav.Link>

              {(hasRole("ROLE_RECEPCIONISTA") || hasRole("ROLE_ADMIN")) && (
                <NavDropdown
                  title="Gestión"
                  id="gestion-dropdown"
                  onClick={handleDropdownClick}
                >
                  <NavDropdown.Item onClick={() => handleNavigate("/gestionalumno")}>
                    Alumnos
                  </NavDropdown.Item>
                  {hasRole("ROLE_ADMIN") && (
                    <>
                      <NavDropdown.Item onClick={() => handleNavigate("/gestionprofesor")}>
                        Profesores
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => handleNavigate("/gestiondia")}>
                        Día
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => handleNavigate("/gestiontipoclase")}>
                        Tipo de Clase
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => handleNavigate("/gestionlocalidad")}>
                        Localidad
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => handleNavigate("/gestionrangoetario")}>
                        Rango Etario
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              )}

              {(hasRole("ROLE_RECEPCIONISTA") || hasRole("ROLE_ADMIN")) && (
                <Nav.Link onClick={() => handleNavigate("/asistencia")}>
                  Asistencia
                </Nav.Link>
              )}

              {(hasRole("ROLE_RECEPCIONISTA") || hasRole("ROLE_ADMIN")) && (
                <NavDropdown
                  title="Inscripciones"
                  id="inscripciones-dropdown"
                  onClick={handleDropdownClick}
                >
                  <NavDropdown.Item onClick={() => handleNavigate("/inscripcion-clase")}>
                    Alumno a clase
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleNavigate("/inscripcion-profesor")}>
                    Profesor a clase
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {hasRole("ROLE_ADMIN") && (
                <>
                  <Nav.Link onClick={() => handleNavigate("/configurar-cronograma")}>
                    Cronograma
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate("/reportes")}>
                    Reportes
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate("/clasesAlumnos")}>
                    Clases
                  </Nav.Link>
                  <Nav.Link onClick={() => handleNavigate("/configuracion")}>
                    Configuración
                  </Nav.Link>
                </>
              )}

              <Nav.Link onClick={() => handleNavigate("/ayuda")}>Ayuda</Nav.Link>

              {/* 🔹 Panel usuario en móvil */}
              <div className="d-lg-none mt-4 border-top border-secondary pt-3">
                <div className="d-flex align-items-center mb-3">
                  <FaUser className="me-2 text-white" size={24} />
                  <div className="d-flex flex-column">
                    <div className="text-white fw-bold">
                      {username || "Usuario"}
                    </div>
                    <small
                      className="badge mt-1"
                      style={{
                        backgroundColor: getRoleColor(roles?.[0]),
                        fontSize: "0.8rem",
                        alignSelf: "flex-start",
                      }}
                    >
                      {getRoleDisplayName(roles?.[0])}
                    </small>
                  </div>
                </div>
                <button
                  className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" />
                  Cerrar Sesión
                </button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navegacion;
