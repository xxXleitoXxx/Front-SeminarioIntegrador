import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useState } from "react";
import "./SideBar.css";
import iconAlumno from "../assets/AtlantisMejorado_1.svg";
import {
  FaUser,
  FaChalkboardTeacher,
  FaBook,
  FaCog,
  FaQuestionCircle,
  FaHome,
  FaCalendarAlt,
  FaClipboardList,
  FaCity,
  FaUsers,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const SideBar = ({ isModalOpen }: { isModalOpen: boolean }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { hasRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ width: collapsed ? "80px" : "250px" }}>
      <Sidebar
        className={`custom-sidebar ${isModalOpen ? "hidden" : ""}`}
        collapsed={collapsed}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        backgroundColor="#2c3e50"
        rootStyles={{
          color: "#ecf0f1",
          borderRight: "1px solid #34495e",
          height: "100vh",
          position: "fixed",
          width: collapsed ? "80px" : "250px",
          ".ps-submenu-content": {
            backgroundColor: "#2c3e50",
          },
        }}
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              return {
                color: active ? "#ffffff" : "#ecf0f1",
                backgroundColor: active ? "#3498db" : undefined,
                "&:hover": {
                  backgroundColor: "#34495e !important",
                  color: "#f1c40f !important",
                },
              };
            },
            subMenuContent: ({ level }) => ({
              backgroundColor: "#2c3e50",
            }),
            icon: {
              color: "#ecf0f1",
            },
          }}
        >
          <MenuItem
            icon={
              <img
                src={iconAlumno}
                alt="Atlantis System"
                style={{ width: "50px", height: "50px" }}
              />
            }
            onClick={() => navigate("/")}
          >
            Atlantis System
          </MenuItem>
          {/* Gestión - Para RECEPCIONISTA y ADMIN */}
          {(hasRole('ROLE_RECEPCIONISTA') || hasRole('ROLE_ADMIN')) && (
            <SubMenu label="Gestión" icon={<FaUser />}>
              <MenuItem
                icon={<FaUser />}
                onClick={() => navigate("/gestionalumno")}
              >
                Alumnos
              </MenuItem>
              {/* Solo ADMIN puede ver estas opciones */}
              {hasRole('ROLE_ADMIN') && (
                <>
                  <MenuItem
                    icon={<FaChalkboardTeacher />}
                    onClick={() => navigate("/gestionprofesor")}
                  >
                    Profesores
                  </MenuItem>
                  <MenuItem
                    icon={<FaCalendarAlt />}
                    onClick={() => navigate("/gestiondia")}
                  >
                    Día
                  </MenuItem>
                  <MenuItem
                    icon={<FaBook />}
                    onClick={() => navigate("/gestiontipoclase")}
                  >
                    Tipo de Clase
                  </MenuItem>
                  <MenuItem
                    icon={<FaCity />}
                    onClick={() => navigate("/gestionlocalidad")}
                  >
                    Localidad
                  </MenuItem>
                  <MenuItem
                    icon={<FaUsers />}
                    onClick={() => navigate("/gestionrangoetario")}
                  >
                    Rango Etario
                  </MenuItem>
                </>
              )}
            </SubMenu>
          )}
          {/* Asistencia - Para RECEPCIONISTA y ADMIN */}
          {(hasRole('ROLE_RECEPCIONISTA') || hasRole('ROLE_ADMIN')) && (
            <SubMenu label="Asistencia" icon={<FaClipboardList />}>
              <MenuItem
                icon={<FaClipboardList />}
                onClick={() => navigate("/asistencia")}
              >
                Asistencia de Alumnos
              </MenuItem>
            </SubMenu>
          )}
          
          {/* Inscripciones - Para RECEPCIONISTA y ADMIN */}
          {(hasRole('ROLE_RECEPCIONISTA') || hasRole('ROLE_ADMIN')) && (
            <SubMenu label="Inscripciones" icon={<FaUserPlus />}>
              <MenuItem
                icon={<FaUserPlus />}
                onClick={() => navigate("/inscripcion-clase")}
              >
                Alumno a clase
              </MenuItem>
              <MenuItem
                icon={<FaUserPlus />}
                onClick={() => navigate("/inscripcion-profesor")}
              >
                Profesor a clase
              </MenuItem>
            </SubMenu>
          )}

          {/* Cronograma - Solo para ADMIN */}
          {hasRole('ROLE_ADMIN') && (
            <SubMenu label="Cronograma" icon={<FaCalendarAlt />}>
              <MenuItem
                icon={<FaCalendarAlt />}
                onClick={() => navigate("/configurar-cronograma")}
              >
                Configurar Cronograma
              </MenuItem>
            </SubMenu>
          )}

          {/* Reportes - Solo para ADMIN */}
          {hasRole('ROLE_ADMIN') && (
            <MenuItem icon={<FaBook />} onClick={() => navigate("/reportes")}>
              Reportes
            </MenuItem>
          )}
          
          {/* Clases - Solo para ADMIN */}
          {hasRole('ROLE_ADMIN') && (
            <MenuItem
              icon={<FaCalendarAlt />}
              onClick={() => navigate("/clasesAlumnos")}
            >
              Clases
            </MenuItem>
          )}

          {/* Configuración - Solo para ADMIN */}
          {hasRole('ROLE_ADMIN') && (
            <MenuItem icon={<FaCog />} onClick={() => navigate("/configuracion")}>
              Configuración
            </MenuItem>
          )}
          
          {/* Ayuda - Para todos los usuarios autenticados */}
          <MenuItem
            icon={<FaQuestionCircle />}
            onClick={() => navigate("/ayuda")}
          >
            Ayuda
          </MenuItem>
          
          {/* Logout - Para todos los usuarios autenticados */}
          <MenuItem
            icon={<FaSignOutAlt />}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};
