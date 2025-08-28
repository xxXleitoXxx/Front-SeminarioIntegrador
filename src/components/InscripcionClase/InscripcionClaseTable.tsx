import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types";
import InscripcionClaseModal from "./InscripcionClaseModal";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import type { InscripcionDTO, AlumnoDTO, TipoClaseDTO } from "../../types";
import { InscripcionService } from "../../services/InscripcionService";
import { AlumnoService } from "../../services/AlumnoService";
import { TipoClaseService } from "../../services/TipoClaseService";
import { ButtonAlta } from "../ButtonAlta/ButtonAlta";
import EmptyState from "../EmptyState/EmptyState";
import "./InscripcionClase.css";

const InscripcionClaseTable = () => {
  const initializableNewInscripcion = (): InscripcionDTO => ({
    nroInscripcion: 0,
    fechaInscripcion: new Date(),
    fechaBajaInscripcion: null,
    alumnoDto: {
      nroAlumno: 0,
      dniAlumno: 0,
      domicilioAlumno: "",
      fechaNacAlumno: new Date(),
      nombreAlumno: "",
      apellidoAlumno: "",
      telefonoAlumno: 0,
      mailAlumno: "",
      localidadAlumno: null,
      contactosEmergencia: [],
      fichaMedicaDTO: [],
    },
    tipoClaseDTO: {
      codTipoClase: 0,
      nombreTipoClase: "",
      fechaBajaTipoClase: null,
      cupoMaxTipoClase: 0,
      rangoEtarioDTO: {
        codRangoEtario: 0,
        edadDesde: 0,
        edadHasta: 0,
        fechaBajaRangoEtario: null,
        nombreRangoEtario: "",
      },
    },
  });

  const [inscripcion, setInscripcion] = useState<InscripcionDTO>(initializableNewInscripcion());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");
  const [inscripciones, setInscripciones] = useState<InscripcionDTO[]>([]);
  const [alumnos, setAlumnos] = useState<AlumnoDTO[]>([]);
  const [tipoClases, setTipoClases] = useState<TipoClaseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  const handleClick = (
    newTitle: string,
    insc: InscripcionDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setInscripcion(insc);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inscripcionesData, alumnosData, tipoClasesData] = await Promise.all([
          InscripcionService.getInscripciones(),
          AlumnoService.getAlumnos(),
          TipoClaseService.getTipoClases()
        ]);
        setInscripciones(inscripcionesData);
        setAlumnos(alumnosData);
        setTipoClases(tipoClasesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshData]);

  return (
    <div className="inscripcion-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>📚 Gestión de Inscripciones a Clases</h1>
          <p className="page-subtitle">Administra las inscripciones de alumnos a clases</p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick(
              "Nueva Inscripción",
              initializableNewInscripcion(),
              ModalType.CREATE
            )
          }
        >
          <span className="btn-icon">+</span>
          Nueva Inscripción
        </Button>
      </div>
      {isLoading ? (
        <div className="loader-container">
          <Loader variant="container" />
        </div>
      ) : inscripciones.length === 0 ? (
        <EmptyState
          title="No hay inscripciones registradas"
          message="Aún no se han registrado inscripciones en el sistema. Haz clic en 'Nueva Inscripción' para comenzar a agregar inscripciones."
          icon="📚"
        />
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>Nro Inscripción</th>
                <th>DNI Alumno</th>
                <th>Nombre Alumno</th>
                <th>Tipo de Clase</th>
                <th>Fecha Inscripción</th>
                <th>Estado</th>
                <th>Fecha de Baja</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((insc) => {
                const alumno = insc.alumnoDto ?? alumnos.find(a => a.dniAlumno === insc?.alumnoDto?.dniAlumno);
                const tipoClase = insc.tipoClaseDTO ?? tipoClases.find(tc => tc.codTipoClase === insc?.tipoClaseDTO?.codTipoClase);
                const calcularEdad = (fechaNac?: Date | string): number | null => {
                  if (!fechaNac) return null;
                  const nacimiento = new Date(fechaNac);
                  if (isNaN(nacimiento.getTime())) return null;
                  const hoy = new Date();
                  let edad = hoy.getFullYear() - nacimiento.getFullYear();
                  const m = hoy.getMonth() - nacimiento.getMonth();
                  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                    edad--;
                  }
                  return edad;
                };
                
                return (
                  <tr key={insc.nroInscripcion} className="table-row-modern">
                    <td className="text-center">{insc.nroInscripcion}</td>
                    <td className="text-center">{insc.alumnoDto?.dniAlumno ?? '-'}</td>
                    <td className="text-center">{alumno ? `${alumno.nombreAlumno} (${calcularEdad(alumno?.fechaNacAlumno) ?? '-' } años)` : 'N/A'}</td>
                    <td className="text-center">{tipoClase ? `${tipoClase.nombreTipoClase} (${tipoClase.rangoEtarioDTO?.edadDesde}-${tipoClase.rangoEtarioDTO?.edadHasta})` : 'N/A'}</td>
                    <td className="text-center">
                      {new Date(insc.fechaInscripcion).toLocaleDateString('es-ES')}
                    </td>
                    <td className="text-center">
                      <span className={`status-badge ${insc.fechaBajaInscripcion ? 'inactive' : 'active'}`}>
                        {insc.fechaBajaInscripcion ? 'Inactiva' : 'Activa'}
                      </span>
                    </td>
                    <td className="text-center">
                      {insc.fechaBajaInscripcion ? (
                        <span className="fecha-baja">
                          {new Date(insc.fechaBajaInscripcion).toLocaleDateString('es-ES')}
                        </span>
                      ) : (
                        <span className="no-fecha">-</span>
                      )}
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <DeleteButton
                          onClick={() =>
                            handleClick("Dar de Baja Inscripción", insc, ModalType.DELETE)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
      {showModal && (
        <InscripcionClaseModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          inscripcion={inscripcion}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default InscripcionClaseTable;
