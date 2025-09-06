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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const SideBar = ({ isModalOpen }: { isModalOpen: boolean }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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
          <SubMenu label="Gestión" icon={<FaUser />}>
            <MenuItem
              icon={<FaUser />}
              onClick={() => navigate("/gestionalumno")}
            >
              Alumnos
            </MenuItem>
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
          </SubMenu>
          <SubMenu label="Asistencia" icon={<FaClipboardList />}>
            <MenuItem
              icon={<FaClipboardList />}
              onClick={() => navigate("/asistencia")}
            >
              Asistencia de Alumnos
            </MenuItem>
          </SubMenu>
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

          <SubMenu label="Cronograma" icon={<FaCalendarAlt />}>
            <MenuItem
              icon={<FaCalendarAlt />}
              onClick={() => navigate("/configurar-cronograma")}
            >
              Configurar Cronograma
            </MenuItem>
          </SubMenu>

          <SubMenu label="Reportes" icon={<FaBook />}>
            <MenuItem onClick={() => navigate("/reporte1")}>Reporte 1</MenuItem>
            <MenuItem onClick={() => navigate("/reporte2")}>Reporte 2</MenuItem>
          </SubMenu>
          <MenuItem
            icon={<FaCalendarAlt />}
            onClick={() => navigate("/clasesAlumnos")}
          >
            Clases
          </MenuItem>

          <MenuItem icon={<FaCog />} onClick={() => navigate("/configuracion")}>
            Configuración
          </MenuItem>
          <MenuItem
            icon={<FaQuestionCircle />}
            onClick={() => navigate("/ayuda")}
          >
            Ayuda
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};
