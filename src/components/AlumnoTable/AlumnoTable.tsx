import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from "../../types";
import AlumnoModal from "../AlumnoModal/AlumnoModal";
import ContactosModal from "../ContactosModal/ContactosModal";
import FichasMedicasModal from "../FichasMedicasModal/FichasMedicasModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import type {
  AlumnoDTO,
  ContactoEmergenciaDTO,
  FichaMedicaDTO,
} from "../../types";
import { AlumnoService } from "../../services/AlumnoService";
import EmptyState from "../EmptyState/EmptyState";
import "./AlumnoTable.css";

const AlumnoTable = () => {
  const initializableNewAlumno = (): AlumnoDTO => ({
    fechaBajaAlumno: null,
    nroAlumno: 0,
    dniAlumno: 0,
    domicilioAlumno: "",
    fechaNacAlumno: new Date(),
    nombreAlumno: "",
    apellidoAlumno: "",
    telefonoAlumno: 0,
    mailAlumno: "",
    localidadAlumno: null,
    contactosEmergencia: [
      {
        id: 0,
        direccionContacto: "",
        nombreContacto: "",
        telefonoContacto: 0,
      },
    ],
    fichaMedicaDTO: [
      {
        id: 0,
        fechaHoraBaja: null,
        archivo: new Uint8Array(),
      },
    ],
  });

  const [alumno, setAlumno] = useState<AlumnoDTO>(initializableNewAlumno());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");
  const [alumnos, setAlumnos] = useState<AlumnoDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  // Estados para modales de contactos y fichas médicas
  const [showContactosModal, setShowContactosModal] = useState(false);
  const [showFichasModal, setShowFichasModal] = useState(false);
  const [selectedAlumnoForModals, setSelectedAlumnoForModals] =
    useState<AlumnoDTO | null>(null);

  const handleClick = (
    newTitle: string,
    alumnoData: AlumnoDTO,
    modal: ModalType
  ) => {
    setTitle(newTitle);
    setModalType(modal);
    setAlumno(alumnoData);
    setShowModal(true);
  };

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const data = await AlumnoService.getAlumnos();
        setAlumnos(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching alumnos:", error);
        setIsLoading(false);
      }
    };
    fetchAlumnos();
  }, [refreshData]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getContactosCount = (contactos: ContactoEmergenciaDTO[]) => {
    return contactos ? contactos.length : 0;
  };

  const hasFichaMedica = (fichaMedicas: FichaMedicaDTO[]) => {
    return (
      fichaMedicas &&
      fichaMedicas.length > 0
    );
  };
  const isAlumnoActivo = (fechaBajaAlumno: Date | null) => {
    return fechaBajaAlumno === null;
  };

  const handleContactosClick = (alumno: AlumnoDTO) => {
    setSelectedAlumnoForModals(alumno);
    setShowContactosModal(true);
  };

  const handleFichasClick = (alumno: AlumnoDTO) => {
    setSelectedAlumnoForModals(alumno);
    setShowFichasModal(true);
  };

  return (
    <div className="alumno-table-container">
      <div className="page-header">
        <div className="page-title">
          <h1>👨‍🎓 Gestión de Alumnos</h1>
          <p className="page-subtitle">Administra los alumnos del sistema</p>
        </div>
        <Button
          className="btn btn-primary btn-add"
          onClick={() =>
            handleClick(
              "Añadir Alumno",
              initializableNewAlumno(),
              ModalType.CREATE
            )
          }
        >
          <span className="btn-icon">+</span>
          Nuevo Alumno
        </Button>
      </div>
      {isLoading ? (
        <div className="loader-container">
          <Loader variant="container" />
        </div>
      ) : alumnos.length === 0 ? (
        <EmptyState
          title="No hay alumnos registrados"
          message="Aún no se han registrado alumnos en el sistema. Haz clic en 'Nuevo Alumno' para comenzar a agregar alumnos."
          icon="👨‍🎓"
        />
      ) : (
        <div className="table-container">
          <Table className="table-modern" striped bordered hover>
            <thead>
              <tr>
                <th>AlumnoNro</th>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Fecha Nacimiento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Domicilio</th>
                <th>Localidad</th>
                <th>Contactos Emergencia</th>
                <th>Estado</th>
                <th>Ficha Médica</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.nroAlumno} className="table-row-modern">
                  <td className="text-center">{alumno.nroAlumno}</td>
                  <td className="text-center">{alumno.dniAlumno}</td>
                  <td>
                    <strong>
                      {alumno.nombreAlumno} {alumno.apellidoAlumno}
                    </strong>
                  </td>
                  <td className="text-center">
                    {formatDate(alumno.fechaNacAlumno)}
                  </td>
                  <td className="text-center">{alumno.telefonoAlumno}</td>
                  <td>
                    <span className="email-cell">{alumno.mailAlumno}</span>
                  </td>
                  <td>
                    <span className="domicilio-cell">
                      {alumno.domicilioAlumno}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="localidad-badge">
                      {alumno.localidadAlumno?.nombreLocalidad || "N/A"}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`contactos-badge ${
                        getContactosCount(alumno.contactosEmergencia) > 0
                          ? "has-contacts"
                          : "no-contacts"
                      }`}
                    >
                      {getContactosCount(alumno.contactosEmergencia)} contacto
                      {getContactosCount(alumno.contactosEmergencia) !== 1
                        ? "s"
                        : ""}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`ficha-badge ${
                        isAlumnoActivo(alumno.fechaBajaAlumno)
                          ? "has-ficha"
                          : "no-ficha"
                      }`}
                    >
                      {isAlumnoActivo(alumno.fechaBajaAlumno)
                        ? "Activo"
                        : "Inactivo"}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={`ficha-badge ${
                        hasFichaMedica(alumno.fichaMedicaDTO)
                          ? "has-ficha"
                          : "no-ficha"
                      }`}
                    >
                      {hasFichaMedica(alumno.fichaMedicaDTO)
                        ? "📄 Presente"
                        : "❌ Sin ficha"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleContactosClick(alumno)}
                        className="btn-action"
                        title="Ver contactos de emergencia"
                      >
                        🚨
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleFichasClick(alumno)}
                        className="btn-action"
                        title="Ver fichas médicas"
                      >
                        🏥
                      </Button>
                      <EditButton
                        onClick={() =>
                          handleClick("Editar alumno", alumno, ModalType.UPDATE)
                        }
                      />
                      <DeleteButton
                        onClick={() =>
                          handleClick("Borrar Alumno", alumno, ModalType.DELETE)
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {showModal && (
        <AlumnoModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          alumno={alumno}
          title={title}
          refreshData={setRefreshData}
        />
      )}

      {/* Modal de Contactos de Emergencia */}
      {showContactosModal && selectedAlumnoForModals && (
        <ContactosModal
          show={showContactosModal}
          onHide={() => setShowContactosModal(false)}
          contactos={selectedAlumnoForModals.contactosEmergencia || []}
          alumnoNombre={`${selectedAlumnoForModals.nombreAlumno} ${selectedAlumnoForModals.apellidoAlumno}`}
        />
      )}

      {/* Modal de Fichas Médicas */}
      {showFichasModal && selectedAlumnoForModals && (
        <FichasMedicasModal
          show={showFichasModal}
          onHide={() => setShowFichasModal(false)}
          alumnoId={selectedAlumnoForModals.nroAlumno}
          alumnoNombre={`${selectedAlumnoForModals.nombreAlumno} ${selectedAlumnoForModals.apellidoAlumno}`}
        />
      )}
    </div>
  );
};

export default AlumnoTable;
